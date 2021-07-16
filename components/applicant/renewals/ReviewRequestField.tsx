import { Flex, Text } from '@chakra-ui/react'; // Chakra UI

type Props = {
  readonly name: string;
  readonly value: string;
};

/**
 * Field (eg. First Name: Oustan) in the Review Request section of the renewal/replacement request flow
 * @param name - The name of the field (eg. First Name)
 * @param value - The value of the field (eg. Oustan)
 */
export default function ReviewRequestField({ name, value }: Props) {
  return (
    <Flex justifyContent="flex-start" marginBottom="12px">
      <Text as="h4" textStyle="body-bold" display="inline" marginRight="8px">
        {`${name}: `}
      </Text>
      <Text as="p" textStyle="body-regular" display="inline">
        {value}
      </Text>
    </Flex>
  );
}
