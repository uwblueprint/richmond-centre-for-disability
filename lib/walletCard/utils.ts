import logger from '@lib/utils/logging';
import pdfPrinter from 'pdfmake';
import fs from 'fs';

const walletCardPdfDefinition = () => {
  const calculateTextWidth = (text: string, fontSize: number, averageCharacterWidth = 0.5) => {
    return fontSize * averageCharacterWidth * text.length;
  };

  // Pixel Constants
  const MARGIN_TOP = 40;
  const MARGIN_LEFT = 40;
  const PTS_TO_INCH = 72;
  const CARD_FRONT_HEIGHT = 2 * PTS_TO_INCH;
  const CARD_FRONT_WIDTH = 3.5 * PTS_TO_INCH;
  const CARD_BACK_HEIGHT = 1.5 * PTS_TO_INCH;
  const CARD_BACK_WIDTH = 3 * PTS_TO_INCH;
  const CARDS_SPACING = 50;
  const HEADER_FONT_SIZE = 12;
  const FOOTER_FONT_SIZE = 9;
  const boxStartY = MARGIN_TOP + CARD_FRONT_HEIGHT + CARDS_SPACING;
  const boxStartX = MARGIN_LEFT;

  // Text
  const headerText = 'Richmond Centre For Disability';
  const footerText = '604.232.2404  parkingpermit@rcdrichmond.org';

  return {
    content: [
      {
        image: 'cardFront',
        width: CARD_FRONT_WIDTH,
        height: CARD_FRONT_HEIGHT,
      },
      {
        stack: [
          {
            canvas: [
              {
                type: 'rect',
                x: 0, // x position
                y: 50, // y position
                w: CARD_BACK_WIDTH, // width
                h: CARD_BACK_HEIGHT, // height
                r: 5, // Border radius
                lineColor: 'black', // Border color
                lineWidth: 1, // Border width
              },
            ],
          },
          {
            text: [{ text: headerText, style: 'header' }],
            absolutePosition: {
              x:
                boxStartX +
                (CARD_BACK_WIDTH - calculateTextWidth(headerText, HEADER_FONT_SIZE)) / 2,
              y: boxStartY + 14,
            },
          },
          {
            text: [
              { text: 'Permit # ', style: 'subheader' },
              { text: '31571    ', style: 'subheaderB' },
              { text: 'Expiry:  ', style: 'subheader' },
              { text: '2027-01', style: 'subheaderB' },
              { text: '\n\n', style: 'space' },
              { text: 'Name:  ', style: 'subheader' },
              { text: 'Lucy Quinn  ', style: 'subheaderB' },
              { text: '\n\n', style: 'space' },
              { text: 'MoB:  ', style: 'subheader' },
              { text: '1945-05    ', style: 'subheaderB' },
              { text: 'User #  ', style: 'subheader' },
              { text: '12342', style: 'subheaderB' },
            ],
            absolutePosition: { x: boxStartX + 10, y: boxStartY + 35 },
          },
          {
            text: [{ text: footerText, style: 'footer' }],
            absolutePosition: {
              x:
                boxStartX +
                (CARD_BACK_WIDTH - calculateTextWidth(footerText, FOOTER_FONT_SIZE)) / 2,
              y: boxStartY + CARD_BACK_HEIGHT - FOOTER_FONT_SIZE - 10,
            },
          },
        ],
      },
    ],
    styles: {
      header: {
        fontSize: HEADER_FONT_SIZE,
        bold: true,
        alignment: 'left',
      },
      subheader: {
        fontSize: 10,
        bold: false,
        alignment: 'left',
      },
      subheaderB: {
        fontSize: 10,
        bold: true,
        alignment: 'left',
      },
      footer: {
        fontSize: FOOTER_FONT_SIZE,
        bold: false,
        alignment: 'left',
      },
      space: {
        fontSize: 9,
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
      cardFront: 'public/assets/card-front.png',
    },
  };
};

export const generateWalletCard = (): PDFKit.PDFDocument | null => {
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
    const documentDef = walletCardPdfDefinition();
    pdfDoc = printer.createPdfKitDocument(documentDef);
    pdfDoc.pipe(fs.createWriteStream('public/assets/document.pdf'));
    pdfDoc.end();
  } catch (err) {
    logger.error({ error: err }, 'Error Generating Wallet PDF: ', err);
    return null;
  }
  return pdfDoc;
};
