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

  // Variants (COMPLETED, INPROGRESS, PENDING, REJECTED, EXPIRING, EXPIRED, ACTIVE, INACTIVE)
  variants: {
    COMPLETED: {
      bg: 'badge.completed',
    },
    INPROGRESS: {
      bg: 'badge.inProgress',
    },
    PENDING: {
      bg: 'badge.pending',
    },
    REJECTED: {
      bg: 'badge.rejected',
    },
    EXPIRING: {
      bg: 'badge.expiring',
    },
    EXPIRED: {
      bg: 'badge.expired',
    },
    ACTIVE: {
      bg: 'badge.active',
    },
    INACTIVE: {
      bg: 'badge.inactive',
    },
  },
};

export default Badge;
