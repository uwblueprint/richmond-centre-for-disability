import { Text, VStack } from '@chakra-ui/react';
import { FC } from 'react';

type Props = {
  readonly title: string;
};

/** Section of current application card */
const CurrentApplicationCardSection: FC<Props> = ({ title, children }) => {
  return (
    <VStack
      align="flex-start"
      px="24px"
      py="16px"
      spacing="12px"
      border="1px solid"
      borderColor="border.secondary"
      borderStyle="dashed"
      borderRadius="4px"
    >
      <Text as="h3" textStyle="heading">
        {title}
      </Text>
      {children}
    </VStack>
  );
};

export default CurrentApplicationCardSection;
