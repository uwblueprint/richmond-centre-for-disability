import { Spinner, Center, VStack, Text } from '@chakra-ui/react'; // Chakra UI

type LoadingSpinnerProps = {
  readonly message?: string;
};

export default function LoadingSpinner({ message = 'Loading Data' }: LoadingSpinnerProps) {
  return (
    <Center height="240px">
      <VStack>
        <Spinner color="primary" boxSize="100px" thickness="8px" speed="0.65s" mb="10px" />
        <Text textStyle="display-small-semibold" color="secondary" fontSize="xl">
          {message}
        </Text>
      </VStack>
    </Center>
  );
}
