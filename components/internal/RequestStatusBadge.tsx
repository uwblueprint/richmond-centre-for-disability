import { Badge, Box } from '@chakra-ui/react'; // Chakra UI
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
          <Badge variant={variant} width="127px" height="32px" paddingX="12px" paddingY="4px">
            <Box mx="0px" px="0px">
              <Image
                src="/assets/completed-icon.svg"
                alt="Completed Application Icon"
                height={12}
                width={12}
              />
              <Box as="span" pl="8px">
                Completed
              </Box>
            </Box>
          </Badge>
        );
      case 'EXPIRING':
        return (
          <Badge variant={variant} width="180px" height="32px" paddingX="12px" paddingY="4px">
            <Box mx="0px" px="0px">
              <Image
                src="/assets/expiring-icon.svg"
                alt="Expiring Application Icon"
                height={14}
                width={14}
              />
              <Box as="span" pl="8px">
                Expiring &lt; 30 days
              </Box>
            </Box>
          </Badge>
        );
      case 'EXPIRED':
        return (
          <Badge variant={variant} width="105px" height="32px" paddingX="12px" paddingY="4px">
            <Box mx="0px" px="0px">
              <Image
                src="/assets/expired-icon.svg"
                alt="Expired Application Icon"
                height={15}
                width={16}
              />
              <Box as="span" pl="8px">
                Expired
              </Box>
            </Box>
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant={variant} width="107px" height="32px" paddingX="12px" paddingY="4px">
            <Box mx="0px" px="0px">
              <Image
                src="/assets/pending-icon.svg"
                alt="Pending Application Icon"
                height={12}
                width={12}
              />
              <Box as="span" pl="8px">
                Pending
              </Box>
            </Box>
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant={variant} width="109px" height="32px" paddingX="12px" paddingY="4px">
            <Box mx="0px" px="0px">
              <Image
                src="/assets/rejected-icon.svg"
                alt="Rejected Application Icon"
                height={12}
                width={12}
              />
              <Box as="span" pl="8px">
                Rejected
              </Box>
            </Box>
          </Badge>
        );
      case 'INPROGRESS':
        return (
          <Badge variant={variant} width="130px" height="32px" paddingX="12px" paddingY="4px">
            <Box mx="0px" px="0px">
              <Image
                src="/assets/in-progress-icon.svg"
                alt="In Progress Application Icon"
                height={12}
                width={12}
              />
              <Box as="span" pl="8px">
                In progress
              </Box>
            </Box>
          </Badge>
        );
      case 'ACTIVE':
        return (
          <Badge variant={variant} width="89px" height="32px" paddingX="12px" paddingY="4px">
            <Box mx="0px" px="0px">
              <Image
                src="/assets/active-icon.svg"
                alt="Active Application Icon"
                height={12}
                width={12}
              />
              <Box as="span" pl="8px">
                Active
              </Box>
            </Box>
          </Badge>
        );
    }
  };

  return _renderBadgeContent(variant);
}
