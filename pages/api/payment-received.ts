import { NextApiHandler } from 'next'; // Next
import { Prisma, ShopifyPaymentStatus } from '@prisma/client'; // Prisma client
import prisma from '@prisma/index'; // Prisma client
import crypto from 'crypto'; // Verifying Shopify Request
import getRawBody from 'raw-body';
import sendConfirmationEmail from '@lib/applications/sendConfirmationEmail';
import { stripPostalCode } from '@lib/utils/format';
import logger from '@lib/utils/logging';

/**
 * Webhook to handle payment submission from Shopify

 * Example request body:
    * {
    *  id: '4646400131094',
    *  total_tip_received: '31.00',
    *  order_id: '8',
    *  billing_address: {
    *   address1: '165 University Avenue West',
    *   city: 'Waterloo',
    *   zip: 'N2L 3E8',
    *   country: 'Canada',
    *   address2: '',
    *   name: 'Oustan Ding',
    *   province_code: 'ON'
    *  }
    *    ...
    *  line_items: [{
    *      ...
    *      name: '$XX Donation', // ** If there is no Donation, this line item will not be included
    *      properties: [
    *        { name: '_item', 'value: 'donation' },
    *        { name: '_applicationId', 'value: '7' },
    *        { name: '_donationAmount', 'value: 'XX' },
    *      ]
    *      ...
    *    }, {
    *      ...
    *      name: 'Parking Permit'
    *      properties: [
    *        { name: '_item', 'value: 'permit' },
    *        { name: '_applicationId', 'value: '7' },
    *      ]
    *      ...
    *    }]
    * }
 */
const paymentReceivedHandler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    logger.error('Failed to process payment received webhook payload, method not allowed');
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
    logger.error(
      { req, rawBody },
      `Failed to process payment received webhook payload, response did not come from Shopify`
    );
    return res.status(401).end();
  }

  try {
    // Since Next.js Parser is disabled, we need to do our own parsing
    const body = JSON.parse(rawBody);
    req.body = body;

    const lineItems: Array<any> = req.body.line_items;
    let applicationId: number;
    let donationAmount: Prisma.Decimal;

    if (lineItems.length === 1) {
      // Only one item (permit), so donation is 0
      const permitItem = lineItems[0];
      const rawApplicationId: string = permitItem.properties.find(
        (property: any) => property.name === '_applicationId'
      ).value;
      applicationId = parseInt(rawApplicationId);
      donationAmount = new Prisma.Decimal(0);
    } else if (lineItems.length === 2) {
      // Two items (permit, donation), nonzero donation
      // Either item will have application ID
      const [item1, item2] = lineItems;
      const permitItem =
        item1.properties.find((property: any) => property.name === '_item').value === 'permit'
          ? item1
          : item2;
      const donationItem =
        item1.properties.find((property: any) => property.name === '_item').value === 'donation'
          ? item1
          : item2;

      const rawApplicationId: string = permitItem.properties.find(
        (property: any) => property.name === '_applicationId'
      ).value;
      applicationId = parseInt(rawApplicationId);

      donationAmount = new Prisma.Decimal(
        donationItem.properties.find((property: any) => property.name === '_donationAmount').value
      );
    } else {
      throw new Error(`Invalid number of line items: ${lineItems.length}`);
    }

    const shopifyOrderId = req.body.id;
    const shopifyOrderNumber = req.body.number;
    const email = req.body.email; // Applicant email entered in Shopify checkout

    // Get email and first name that were inputted in original application, if exists
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: { email: true, firstName: true },
    });

    if (!application) {
      // Bad request, occurs if application with given applicationId does not exist
      return res.status(400).send({ error: 'Application with given id does not exist' });
    }

    const applicationEmail = application.email;
    const applicationFirstName = application.firstName;

    // Parse billing information
    const rawBillingInformation = req.body.billing_address;
    const billingInformation = rawBillingInformation
      ? {
          billingFullName: rawBillingInformation.name,
          billingAddressLine1: rawBillingInformation.address1,
          billingAddressLine2: rawBillingInformation.address2,
          billingCity: rawBillingInformation.city,
          billingProvince: rawBillingInformation.province_code,
          billingCountry: rawBillingInformation.country,
          billingPostalCode: stripPostalCode(rawBillingInformation.zip),
        }
      : {};

    // Update application
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        shopifyPaymentStatus: ShopifyPaymentStatus.RECEIVED,
        shopifyConfirmationNumber: `${shopifyOrderId}`,
        shopifyOrderNumber: `${shopifyOrderNumber}`,
        paidThroughShopify: true,
        donationAmount: donationAmount,
        // Billing information
        billingAddressSameAsHomeAddress: !rawBillingInformation, // Default to true if no billing address in Shopify payload
        ...billingInformation,
      },
    });

    // Send confirmation email
    if (applicationEmail) {
      // Send confirmation email to email originally entered in application
      // (intended for application confirmation), if exists
      await sendConfirmationEmail(applicationEmail, applicationFirstName);
    } else if (email) {
      // If no email was provided in original application, fall back to email
      // provided in Shopify checkout (intended for payment confirmation),
      // if exists
      await sendConfirmationEmail(email, applicationFirstName);
    }
  } catch (err) {
    // TODO: Add some sort of logging or notification
    logger.error({ rawBody, error: err }, `Failed to process webhook payload`);
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
