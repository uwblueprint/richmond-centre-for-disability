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
    // Active permit holder
    ACTIVE: {
      bg: 'badge.active',
      fontWeight: 'semibold',
      color: 'text.success',
    },
    // Inactive permit holder
    INACTIVE: {
      bg: 'badge.inactive',
      fontWeight: 'semibold',
      color: 'text.critical',
    },
    // Permanent permit type
    PERMANENT: {
      bg: '#D0BDF9',
      fontWeight: 'regular',
    },
    // Temporary permit type
    TEMPORARY: {
      bg: '#F4B5DF',
      fontWeight: 'regular',
    },
  },
};

export default Badge;
