import { Text } from '@chakra-ui/react'; // Chakra UI

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
    <Text textAlign="left">
      <Text as="span" textStyle="body-bold">{`${name}: `}</Text>
      <Text as="span" textStyle="body-regular">
        {value}
      </Text>
    </Text>
  );
}
