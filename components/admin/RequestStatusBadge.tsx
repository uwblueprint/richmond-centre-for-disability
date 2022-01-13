import { Badge, Box, Wrap } from '@chakra-ui/react'; // Chakra UI
import Image from 'next/image'; // Optimized images
import { ApplicationStatus } from '@lib/graphql/types'; // Types
import { FC } from 'react';

type Props = {
  variant: ApplicationStatus;
};

const RequestStatusBadge: FC<Props> = ({ variant }) => {
  /**
   * Renders the request status badge content (icon + text)
   * @param variant for specifying request status badge type
   * @returns {JSX.Element} contents of the badge
   */
  const _renderBadgeContent = (variant: ApplicationStatus): JSX.Element => {
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
      case 'IN_PROGRESS':
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
};

export default RequestStatusBadge;
