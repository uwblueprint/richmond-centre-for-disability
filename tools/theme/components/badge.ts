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
    completed: {
      bg: 'badge.completed',
    },
    inProgress: {
      bg: 'badge.inProgress',
    },
    pending: {
      bg: 'badge.pending',
    },
    rejected: {
      bg: 'badge.rejected',
    },
    expiring: {
      bg: 'badge.expiring',
    },
    expired: {
      bg: 'badge.expired',
    },
    active: {
      bg: 'badge.active',
    },
    inactive: {
      bg: 'badge.inactive',
    },
  },
};

export default Badge;