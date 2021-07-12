import { Badge, Box } from '@chakra-ui/react'; // Chakra UI
import Image from 'next/image'; // Optimized images

type Props = {
  variant: 'completed' | 'inProgress' | 'pending' | 'rejected' | 'expiring' | 'expired' | 'active';
};

export function RequestStatusBadge({ variant }: Props) {
  /**
   * Renders the request status badge content (icon + text)
   * @param variant for specifying request status badge type
   * @returns {JSX.Element} contents of the badge
   */
  const _renderBadgeContent = (variant: Props['variant']): JSX.Element => {
    switch (variant) {
      case 'completed':
        return (
          <>
            <Image
              src="/assets/completed-icon.svg"
              alt="Completed Application Icon"
              height={12}
              width={12}
            />
            <Box as="span" ml="2">
              Completed
            </Box>
          </>
        );
      case 'expiring':
        return (
          <>
            <Image
              src="/assets/expiring-icon.svg"
              alt="Expiring Application Icon"
              height={14}
              width={14}
            />
            <Box as="span" ml="2">
              Expiring &lt; 30 days
            </Box>
          </>
        );
      case 'expired':
        return (
          <>
            <Image
              src="/assets/expired-icon.svg"
              alt="Expired Application Icon"
              height={15}
              width={16}
            />
            <Box as="span" ml="2">
              Expired
            </Box>
          </>
        );
      case 'pending':
        return (
          <>
            <Image
              src="/assets/pending-icon.svg"
              alt="Pending Application Icon"
              height={12}
              width={12}
            />
            <Box as="span" ml="2">
              Pending
            </Box>
          </>
        );
      case 'rejected':
        return (
          <>
            <Image
              src="/assets/rejected-icon.svg"
              alt="Rejected Application Icon"
              height={12}
              width={12}
            />
            <Box as="span" ml="2">
              Rejected
            </Box>
          </>
        );
      case 'inProgress':
        return (
          <>
            <Image
              src="/assets/in-progress-icon.svg"
              alt="In Progress Application Icon"
              height={12}
              width={12}
            />
            <Box as="span" ml="2">
              In progress
            </Box>
          </>
        );
      case 'active':
        return (
          <>
            <Image
              src="/assets/active-icon.svg"
              alt="Active Application Icon"
              height={12}
              width={12}
            />
            <Box as="span" ml="2">
              Active
            </Box>
          </>
        );
    }
  };

  return (
    <Badge variant={variant}>
      <Box ml="-4px" mr="8px">
        {_renderBadgeContent(variant)}
      </Box>
    </Badge>
  );
}
