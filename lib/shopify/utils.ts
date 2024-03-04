import Client from 'shopify-buy';

/**
 * Possible donation amounts in dollars,
 * configured in env variable (SHOPIFY_DONATION_PRODUCT_IDS)
 */
export type DonationAmount = 0 | 5 | 10 | 25 | 50 | 75 | 100 | 200;

/**
 * ShopifyCheckout class
 * Initializes a Shopify checkout to pay for an APP and possible donation
 */
export class ShopifyCheckout {
  /** Product ID of permit */
  #permitProductId = `gid://shopify/Product/${process.env.SHOPIFY_PERMIT_PRODUCT_ID}`;

  /** Shopify buy client */
  #client = Client.buildClient({
    domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN as string,
    storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
  });

  /** Map of donation amount to the donation product IDs */
  #donationProducts: Record<DonationAmount, string>;

  constructor() {
    // Initialize donation products
    const donationProductsString = process.env.SHOPIFY_DONATION_PRODUCT_IDS;
    if (!donationProductsString) {
      throw new Error('Donation products env variable not set');
    }

    const donationAmountEntries = donationProductsString.split(',').map(donationAmountProductId => {
      const [donationAmountString, productId] = donationAmountProductId.split(':');
      return [
        parseInt(donationAmountString) as DonationAmount,
        `gid://shopify/Product/${productId}`,
      ];
    });

    this.#donationProducts = Object.fromEntries(donationAmountEntries);
  }

  /**
   * Encode a product ID as a base64 string to send to Shopify
   * @param productId Product ID
   * @returns base64-encoded product ID
   */
  #encodeProductId(productId: string): string {
    return Buffer.from(productId).toString('base64');
  }

  /**
   * Set up Shopify checkout and get the checkout URL
   * @param applicationId Application ID to be paid for
   * @param donationAmount Donation amount in dollars (5, 10, 25, 50, 75, 100, 200), default 0
   * @returns Shopify checkout URL
   */
  async setUpCheckout(applicationId: number, donationAmount: DonationAmount = 0): Promise<string> {
    // Fetching products and creating the cart are independent so both can run in parallel.
    const permitPromise = this.#client.product.fetch(this.#encodeProductId(this.#permitProductId));
    const cartPromise = this.#client.checkout.create();

    // No donation made (only item in cart is the permit)
    if (donationAmount === 0) {
      // Wait for permit product and cart.
      const [permitProduct, cart] = await Promise.all([permitPromise, cartPromise]);

      // Add product to cart.
      // Add custom attributes to be returned by shopify webhook
      // Attributes with leading _ are hidden in the shopify checkout page
      const lineItemsToAdd = [
        {
          variantId: permitProduct.variants[0].id,
          quantity: 1,
          customAttributes: [
            { key: '_item', value: 'permit' },
            { key: '_applicationId', value: applicationId.toString() },
          ],
        },
      ];
      await this.#client.checkout.addLineItems(cart.id, lineItemsToAdd);

      return cart.webUrl;
    }

    // Donation made (need to add donation product to cart)
    const donationProductId = this.#donationProducts[donationAmount];
    const donationPromise = this.#client.product.fetch(this.#encodeProductId(donationProductId));

    // Wait for product and cart.
    const [permitProduct, donationProduct, cart] = await Promise.all([
      permitPromise,
      donationPromise,
      cartPromise,
    ]);

    // Add products to cart.
    // Add custom attributes to be returned by shopify webhook
    // Attributes with leading _ are hidden in the shopify checkout page
    const lineItemsToAdd = [
      {
        variantId: permitProduct.variants[0].id,
        quantity: 1,
        customAttributes: [
          { key: '_item', value: 'permit' },
          { key: '_applicationId', value: applicationId.toString() },
        ],
      },
      {
        variantId: donationProduct.variants[0].id,
        quantity: 1,
        customAttributes: [
          { key: '_item', value: 'donation' },
          { key: '_applicationId', value: applicationId.toString() },
          { key: '_donationAmount', value: donationAmount.toString() },
        ],
      },
    ];
    await this.#client.checkout.addLineItems(cart.id, lineItemsToAdd);

    return cart.webUrl;
  }
}
