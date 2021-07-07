import { Badge, Box } from '@chakra-ui/react'; // Chakra UI
import Image from 'next/image'; // Optimized images

type Props = {
  variant: string;
};

/**
 * Renders the applicant status badge content (icon + text)
 * @param variant for specifying applicant status badge type
 * @returns {JSX.Element} contents of the badge
 */
const renderBadgeContent = (variant: string): JSX.Element | undefined => {
  switch (variant) {
    case 'completed':
      return (
        <Box mr="2">
          <Image
            src="/assets/completed-icon.svg"
            alt="Completed Application Icon"
            height={12}
            width={12}
          />
          <Box as="span" ml="2">
            Completed
          </Box>
        </Box>
      );
    case 'expiring':
      return (
        <Box mr="2">
          <Image
            src="/assets/expiring-icon.svg"
            alt="Expiring Application Icon"
            height={14}
            width={14}
          />
          <Box as="span" ml="2">
            Expiring &lt; 30 days
          </Box>
        </Box>
      );
    case 'expired':
      return (
        <Box mr="2">
          <Image
            src="/assets/expired-icon.svg"
            alt="Expired Application Icon"
            height={15}
            width={16}
          />
          <Box as="span" ml="2">
            Expired
          </Box>
        </Box>
      );
    case 'pending':
      return (
        <Box mr="2">
          <Image
            src="/assets/pending-icon.svg"
            alt="Pending Application Icon"
            height={12}
            width={12}
          />
          <Box as="span" ml="2">
            Pending
          </Box>
        </Box>
      );
    case 'rejected':
      return (
        <Box mr="2">
          <Image
            src="/assets/rejected-icon.svg"
            alt="Rejected Application Icon"
            height={12}
            width={12}
          />
          <Box as="span" ml="2">
            Rejected
          </Box>
        </Box>
      );
    case 'inProgress':
      return (
        <Box mr="2">
          <Image
            src="/assets/in-progress-icon.svg"
            alt="In Progress Application Icon"
            height={12}
            width={12}
          />
          <Box as="span" ml="2">
            In progress
          </Box>
        </Box>
      );
    case 'active':
      return (
        <Box mr="2">
          <Image
            src="/assets/active-icon.svg"
            alt="Active Application Icon"
            height={12}
            width={12}
          />
          <Box as="span" ml="2">
            Active
          </Box>
        </Box>
      );
  }
};

export function ApplicantStatusBadge({ variant }: Props) {
  return <Badge variant={variant}>{renderBadgeContent(variant)}</Badge>;
}
