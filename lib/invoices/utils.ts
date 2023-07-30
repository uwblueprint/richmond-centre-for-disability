import pdfPrinter from 'pdfmake';
import { Application, Prisma } from '@prisma/client';
import { Session } from 'next-auth';
import { formatFullName, formatPostalCode } from '@lib/utils/format';
import { formatDateYYYYMMDD } from '@lib/utils/date'; // Date formatter util
import { PaymentType } from '@lib/graphql/types';

/**
 * Generate application invoice PDF
 * @param application application object
 * @param session session object containing employee information
 * @param appNumber APP (parking permit) number
 * @param receiptNumber receipt number
 */
export const generateApplicationInvoicePdf = (
  application: Application,
  session: Session,
  appNumber: number,
  receiptNumber: string
): PDFKit.PDFDocument => {
  const {
    applicantId,
    firstName,
    middleName,
    lastName,
    permitType,
    processingFee,
    paymentMethod,
    donationAmount,
  } = application;
  const applicantName = formatFullName(firstName, middleName, lastName);
  const employeeInitials = `${session.firstName[0].toUpperCase()}${session.lastName[0].toUpperCase()}`;
  let totalAmount: Prisma.Decimal = processingFee;
  const paymentItems = [
    {
      item: `PP # ${appNumber}`,
      amount: processingFee,
      paidBy: paymentMethod,
      subtotal: processingFee,
    },
  ];
  if (!donationAmount.equals(0)) {
    paymentItems.push({
      item: 'Donation',
      amount: donationAmount,
      paidBy: paymentMethod,
      subtotal: donationAmount,
    });
    totalAmount = totalAmount.plus(donationAmount);
  }
  const address = application.shippingAddressSameAsHomeAddress
    ? {
        addressLine1: application.addressLine1,
        addressLine2: application.addressLine2,
        city: application.city,
        province: application.province,
        country: application.country,
        postalCode: application.postalCode,
      }
    : {
        addressLine1: application.shippingAddressLine1 as string,
        addressLine2: application.shippingAddressLine2,
        city: application.shippingCity as string,
        province: application.shippingProvince as string,
        country: application.shippingCountry as string,
        postalCode: application.shippingPostalCode as string,
      };

  const definition = applicationPdfDefinition({
    applicantName,
    userNumber: applicantId,
    permitType,
    receiptNumber,
    dateIssued: new Date(),
    issuedBy: employeeInitials,
    paymentItems,
    totalAmount,
    address,
  });
  const printer = new pdfPrinter({
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique',
    },
  });

  const pdfDocument = printer.createPdfKitDocument(definition);
  pdfDocument.end();
  return pdfDocument;
};

