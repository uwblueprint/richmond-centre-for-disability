import { Badge, Box, Wrap } from '@chakra-ui/react'; // Chakra UI
import Image from 'next/image'; // Optimized images

type Props = {
  variant: 'COMPLETED' | 'INPROGRESS' | 'PENDING' | 'REJECTED' | 'EXPIRING' | 'EXPIRED' | 'ACTIVE';
};

export default function RequestStatusBadge({ variant }: Props) {
  /**
   * Renders the request status badge content (icon + text)
   * @param variant for specifying request status badge type
   * @returns {JSX.Element} contents of the badge
   */
  const _renderBadgeContent = (variant: Props['variant']): JSX.Element => {
    switch (variant) {
      case 'COMPLETED':
        return (
          <>
            <Image
              src="/assets/completed-icon.svg"
              alt="Completed Application Icon"
              height={12}
              width={12}
            />
            <Box as="span" pl="8px">
              Completed
            </Box>
          </>
        );
      case 'EXPIRING':
        return (
          <>
            <Image
              src="/assets/expiring-icon.svg"
              alt="Expiring Application Icon"
              height={14}
              width={14}
            />
            <Box as="span" pl="8px" pr="13px">
              {'Expiring < 30 days'}
            </Box>
          </>
        );
      case 'EXPIRED':
        return (
          <>
            <Image
              src="/assets/expired-icon.svg"
              alt="Expired Application Icon"
              height={15}
              width={16}
            />
            <Box as="span" pl="8px">
              Expired
            </Box>
          </>
        );
      case 'PENDING':
        return (
          <>
            <Image
              src="/assets/pending-icon.svg"
              alt="Pending Application Icon"
              height={12}
              width={12}
            />
            <Box as="span" pl="8px">
              Pending
            </Box>
          </>
        );
      case 'REJECTED':
        return (
          <>
            <Image
              src="/assets/rejected-icon.svg"
              alt="Rejected Application Icon"
              height={12}
              width={12}
            />
            <Box as="span" pl="8px">
              Rejected
            </Box>
          </>
        );
      case 'INPROGRESS':
        return (
          <>
            <Image
              src="/assets/in-progress-icon.svg"
              alt="In Progress Application Icon"
              height={12}
              width={12}
            />
            <Box as="span" pl="8px">
              In progress
            </Box>
          </>
        );
      case 'ACTIVE':
        return (
          <>
            <Image
              src="/assets/active-icon.svg"
              alt="Active Application Icon"
              height={12}
              width={12}
            />
            <Box as="span" pl="8px">
              Active
            </Box>
          </>
        );
    }
  };

  return (
    <Wrap>
      <Badge variant={variant}>
        <Box ml="0px" mr="0px">
          {_renderBadgeContent(variant)}
        </Box>
      </Badge>
    </Wrap>
  );
}
