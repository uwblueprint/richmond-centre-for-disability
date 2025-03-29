import { GraphQLClient, gql } from 'graphql-request';

/**
 * Response type for the product query.
 * Adjust the fields according to the GraphQL query you’re making.
 */
interface ProductVariantsResponse {
  product: {
    variants: {
      edges: Array<{
        node: {
          id: string;
        };
      }>;
    };
  };
}

/**
 * Response type for the cartCreate mutation
 */
interface CartCreateResponse {
  cartCreate: {
    cart: {
      id: string;
      checkoutUrl: string;
    } | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

/**
 * Possible donation amounts in dollars,
 * configured in env variable (SHOPIFY_DONATION_PRODUCT_IDS)
 */
export type DonationAmount = 0 | 5 | 10 | 25 | 50 | 75 | 100 | 200;

/**
 * Create your own GraphQL client pointing to your store’s Storefront API
 */
const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN as string;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN as string;

// IMPORTANT: Make sure the version here is 2024-07 or later
const storefrontEndpoint = `https://${domain}/api/2024-07/graphql.json`;

// Build a reusable GraphQL client
const graphQLClient = new GraphQLClient(storefrontEndpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    'Content-Type': 'application/json',
  },
});

/**
 * GraphQL mutation to create a cart with line items.
 * We can add one or more items in a single request.
 */
const CART_CREATE_MUTATION = gql`
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
      }
    }
  }
`;

/**
 * ShopifyCheckout class
 * Creates a Shopify cart (instead of the old checkout) to pay for an APP and possible donation
 */
export class ShopifyCheckout {
  /** Product ID of permit */
  #permitProductId = `gid://shopify/Product/${process.env.SHOPIFY_PERMIT_PRODUCT_ID}`;

  /** Map of donation amount to the donation product IDs */
  #donationProducts: Record<DonationAmount, string>;

  constructor() {
    // Initialize donation products
    const donationProductsString = process.env.SHOPIFY_DONATION_PRODUCT_IDS;
    if (!donationProductsString) {
      throw new Error('Donation products env variable not set');
    }

    // e.g. "5:1234567890,10:2345678901"
    const donationAmountEntries = donationProductsString.split(',').map(entry => {
      const [donationAmountString, productId] = entry.split(':');
      return [
        parseInt(donationAmountString) as DonationAmount,
        `gid://shopify/Product/${productId}`,
      ];
    });

    this.#donationProducts = Object.fromEntries(donationAmountEntries);
  }

  /**
   * Replace this with your own method of fetching the
   * "default" variant ID for a given product, or better yet:
   * store variant IDs directly in your .env if you only have 1 variant.
   */
  async #fetchVariantIdForProduct(productGlobalId: string): Promise<string> {
    // Minimal GraphQL product query to grab the first variant
    const PRODUCT_QUERY = gql`
      query ProductVariants($id: ID!) {
        product(id: $id) {
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    `;

    // Provide the ProductVariantsResponse interface as a generic
    const data = await graphQLClient.request<ProductVariantsResponse>(PRODUCT_QUERY, {
      id: productGlobalId,
    });

    const variantId = data.product.variants.edges[0]?.node?.id;
    if (!variantId) {
      throw new Error(`No variants found for product ID: ${productGlobalId}`);
    }
    return variantId;
  }

  /**
   * Create a cart with a permit line item, plus a donation line item if donationAmount > 0.
   * Return the checkoutUrl from the new cart.
   */
  async setUpCheckout(applicationId: number, donationAmount: DonationAmount = 0): Promise<string> {
    // 1) Fetch the permit variant ID
    const permitVariantId = await this.#fetchVariantIdForProduct(this.#permitProductId);

    // 2) Build the base permit line
    const permitLine = {
      merchandiseId: permitVariantId,
      quantity: 1,
      attributes: [
        { key: '_item', value: 'permit' },
        { key: '_applicationId', value: applicationId.toString() },
      ],
    };

    // 3) If donation > 0, fetch donation variant & build line
    const lines = [permitLine];
    if (donationAmount > 0) {
      const donationProductId = this.#donationProducts[donationAmount];
      const donationVariantId = await this.#fetchVariantIdForProduct(donationProductId);

      const donationLine = {
        merchandiseId: donationVariantId,
        quantity: 1,
        attributes: [
          { key: '_item', value: 'donation' },
          { key: '_applicationId', value: applicationId.toString() },
          { key: '_donationAmount', value: donationAmount.toString() },
        ],
      };

      lines.push(donationLine);
    }

    // 4) Create the cart with all line items at once
    const variables = { lines };
    const response = await graphQLClient.request<CartCreateResponse>(
      CART_CREATE_MUTATION,
      variables
    );

    // Because we typed response, `response.cartCreate` is recognized in TS
    const cart = response.cartCreate.cart;
    if (!cart) {
      throw new Error('Failed to create cart');
    }

    return cart.checkoutUrl;
  }
}