/** PDF generation schema */
const applicationPdfDefinition = (input: {
  applicantName: string;
  userNumber: number | null;
  permitType: string;
  receiptNumber: string;
  dateIssued: Date;
  issuedBy: string;
  paymentItems: Array<{
    item: string;
    amount: Prisma.Decimal;
    paidBy: PaymentType;
    subtotal: Prisma.Decimal;
  }>;
  totalAmount: Prisma.Decimal;
  address: {
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    province: string;
    country: string;
    postalCode: string;
  };
}): any => {
  const {
    applicantName,
    userNumber,
    permitType,
    receiptNumber,
    dateIssued,
    issuedBy,
    paymentItems,
    totalAmount,
    address,
  } = input;

  return {
    content: [
      {
        columns: [
          {
            image: 'rcd',
          },
          {
            text: [
              { text: 'RICHMOND CENTRE FOR DISABILITY', style: 'header' },
              '\n\n',
              { text: 'Accessible Parking Permit Receipt', style: 'subheader' },
            ],
            margin: [-200, 0, 0, 0],
          },
        ],
      },
      {
        table: {
          heights: 20,
          body: [
            [{ text: 'Client Name:', alignment: 'right' }, applicantName],
            [{ text: 'User No.:', alignment: 'right' }, userNumber || 'N/A'],
            [{ text: 'Permit Type:', alignment: 'right' }, permitType],
            [{ text: 'Receipt No.:', alignment: 'right' }, receiptNumber],
            [{ text: 'Date Issued:', alignment: 'right' }, formatDateYYYYMMDD(dateIssued)],
            [{ text: 'Issued By:', alignment: 'right' }, issuedBy],
          ],
        },
        layout: 'noBorders',
        margin: [15, 25, 0, 0],
      },
      {
        style: 'tableExample',
        table: {
          widths: '*',
          heights: ['*', ...Array(paymentItems.length - 1).fill('*'), 175, 20],
          headerRows: 1,
          body: [
            [
              { text: 'Item', style: 'tableHeader' },
              { text: 'Amount', style: 'tableHeader' },
              { text: '', style: 'tableHeader' },
              { text: 'Paid By', style: 'tableHeader' },
              { text: 'Subtotal', style: 'tableHeader' },
            ],
            ...paymentItems.map(({ item, amount, paidBy, subtotal }) => [
              item,
              `$${amount.toString()}`,
              '',
              paidBy,
              `$${subtotal.toString()}`,
            ]),
            ['', '', '', 'Total Amount', `$${totalAmount.toString()}`],
          ],
        },
        layout: {
          hLineWidth: function (i: any, node: any) {
            return i === 0 ||
              i == 1 ||
              i == node.table.body.length ||
              i == node.table.body.length - 1
              ? 1
              : 0;
          },
          fillColor: function (i: any, node: any) {
            return i === 0 || i === node.table.body.length - 1 ? 'lightgray' : 0;
          },
        },
        margin: [0, 10, 0, 0],
      },
      {
        text: [
          'Tel: 604-232-2404, Fax: 604-232-2415 Web: www.rcdrichmond.org\n',
          '#842 - 5300, No.3 RD Lansdowne Centre Richmond BC V6X 2X9',
        ],
        alignment: 'center',
        margin: [0, 15, 0, 0],
        fontSize: 10,
      },
      {
        text: [
          `${applicantName}\n`,
          `${address.addressLine2 ? `${address.addressLine2} - ` : ''}${address.addressLine1}\n`,
          `${address.city} ${address.province} ${formatPostalCode(address.postalCode)}`,
        ],
        absolutePosition: { x: 80, y: 740 },
        fontSize: 12,
        lineHeight: 1.5,
      },
    ],
    styles: {
      header: {
        fontSize: 25,
        bold: true,
        alignment: 'center',
      },
      subheader: {
        fontSize: 20,
        bold: false,
        alignment: 'center',
      },
      tableHeader: {
        bold: true,
        alignment: 'center',
      },
    },
    defaultStyle: {
      font: 'Helvetica',
    },
    images: {
      rcd: 'public/assets/logo.png',
    },
  };
};

/**
 * Generate donation receipt PDF
 * @param application application object
 * @param session session object containing employee information
 * @param receiptNumber receipt number
 */
export const generateDonationReceiptPdf = (
  application: Application,
  session: Session,
  receiptNumber: string
): PDFKit.PDFDocument => {
  const {
    applicantId,
    firstName,
    middleName,
    lastName,
    permitType,
    donationAmount,
    email,
    createdAt,
  } = application;
  const applicantName = formatFullName(firstName, middleName, lastName);
  const employeeInitials = `${session.firstName[0].toUpperCase()}${session.lastName[0].toUpperCase()}`;
  const nonNullEmail = email ? email : '';

  const address = application.shippingAddressSameAsHomeAddress
    ? {
        addressLine1: application.addressLine1,
        addressLine2: application.addressLine2,
        city: application.city,
        province: application.province,
        country: application.country,
        postalCode: application.postalCode,
      }
    : {
        addressLine1: application.shippingAddressLine1 as string,
        addressLine2: application.shippingAddressLine2,
        city: application.shippingCity as string,
        province: application.shippingProvince as string,
        country: application.shippingCountry as string,
        postalCode: application.shippingPostalCode as string,
      };

  const definition = donationPdfDefinition({
    applicantName,
    userNumber: applicantId,
    permitType,
    receiptNumber,
    dateIssued: new Date(),
    dateDonationRecevied: createdAt,
    issuedBy: employeeInitials,
    donationAmount,
    address,
    nonNullEmail,
  });
  const printer = new pdfPrinter({
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique',
    },
  });

  const pdfDocument = printer.createPdfKitDocument(definition);
  pdfDocument.end();
  return pdfDocument;
};

