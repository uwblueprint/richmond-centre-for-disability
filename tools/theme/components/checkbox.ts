import { ComponentMultiStyleConfig } from '@chakra-ui/react'; // Multi component style config type

// Checkbox styles
const Checkbox: ComponentMultiStyleConfig = {
  parts: ['control'],
  baseStyle: {
    control: {
      borderColor: 'black',
    },
    label: {
      _disabled: {
        opacity: 1, // Keep label fully opaque even if checkbox is disabled
      },
    },
  },
  defaultProps: {
    size: 'md',
  },
};

export default Checkbox;
