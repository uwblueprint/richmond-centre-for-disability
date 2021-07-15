import { Box, HStack, VStack, Text, Divider, Badge, Link } from '@chakra-ui/react';
import Card from '@components/internal/Card';

type personalInformationProps = {
  readonly name: string;
  readonly userId: string;
  readonly mostRecentAPP: string;
  readonly expiryDate: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly province: string;
  readonly city: string;
  readonly address: string;
  readonly postalCode: string;
};

export default function PersonalInformationCard(props: personalInformationProps) {
  return (
    <Card w="521px" h="573px">
      <HStack spacing="63px">
        <Box w="376px" h="36px">
          <Link textStyle="display-small-semibold" color="primary" textDecoration="underline">
            {props.name}
          </Link>
        </Box>
        <Box>
          <Link textStyle="body-bold" color="primary" textDecoration="underline">
            Edit
          </Link>
        </Box>
      </HStack>
      <VStack spacing="12px" pt="12px" align="left">
        <Box>
          <Text textStyle="body-regular">Permanent Permit Holder</Text>
        </Box>
        <Box>
          <Text textStyle="body-regular">User ID: {props.userId}</Text>
        </Box>
        <Box>
          <HStack spacing="4px">
            <Text textStyle="body-regular">Most Recent APP: #{props.mostRecentAPP}</Text>
            <Badge variant="active">Active</Badge>
          </HStack>
          <Text textStyle="xsmall">Expiring {props.expiryDate}</Text>
        </Box>
      </VStack>
      <Divider pt="24px" />
      <VStack spacing="12px" pt="12px" align="left">
        <HStack spacing="12px">
          <Box>
            <Text textStyle="body-regular" color="#1E4FC2">
              <a href="">charmainewang@uwblueprint.org</a>
            </Text>
          </Box>
          <Text textStyle="caption" opacity="0.5">
            updated
          </Text>
        </HStack>
        <Box>
          <Link textStyle="body-bold" color="primary" textDecoration="underline">
            {props.email}
          </Link>
        </Box>
        <Box>
          <Text textStyle="body-regular">{props.phoneNumber}</Text>
        </Box>
      </VStack>
      <Divider pt="24px" />
      <VStack spacing="12px" pt="12px" align="left">
        <HStack spacing="12px">
          <Box>
            <Text textStyle="body-regular">647-234-1029</Text>
          </Box>
          <Text textStyle="caption" opacity="0.5">
            updated
          </Text>
        </HStack>
        <Box>
          <Text textStyle="body-regular">{props.address}</Text>
          <Text textStyle="body-regular">{props.city}</Text>
          <Text textStyle="body-regular">Canada</Text>
          <Text textStyle="body-regular">{props.postalCode}</Text>
        </Box>
      </VStack>
    </Card>
  );
}