/** PDF generation schema */
const donationPdfDefinition = (input: {
  applicantName: string;
  userNumber: number | null;
  permitType: string;
  receiptNumber: string;
  dateIssued: Date;
  dateDonationRecevied: Date;
  issuedBy: string;
  donationAmount: Prisma.Decimal;
  address: {
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    province: string;
    country: string;
    postalCode: string;
  };
  nonNullEmail: string;
}): any => {
  const {
    applicantName,
    userNumber,
    donationAmount,
    dateIssued,
    dateDonationRecevied,
    address,
    nonNullEmail,
  } = input;

  return {
    footer: {
      text: 'For information on all registered charities in Canada under the Income Tax Act please contact: Canada Revenue Agency www.cra.gc.ca/charities-giving ',
      style: 'footer',
    },
    content: [
      {
        text: [
          { text: 'RICHMOND CENTRE FOR DISABILITY', style: 'header' },
          '\n\n',
          {
            text: `Official Donation Receipt for Income Tax Purposes - ${dateIssued.getFullYear()}`,
            style: 'subheader',
          },
        ],
      },
      {
        columns: [
          {
            table: {
              heights: 20,
              body: [
                [
                  { text: 'Tax Receipt #:' },
                  `PPD_${dateIssued.getFullYear()}${dateIssued.getMonth()}${dateIssued.getDate()}_${userNumber}`,
                ],
                [
                  { text: 'Donated by:' },
                  {
                    text: [
                      `${applicantName}\n`,
                      `${address.addressLine2 ? `${address.addressLine2} - ` : ''}${
                        address.addressLine1
                      }\n`,
                      `${address.city} ${address.province} ${formatPostalCode(address.postalCode)}`,
                    ],
                    fontSize: 12,
                    lineHeight: 1.5,
                  },
                ],
                [{ text: '' }, ''],
                [{ text: '' }, ''],
                [{ text: '' }, ''],
                [{ text: 'Email:' }, nonNullEmail],
                [{ text: 'Date Receipt Issued:' }, formatDateYYYYMMDD(dateIssued)],
                [{ text: 'Location Issued:' }, 'Richmond, BC'],
                [{ text: 'Authorized Signature:' }, { image: 'signature', width: 150 }],
              ],
            },
            layout: 'noBorders',
            margin: [0, 0, 20, 0],
          },
          {
            table: {
              heights: 20,
              body: [
                [{ text: 'Date Donation Received:' }, formatDateYYYYMMDD(dateDonationRecevied)],
                [{ text: 'Donor Number:' }, `P${userNumber}`],
                [{ text: 'Total Amount:' }, `$${donationAmount.toString()}`],
                [{ text: 'Value of Product / Services:' }, ''],
                [
                  { text: 'Eligible Amount of Donation for Tax Purposes:' },
                  `$${donationAmount.toString()}`,
                ],
                [{ text: '' }, ''],
                [{ text: 'Where Applicable', bold: true }, ''],
                [
                  {
                    text: [
                      'Description of Items Received:\n\n',
                      'Apprasied By:\n\n',
                      'Address of Appraiser:\n\n',
                    ],
                  },
                  { image: 'stamp', width: 75 },
                ],
              ],
            },
            layout: 'noBorders',
            margin: [20, 0, 0, 0],
          },
        ],
        margin: [0, 35, 0, 25],
      },
      {
        text: [
          `Dear ${applicantName}\n\n`,
          'On behalf of the Richmond Centre for Disability (RCD), we would like to extend our sincere and\n',
          'heartfelt thanks and appreciation for your donation. Please find your official tax receipt enclosed.\n\n',
          'Through RCD services and support, we have seen the lives of people with disabilities and their\n',
          'families changed for the better. Your generosity does make a difference in the delivery of much\n',
          'coveted services to people with disabilities. The work being undertaken through the RCD is only\n',
          'possible because of caring people like you.\n\n',
          'Thank you again for your valued support.\n\n',
          'Sincerely,\n\n\n',
          'RICHMOND CENTRE FOR DISABILITY\n',
          '(Charity Number: 88832-8432-RR0001)\n',
          '#842 - 5300 No. 3 Road\n',
          'Richmond, BC V6x 2X9\n',
          'Tel: 604-232-2404\n',
          'Website:www.rcdrichmond.org\n',
        ],
        margin: [0, 15, 0, 0],
        fontSize: 12,
      },
    ],
    styles: {
      header: {
        fontSize: 28,
        bold: true,
        alignment: 'center',
      },
      subheader: {
        fontSize: 19,
        alignment: 'center',
      },
      footer: {
        fontSize: 8,
        alignment: 'center',
      },
    },
    defaultStyle: {
      font: 'Helvetica',
      lineHeight: 1.25,
    },
    images: {
      signature: 'public/assets/signature.png',
      stamp: 'public/assets/stamp.png',
    },
  };
};
