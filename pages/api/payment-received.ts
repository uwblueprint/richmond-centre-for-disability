import { NextApiRequest, NextApiResponse } from 'next';
import { ShopifyPaymentStatus } from '@prisma/client'; // Prisma client

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const applicationId = req.body.line_items[0].properties[0].applicationId;
    const shopifyOrderId = req.body.id;
    try {
      const applicationIdInt = parseInt(applicationId);

      await prisma.application.update({
        where: { id: applicationIdInt },
        data: {
          shopifyPaymentStatus: ShopifyPaymentStatus.RECEIVED,
          shopifyConfirmationNumber: shopifyOrderId,
          paidThroughShopify: true,
        },
      });
    } catch {
      // what to do here
      //   console.log('bruh');
    }

    // if (!updatedApplication) {
    //   throw new ApolloError('Application general information was unable to be created');
    // }

    res.status(200);
  } else {
    res.status(405).end('Method not allowed');
  }
};

// caee3dca5c7da804be9ae6d4aa4d299c2192191f435c2af9655ec214a799399a

export default handler;
