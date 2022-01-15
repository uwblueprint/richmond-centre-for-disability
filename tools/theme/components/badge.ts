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
    paddingX: '12px',
    paddingY: '4px',
  },

  // Variants (COMPLETED, APPROVED, PENDING, REJECTED, EXPIRING, EXPIRED, ACTIVE, INACTIVE)
  variants: {
    COMPLETED: {
      bg: 'badge.completed',
    },
    IN_PROGRESS: {
      bg: 'badge.approved',
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
