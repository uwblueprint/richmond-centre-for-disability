import logger from '@lib/utils/logging';
import PdfPrinter from 'pdfmake';

const walletCardPdfDefinition = () => {
  const PTS_TO_INCH = 72;
  return {
    content: [
      {
        image: 'cardFront',
        width: 3.5 * PTS_TO_INCH,
        height: 2 * PTS_TO_INCH,
        absolutePosition: { x: 100, y: 100 },
      },
    ],
    images: {
      cardFront: 'public/assets/card-front.png',
    },
  };
};

export const generateWalletCard = (): PDFKit.PDFDocument | null => {
  let pdfDoc = null;
  try {
    const printer = new PdfPrinter({
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    });
    const documentDef = walletCardPdfDefinition();
    pdfDoc = printer.createPdfKitDocument(documentDef);
    pdfDoc.end();
  } catch (err) {
    logger.error({ error: err }, 'Error Generating Wallet PDF: ', err);
    return null;
  }
  return pdfDoc;
};
