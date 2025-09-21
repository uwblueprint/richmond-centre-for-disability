import logger from '@lib/utils/logging';
import pdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

const walletCardPdfDefinition = (
  permitId: number,
  permitExpiry: Date,
  firstName: string,
  lastName: string,
  dateOfBirth: Date,
  userId: string
) => {
  const pad2Dig = (amount: number) => {
    if (amount < 10) {
      return '0' + amount.toString();
    }
    return amount.toString();
  };

  // Pixel Constants for 2.75" x 1.25" wallet card
  const PTS_TO_INCH = 72;
  const CARD_WIDTH = 2.75 * PTS_TO_INCH; // 198 points
  const CARD_HEIGHT = 1.25 * PTS_TO_INCH; // 90 points
  const MARGIN = 4; // Small margin for content

  // Text
  const headerText = 'Richmond Centre For Disability';
  const footerText = '604.232.2404  parkingpermit@rcdrichmond.org';

  return {
    content: [
      // Card border
      {
        canvas: [
          {
            type: 'rect',
            x: 1,
            y: 1,
            w: CARD_WIDTH - 2,
            h: CARD_HEIGHT - 2,
            r: 6,
            color: 'white',
            lineColor: 'black',
            lineWidth: 1.5,
          },
        ],
      },
      // Header
      {
        text: headerText,
        style: 'header',
        absolutePosition: {
          x: 0,
          y: MARGIN + 3,
        },
        width: CARD_WIDTH,
      },
      // Permit information
      {
        text: [
          { text: 'Permit # ', style: 'label' },
          { text: permitId.toString(), style: 'value' },
          { text: '    Expiry: ', style: 'label' },
          {
            text: permitExpiry.getFullYear() + '-' + pad2Dig(permitExpiry.getMonth() + 1),
            style: 'value',
          },
        ],
        absolutePosition: { x: MARGIN + 6, y: MARGIN + 20 },
      },
      // Name
      {
        text: [
          { text: 'Name: ', style: 'label' },
          { text: firstName + ' ' + lastName, style: 'value' },
        ],
        absolutePosition: { x: MARGIN + 6, y: MARGIN + 36 },
      },
      // Month of birth and User ID
      {
        text: [
          { text: 'MoB: ', style: 'label' },
          {
            text: dateOfBirth.getFullYear() + '-' + pad2Dig(dateOfBirth.getMonth() + 1),
            style: 'value',
          },
          { text: '    User # ', style: 'label' },
          { text: userId, style: 'value' },
        ],
        absolutePosition: { x: MARGIN + 6, y: MARGIN + 52 },
      },
      // Footer
      {
        text: footerText,
        style: 'footer',
        absolutePosition: {
          x: MARGIN,
          y: CARD_HEIGHT - MARGIN - 11,
        },
        width: CARD_WIDTH - MARGIN * 2,
      },
    ],
    styles: {
      header: {
        fontSize: 9,
        bold: true,
        alignment: 'center',
      },
      label: {
        fontSize: 8,
        bold: false,
        alignment: 'left',
      },
      value: {
        fontSize: 8,
        bold: true,
        alignment: 'left',
      },
      footer: {
        fontSize: 8,
        bold: false,
        alignment: 'center',
      },
    },
    defaultStyle: {
      font: 'Helvetica',
    },
    pageSize: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
    },
    pageMargins: [0, 0, 0, 0] as [number, number, number, number],
  };
};

export const generateWalletCardPDF = (
  permitId: number,
  permitExpiry: Date,
  firstName: string,
  lastName: string,
  dateOfBirth: Date,
  userId: string
): PDFKit.PDFDocument | null => {
  let pdfDoc = null;
  try {
    const printer = new pdfPrinter({
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    });
    const documentDef = walletCardPdfDefinition(
      permitId,
      permitExpiry,
      firstName,
      lastName,
      dateOfBirth,
      userId
    );
    pdfDoc = printer.createPdfKitDocument(documentDef as TDocumentDefinitions);
    pdfDoc.end();
  } catch (err) {
    logger.error({ error: err }, 'Error Generating Wallet PDF: ', err);
    return null;
  }
  return pdfDoc;
};
