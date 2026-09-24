import pdfPrinter from 'pdfmake';
import { Application, Prisma } from '@prisma/client';
import { Session } from 'next-auth';
import { formatFullName, formatPostalCode } from '@lib/utils/format';
import { formatDateYYYYMMDDLocalTimezone } from '@lib/utils/date'; // Date formatter util
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
  receiptNumber: string,
  dateIssued = new Date()
): PDFKit.PDFDocument => {
  return createPdfDocument(
    getApplicationInvoicePdfDefinition(application, session, appNumber, receiptNumber, dateIssued)
  );
};

const getApplicationInvoicePdfDefinition = (
  application: Application,
  session: Session,
  appNumber: number,
  receiptNumber: string,
  dateIssued: Date
): any => {
  const {
    applicantId,
    firstName,
    middleName,
    lastName,
    permitType,
    processingFee,
    paymentMethod,
    donationAmount,
    secondProcessingFee,
    secondPaymentMethod,
    secondDonationAmount,
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
  if (secondPaymentMethod && secondProcessingFee && !secondProcessingFee.equals(0)) {
    paymentItems.push({
      item: `PP # ${appNumber} second payment method`,
      amount: secondProcessingFee,
      paidBy: secondPaymentMethod,
      subtotal: secondProcessingFee,
    });
    totalAmount = totalAmount.plus(secondProcessingFee);
  }
  if (secondPaymentMethod && secondDonationAmount && !secondDonationAmount.equals(0)) {
    paymentItems.push({
      item: 'Donation second payment method',
      amount: secondDonationAmount,
      paidBy: secondPaymentMethod,
      subtotal: secondDonationAmount,
    });
    totalAmount = totalAmount.plus(secondDonationAmount);
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
    dateIssued,
    issuedBy: employeeInitials,
    paymentItems,
    totalAmount,
    address,
  });
  return definition;
};

const createPdfDocument = (definition: any): PDFKit.PDFDocument => {
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
            image: 'logoVertical',
            width: 50,
          },
          {
            text: [
              { text: 'RICHMOND CENTRE FOR DISABILITY', style: 'header' },
              '\n\n',
              { text: 'Accessible Parking Permit Receipt', style: 'subheader' },
            ],
            margin: [0, 10, 0, 0],
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
            [
              { text: 'Date Issued:', alignment: 'right' },
              formatDateYYYYMMDDLocalTimezone(dateIssued),
            ],
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
          '#150 - 5520 McNaughton Rd., Richmond, BC V6X 0X8',
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
        lineHeight: 1.4,
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
      logoVertical: 'public/assets/logo-vertical.png',
    },
  };
};

type DonationTaxReceiptRecipient = {
  name: string;
  address: {
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    province: string;
    country: string;
    postalCode: string;
  };
};

const getDonationReceivedDate = (application: Application): Date => {
  return application.donationReceivedAt || application.createdAt;
};

/** Resolve the legal donor identity exclusively from APPOP billing information. */
export const getDonationTaxReceiptRecipient = (
  application: Application
): DonationTaxReceiptRecipient => {
  if (application.billingAddressSameAsHomeAddress) {
    return {
      name: formatFullName(application.firstName, application.middleName, application.lastName),
      address: {
        addressLine1: application.addressLine1,
        addressLine2: application.addressLine2,
        city: application.city,
        province: application.province,
        country: application.country,
        postalCode: application.postalCode,
      },
    };
  }

  if (
    !application.billingFullName ||
    !application.billingAddressLine1 ||
    !application.billingCity ||
    !application.billingProvince ||
    !application.billingCountry ||
    !application.billingPostalCode
  ) {
    throw new Error('Billing information is incomplete');
  }

  return {
    name: application.billingFullName,
    address: {
      addressLine1: application.billingAddressLine1,
      addressLine2: application.billingAddressLine2,
      city: application.billingCity,
      province: application.billingProvince,
      country: application.billingCountry,
      postalCode: application.billingPostalCode,
    },
  };
};

/**
 * Preserve the bundled donation receipt for applications created before the
 * standalone receipt flow was enabled.
 */
export const generateLegacyDonationInvoicePdf = (
  application: Application,
  session: Session,
  appNumber: number,
  receiptNumber: string,
  dateIssued: Date
): PDFKit.PDFDocument => {
  const invoiceDefinition = getApplicationInvoicePdfDefinition(
    application,
    session,
    appNumber,
    receiptNumber,
    dateIssued
  );
  const { name: donorName, address } = getDonationTaxReceiptRecipient(application);
  const donationDefinition = donationTaxReceiptPdfDefinition({
    donorName,
    appNumber,
    receiptNumber: `PPD_${formatDateYYYYMMDDLocalTimezone(dateIssued).replace(
      /-/g,
      ''
    )}_${appNumber}`,
    dateIssued,
    dateDonationReceived: getDonationReceivedDate(application),
    donationAmount: application.donationAmount.plus(application.secondDonationAmount || 0),
    address,
  });
  const [donationFirstPage, ...donationContent] = donationDefinition.content;

  return createPdfDocument({
    ...invoiceDefinition,
    footer: donationDefinition.footer,
    content: [
      ...invoiceDefinition.content,
      { ...donationFirstPage, pageBreak: 'before' },
      ...donationContent,
    ],
    styles: { ...invoiceDefinition.styles, ...donationDefinition.styles },
    defaultStyle: donationDefinition.defaultStyle,
    images: { ...invoiceDefinition.images, ...donationDefinition.images },
  });
};

/**
 * Generate a standalone donation tax receipt PDF.
 */
