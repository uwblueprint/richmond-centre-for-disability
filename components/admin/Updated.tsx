import { FC } from 'react';
import { Text } from '@chakra-ui/react';

/** Label indicating that a section has been updated */
const Updated: FC = () => {
  return (
    <Text as="span" textStyle="caption" ml="12px" opacity="0.5">
      updated
    </Text>
  );
};

export default Updated;
