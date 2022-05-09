import { Flex, VStack, Text, Box, Circle } from '@chakra-ui/react'; // Chakra UI
import { CheckIcon } from '@chakra-ui/icons'; // Chakra UI icon
import { ReactNode } from 'react'; // React
import { formatDateVerbose } from '@lib/utils/format';

type ProcessingTaskStepProps = {
  readonly id: number;
  readonly label: string;
  readonly description?: string | ReactNode;
  readonly isCompleted: boolean;
  readonly showLog: boolean;
  readonly log: {
    readonly name: string;
    readonly date: Date;
  } | null;
  readonly children: ReactNode;
};

export default function ProcessingTaskStep({
  id, // ID 1 corresponds to step 1 (1-based index)
  label,
  description,
  isCompleted,
  showLog,
  log,
  children,
}: ProcessingTaskStepProps) {
  const _description =
    description &&
    (typeof description === 'string' ? (
      <Text textStyle="caption">{description}</Text>
    ) : (
      description
    ));

  return (
    <Flex alignItems={showLog ? 'flex-start' : 'center'}>
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
        {_description}
        {showLog && !!log && (
          <Text textStyle="xsmall" color="text.secondary">
            completed by {log.name} on {formatDateVerbose(log.date, true)}
          </Text>
        )}
      </VStack>
      <Box marginLeft="auto">{children}</Box>
    </Flex>
  );
}