export const generateDonationTaxReceiptPdf = (
  application: Application,
  appNumber: number,
  receiptNumber: string,
  dateIssued: Date
): PDFKit.PDFDocument => {
  const { name: donorName, address } = getDonationTaxReceiptRecipient(application);
  const definition = donationTaxReceiptPdfDefinition({
    donorName,
    appNumber,
    receiptNumber,
    dateIssued,
    dateDonationReceived: getDonationReceivedDate(application),
    donationAmount: application.donationAmount.plus(application.secondDonationAmount || 0),
    address,
  });
  return createPdfDocument(definition);
};

/** PDF generation schema */
const donationTaxReceiptPdfDefinition = (input: {
  donorName: string;
  appNumber: number | null;
  receiptNumber: string;
  dateIssued: Date;
  dateDonationReceived: Date;
  donationAmount: Prisma.Decimal;
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
    donorName,
    appNumber,
    receiptNumber,
    donationAmount,
    dateIssued,
    dateDonationReceived,
    address,
  } = input;

  return {
    footer: function (currentPage: number, pageCount: number) {
      return currentPage == pageCount
        ? {
            text: `For information on all registered charities in Canada under the Income Tax Act please contact: Canada Revenue Agency canada.ca/charities-giving `,
            style: 'footer',
          }
        : null;
    },
    content: [
      {
        image: 'logoNew',
        width: 450,
        alignment: 'center',
        margin: [0, 0, 0, 10],
      },
      {
        text: `Official Donation Receipt for Income Tax Purposes - ${formatDateYYYYMMDDLocalTimezone(
          dateIssued
        ).slice(0, 4)}`,
        style: 'subheader',
      },

      {
        columns: [
          {
            stack: [
              {
                table: {
                  heights: 18,
                  body: [
                    [{ text: 'Tax Receipt #:' }, receiptNumber],
                    [
                      { text: 'Donated by:' },
                      {
                        text: [
                          `${donorName}\n`,
                          `${address.addressLine2 ? `${address.addressLine2} - ` : ''}${
                            address.addressLine1
                          }\n`,
                          `${address.city} ${address.province} ${formatPostalCode(
                            address.postalCode
                          )}\n`,
                          address.country,
                        ],
                        lineHeight: 1.4,
                      },
                    ],
                  ],
                },
                layout: 'noBorders',
                margin: [0, 0, 0, 40],
              },
              {
                table: {
                  heights: 18,
                  body: [
                    [{ text: 'Date Receipt Issued:' }, formatDateYYYYMMDDLocalTimezone(dateIssued)],
                    [{ text: 'Location Receipt Issued:' }, 'Richmond, BC'],
                  ],
                },
                margin: [0, 0, 0, 15],
                layout: 'noBorders',
              },
              { image: 'signature', width: 200, margin: [0, 0, 0, 5] },
              { text: 'Authorized Signature:' },
            ],
          },

          {
            table: {
              heights: 18,
              body: [
                [
                  { text: 'Date Donation Received:' },
                  formatDateYYYYMMDDLocalTimezone(dateDonationReceived),
                ],
                [{ text: 'Donor Number:' }, `P${appNumber}`],
                [{ text: 'Total Amount Received:' }, `$${donationAmount.toString()}`],
                [{ text: 'Amount of Advantage:' }, '$0.00'],
                [{ text: 'Description of Advantage:' }, 'None'],
                [
                  { text: 'Eligible Amount of Gift for Tax Purposes:' },
                  `$${donationAmount.toString()}`,
                ],
                [{ text: '' }, ''],
                [{ text: 'Where Applicable', bold: true }, ''],
                [
                  {
                    text: [
                      'Description of Items Received:\n\n',
                      'Appraised By:\n\n',
                      'Address of Appraiser:\n\n',
                    ],
                  },
                  '',
                ],
              ],
            },
            layout: 'noBorders',
            margin: [15, 0, 0, 0],
          },
        ],
        margin: [0, 25, 0, 0],
      },
      {
        text: [
          `Dear ${donorName}\n\n\n`,
          'On behalf of the Richmond Centre for disABILITY (RCD), we wish to express our sincerest thanks and appreciation for your generous support. Please find enclosed your official tax receipt.\n\n',
          "Your generosity ensures our vital programs remain available, enabling persons with a disability to live and work independently, make informed choices, and achieve full inclusion in our community. By supporting RCD, you are helping to provide the tools, training, and programs that lead to real, lasting change in someone's life.\n\n",
          'Thank you for being part of our community. Your support is impactful and meaningful to all the people with disabilities that we serve.\n\n\n',
          'Sincerely,\n\n\n',
          'RICHMOND CENTRE FOR DISABILITY\n',
          '(Charity Number: 88832-8432-RR0001)\n',
          '#150 - 5520 McNaughton Rd.\n',
          'Richmond, BC V6X 0X8\n',
          'Tel: 604-232-2404\n',
          'Website: ',
          { text: 'www.rcdrichmond.org', decoration: 'underline' },
          '\n',
        ],
        margin: [0, 15, 0, 0],
      },
    ],
    styles: {
      header: {
        fontSize: 25,
        bold: true,
        alignment: 'center',
        lineHeight: 1.5,
      },
      tableHeader: {
        bold: true,
        alignment: 'center',
      },
      subheader: {
        fontSize: 17.5,
        alignment: 'center',
      },
      footer: {
        fontSize: 7.5,
        alignment: 'center',
      },
    },
    defaultStyle: {
      font: 'Helvetica',
      fontSize: 11,
      lineHeight: 1.2,
    },
    images: {
      logoNew: 'public/assets/logo.png',
      logoVertical: 'public/assets/logo-vertical.png',
      signature: 'public/assets/signature.png',
    },
  };
};
