import { NextApiRequest, NextApiResponse } from 'next'; // Next
import { ShopifyPaymentStatus } from '@prisma/client'; // Prisma client
import crypto from 'crypto'; // Verifying Shopify Request
import getRawBody from 'raw-body';

export default async function paymentReceivedHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end('Method not allowed');
    return;
  }

  // Verify Request is from Shopify
  const rawBody = await getRawBody(req, true);
  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const digest = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET as string)
    .update(rawBody)
    .digest('base64');
  if (digest !== hmacHeader) {
    res.status(401).end();
    return;
  }

  try {
    // Since Next.js Parser is disabled, we need to do our own parsing
    const body = JSON.parse(rawBody);
    req.body = body;

    // properties = [ { name: 'applicationId', value: '7' } ]
    const rawApplicationId = req.body.line_items[0]?.properties[0]?.value;
    const shopifyOrderId = req.body.id;
    const applicationId = parseInt(rawApplicationId);
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        shopifyPaymentStatus: ShopifyPaymentStatus.RECEIVED,
        shopifyConfirmationNumber: `${shopifyOrderId}`,
        paidThroughShopify: true,
      },
    });
  } catch (err) {
    // TODO: Add some sort of logging or notification
    res.status(500).end();
  }

  res.status(200).end();
  return;
}

// Turn off the default bodyParser provided by Next.js
// Shopify Webhook Verification needs the raw request body
export const config = {
  api: {
    bodyParser: false,
  },
};
