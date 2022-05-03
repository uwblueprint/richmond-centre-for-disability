import { FC } from 'react';
import { Badge, Box, Wrap } from '@chakra-ui/react'; // Chakra UI
import { PermitType } from '@lib/graphql/types'; // Types

type Props = {
  variant: PermitType;
};

/** Permit type badge (permanent/temporary) */
const PermitTypeBadge: FC<Props> = ({ variant }) => {
  const variantText = variant === 'PERMANENT' ? 'Permanent' : 'Temporary';

  return (
    <Wrap>
      <Badge variant={variant}>
        <Box ml="0px" mr="0px">
          {variantText}
        </Box>
      </Badge>
    </Wrap>
  );
};

export default PermitTypeBadge;
