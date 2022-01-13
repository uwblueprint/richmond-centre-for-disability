import { FC } from 'react';
import { Badge, Box, Wrap } from '@chakra-ui/react'; // Chakra UI
import Image from 'next/image'; // Optimized images
import { PermitStatus } from '@lib/graphql/types'; // Types

type Props = {
  variant: PermitStatus;
};

/** Status badge for permit */
const PermitStatusBadge: FC<Props> = ({ variant }) => {
  /**
   * Renders the badge content (icon + text)
   * @param variant for specifying permit status badge type
   * @returns {JSX.Element} contents of the badge
   */
  const _renderBadgeContent = (variant: PermitStatus): JSX.Element => {
    switch (variant) {
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

export default PermitStatusBadge;
