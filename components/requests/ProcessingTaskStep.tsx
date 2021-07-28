import { Flex, VStack, Text, Box, Circle } from '@chakra-ui/react'; // Chakra UI
import { CheckIcon } from '@chakra-ui/icons'; // Chakra UI icon
import { ReactNode } from 'react'; // React

type ProcessingTaskStepProps = {
  id: number;
  label: string;
  description?: string;
  isCompleted: boolean;
  children: ReactNode;
};

export default function ProcessingTaskStep({
  id, // ID 1 corresponds to step 1 (1-based index)
  label,
  description,
  isCompleted,
  children,
}: ProcessingTaskStepProps) {
  return (
    <Flex alignItems="center">
      <Box marginRight={3}>
        {isCompleted ? (
          <Circle size="32px" bg="#009444">
            <CheckIcon color="white" />
          </Circle>
        ) : (
          <Circle
            size="32px"
            bg="background.gray"
            border="solid 3px"
            borderColor="background.grayHover"
          >
            {id}
          </Circle>
        )}
      </Box>
      <VStack spacing={1} alignItems="left" textAlign="left">
        <Text textStyle="body-regular">{label}</Text>
        {description && <Text textStyle="caption">{description}</Text>}
      </VStack>
      <Box marginLeft="auto">{children}</Box>
    </Flex>
  );
}
