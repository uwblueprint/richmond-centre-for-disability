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

  const definition = pdfDefinition({
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
const pdfDefinition = (input: {
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
      rcd: 'public/assets/logo.png',
    },
  };
};
