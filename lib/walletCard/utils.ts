import logger from '@lib/utils/logging';
import { PassThrough } from 'stream';
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

  // Pixel Constants for 3.375" x 2.125" wallet card
  const PTS_TO_INCH = 72;
  const CARD_WIDTH = 3.375 * PTS_TO_INCH; // 243 points
  const CARD_HEIGHT = 2.125 * PTS_TO_INCH; // 153 points
  const MARGIN = 8; // Small margin for content

  // Text
  const headerText = 'Richmond Centre\nFor Disability';
  const footerText = '604.232.2404\nparkingpermit@rcdrichmond.org';

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
          y: MARGIN,
        },
        width: CARD_WIDTH,
      },
      {
        stack: [
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
            margin: [0, 0, 0, 1],
          },
          // Name
          {
            text: [
              { text: 'Name: ', style: 'label' },
              { text: firstName + ' ' + lastName, style: 'value' },
            ],
            margin: [0, 0, 0, 1],
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
          },
        ],
        absolutePosition: { x: MARGIN + 6, y: MARGIN + 44 },
      },
      // Footer
      {
        text: footerText,
        style: 'footer',
        absolutePosition: {
          x: MARGIN,
          y: CARD_HEIGHT - MARGIN - 27,
        },
        width: CARD_WIDTH - MARGIN * 2,
      },
    ],
    // Styles
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
      },
      label: {
        fontSize: 13,
        bold: false,
        alignment: 'left',
      },
      value: {
        fontSize: 13,
        bold: true,
        alignment: 'left',
      },
      footer: {
        fontSize: 12,
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
): PassThrough | null => {
  const pdfStream = new PassThrough();

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
    const pdfDoc = printer.createPdfKitDocument(documentDef as TDocumentDefinitions);

    pdfDoc.on('error', err => {
      logger.error({ error: err }, 'Error Generating Wallet PDF');
      pdfStream.destroy(err as Error);
    });

    pdfDoc.pipe(pdfStream);
    pdfDoc.end();
  } catch (err) {
    logger.error({ error: err }, 'Error Generating Wallet PDF');
    pdfStream.destroy(err as Error);
    return null;
  }

  return pdfStream;
};
