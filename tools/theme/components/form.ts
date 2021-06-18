import { ComponentMultiStyleConfig } from '@chakra-ui/theme'; // Multi component style type
import { lighten } from '@chakra-ui/theme-tools'; // Lighten colours

// Form content styles
const Form: ComponentMultiStyleConfig = {
  parts: ['helperText'],
  baseStyle: {
    helperText: {
      textAlign: 'left',
      _disabled: {
        color: lighten('inherit', 0.8), // Lighten helper text when form content is disabled
      },
    },
  },
};

export default Form;
