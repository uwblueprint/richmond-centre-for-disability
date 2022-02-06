import { NextApiHandler } from 'next'; // Next
import { Prisma, ShopifyPaymentStatus } from '@prisma/client'; // Prisma client
import crypto from 'crypto'; // Verifying Shopify Request
import getRawBody from 'raw-body';
import sendConfirmationEmail from '@pages/api/sendConfirmationEmail';

/**
 * Webhook to handle payment submission from Shopify

 * Example request body:
    * {
    *  id: '4646400131094'
    *  total_tip_received: '26.00'
    *  order_id: '8'
    *    ...
    *  line_items: [{
    *      ...
    *      name: 'Tip' // ** If there is no Donation, this line item will not be included
    *      ...
    *    }, {
    *      ...
    *      name: 'Permit'
    *      properties: [{name: '_applicationId', 'value: '7'}]
    *      ...
    *    }]
    * }
 */
const paymentReceivedHandler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end('Method not allowed');
  }

  // Shopify Webhook Verification: verify request came from Shopify
  const rawBody = await getRawBody(req, true);
  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const digest = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET as string)
    .update(rawBody)
    .digest('base64');
  if (digest !== hmacHeader) {
    return res.status(401).end();
  }

  try {
    // Since Next.js Parser is disabled, we need to do our own parsing
    const body = JSON.parse(rawBody);
    req.body = body;

    // There may be 1 or 2 line items in the checkout depending if there was a donation or not.
    // We cannot assume ordering is deterministic so check both line items for the properties field.
    const lineItems = req.body.line_items;
    const rawApplicationId =
      lineItems[0]?.properties[0]?.value || lineItems[1]?.properties[0]?.value;
    const applicationId = parseInt(rawApplicationId);

    const shopifyOrderId = req.body.id;
    const donationAmount = new Prisma.Decimal(req.body.total_tip_received);
    const email = req.body.email;

    await prisma.application.update({
      where: { id: applicationId },
      data: {
        shopifyPaymentStatus: ShopifyPaymentStatus.RECEIVED,
        shopifyConfirmationNumber: `${shopifyOrderId}`,
        paidThroughShopify: true,
        donationAmount: donationAmount,
      },
    });

    if (email) {
      await sendConfirmationEmail(email);
    }
  } catch (err) {
    // TODO: Add some sort of logging or notification
    res.status(500).end();
  }

  return res.status(200).end();
};

/**
 * Turn off the default bodyParser provided by Next.js because
 * Shopify Webhook Verification needs the raw request body
 **/
export const config = {
  api: {
    bodyParser: false,
  },
};

export default paymentReceivedHandler;
