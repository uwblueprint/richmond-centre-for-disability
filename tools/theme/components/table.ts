import { ComponentMultiStyleConfig } from '@chakra-ui/theme'; // Multi component style type
//import { lighten } from '@chakra-ui/theme-tools'; // Lighten colours

const Table: ComponentMultiStyleConfig = {
  parts: ['table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption'],
  baseStyle: {
    th: {
      fontWeight: 'semibold',
      lineHeight: '24px',
      textTransform: 'none',
      letterSpacing: 'none',
    },
    td: {
      fontSize: '18px',
    },
  },
};

export default Table;
