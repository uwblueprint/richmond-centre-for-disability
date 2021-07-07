import { ComponentSingleStyleConfig } from '@chakra-ui/react'; // Single component style config

// Badge style config
const Badge: ComponentSingleStyleConfig = {
  // Base style
  baseStyle: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '23px',
    textTransform: 'inherit',
    fontWeight: 'normal',
    fontSize: '16px',
    height: '32px',
    paddingX: '1rem',
    paddingY: '4px',
  },

  // Variants (completed, inProgress, pending, rejected, expiring, expired, active, inactive)
  variants: {
    completed: () => {
      return {
        bg: '#EEEEEE',
      };
    },
    inProgress: () => ({
      bg: '#D9F1F8',
    }),
    pending: () => ({
      bg: '#FFF0BC',
    }),
    rejected: () => ({
      bg: '#FFE7DF',
    }),
    expiring: () => ({
      bg: '#FFEBD4',
    }),
    expired: () => ({
      bg: '#FFE7DF',
    }),
    active: () => ({
      bg: 'background.success',
    }),
    inactive: () => ({
      bg: 'background.critical',
    }),
  },
};

export default Badge;
