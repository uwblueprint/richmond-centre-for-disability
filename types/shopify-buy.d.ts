// Override Shopify Buy SDK Cart Type
import { Cart } from 'shopify-buy'; // eslint-disable-line @typescript-eslint/no-unused-vars

declare module 'shopify-buy' {
  export interface Cart extends Cart {
    /**
     * Add checkout URL for current cart.
     * Do not use checkoutUrl field as it is outdated.
     */
    webUrl: string;
  }
}
