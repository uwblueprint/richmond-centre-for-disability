import { ComponentMultiStyleConfig } from '@chakra-ui/theme'; // Multi component style type
//import { lighten } from '@chakra-ui/theme-tools'; // Lighten colours

const Table: ComponentMultiStyleConfig = {
  parts: ['control'],
  baseStyle: {
    th: {
      fontSize: '18px',
      textTransform: 'none',
      letterSpacing: 'none',
    },
    td: {
      fontSize: '18px',
    },
  },
};
export default Table;
