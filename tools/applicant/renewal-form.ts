import { gql } from '@apollo/client'; // gql tag
import {
  CreateExternalRenewalApplicationResult,
  MutationCreateExternalRenewalApplicationArgs,
} from '@lib/graphql/types'; // GraphQL types
import Client from 'shopify-buy';

// Create external renewal application mutation
export const CREATE_EXTERNAL_RENEWAL_APPLICATION_MUTATION = gql`
  mutation CreateExternalRenewalApplicationMutation(
    $input: CreateExternalRenewalApplicationInput!
  ) {
    createExternalRenewalApplication(input: $input) {
      ok
      applicationId
    }
  }
`;

// Create renewal application mutation arguments
export type CreateExternalRenewalApplicationRequest = MutationCreateExternalRenewalApplicationArgs;

// Create renewal application mutation result
export type CreateExternalRenewalApplicationResponse = {
  createExternalRenewalApplication: CreateExternalRenewalApplicationResult;
};

/** Prepare Shopify checkout and redirect user */
export const shopifyCheckout = async (applicationId: number): Promise<void> => {
  /* Setup Shopify Checkout on success. */
  const client = Client.buildClient({
    domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN as string,
    storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
  });

  // Product id can be found when viewing URL in Shopify admin (e.g poppy-hazel.myshopify.com/admin/products/6570386915350).
  // Shopify SDK only accepts encoded product id.
  const productId = `gid://shopify/Product/${process.env.NEXT_PUBLIC_SHOPIFY_PERMIT_PRODUCT_ID}`;
  const encodedId = Buffer.from(productId).toString('base64');

  // Fetching product and creating the cart are independent so both can run in parallel.
  const productPromise = client.product.fetch(encodedId);
  const cartPromise = client.checkout.create();

  // Wait for product and cart.
  const [product, cart] = await Promise.all([productPromise, cartPromise]);

  // Add product to cart.
  // Add custom attributes to be returned by shopify webhook
  // Attributes with leading _ are hidden in the shopify checkout page
  const lineItemsToAdd = [
    {
      variantId: product.variants[0].id,
      quantity: 1,
      customAttributes: [{ key: '_applicationId', value: applicationId.toString() }],
    },
  ];
  await client.checkout.addLineItems(cart.id, lineItemsToAdd);

  // Open checkout window.
  window.location.href = cart.webUrl;
};
