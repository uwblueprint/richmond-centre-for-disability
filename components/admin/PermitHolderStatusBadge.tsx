import { FC } from 'react';
import { Badge, Box, Wrap } from '@chakra-ui/react'; // Chakra UI
import { ApplicantStatus } from '@lib/graphql/types'; // Types

type Props = {
  variant: ApplicantStatus;
};

/** Status badge for permit holder */
const PermitHolderStatusBadge: FC<Props> = ({ variant }) => {
  return (
    <Wrap>
      <Badge variant={variant}>
        <Box ml="0px" mr="0px">
          {variant}
        </Box>
      </Badge>
    </Wrap>
  );
};

export default PermitHolderStatusBadge;
