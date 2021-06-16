import { ComponentMultiStyleConfig } from '@chakra-ui/theme'; // Multi component style type

// Alert config (used by Toast)
const Alert: ComponentMultiStyleConfig = {
  parts: ['container'],
  variants: {
    // Modify solid variant
    solid: ({ status }) => {
      // Map statuses to colors
      let colorScheme: string;
      switch (status) {
        case 'success':
          colorScheme = 'success';
          break;
        case 'error':
          colorScheme = 'critical';
          break;
        case 'warning':
          colorScheme = 'warning';
          break;
        default:
          colorScheme = 'informative';
          break;
      }
      return {
        container: {
          color: 'black',
          bg: `background.${colorScheme}`,
          border: '1px solid',
          borderColor: `border.${colorScheme}`,
        },
        icon: {
          color: `secondary.${colorScheme}`,
        },
      };
    },
  },
  // Default styles
  defaultProps: {
    variant: 'solid',
    status: 'info',
  },
};

export default Alert;
