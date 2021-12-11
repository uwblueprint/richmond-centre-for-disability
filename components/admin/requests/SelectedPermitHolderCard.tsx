import {
  Box,
  HStack,
  VStack,
  Text,
  Divider,
  Link,
  GridItem,
  Tooltip,
  useClipboard,
  Flex,
  Wrap,
  Badge,
  Spinner,
  Center,
} from '@chakra-ui/react'; // Chakra UI
import { ApplicantData } from '@tools/pages/admin/permit-holders/types'; // Applicant data type
import { formatDate } from '@lib/utils/format'; // Date formatter util

type SelectedPermitHolderCardProps = {
  readonly applicant: ApplicantData;
  readonly loading: boolean;
};

export default function SelectedPermitHolderCard(props: SelectedPermitHolderCardProps) {
  const { applicant, loading } = props;
  const { hasCopied, onCopy } = useClipboard(applicant?.email || '');

  if (loading) {
    return (
      <GridItem
        display="flex"
        flexDirection="column"
        padding="20px 24px 24px"
        background="white"
        border="1px solid"
        borderColor="border.secondary"
        boxSizing="border-box"
        borderRadius="8px"
        textAlign="left"
      >
        <Center height="240px">
          <VStack>
            <Spinner color="primary" mr="8px" size="xl" thickness="4px" />
            <Text textStyle="display-small-semibold" color="secondary" fontSize="xl">
              Loading Data...
            </Text>
          </VStack>
        </Center>
      </GridItem>
    );
  }

  return (
    <GridItem
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      padding="20px 24px 24px"
      background="white"
      border="1px solid"
      borderColor="border.secondary"
      boxSizing="border-box"
      borderRadius="8px"
      textAlign="left"
    >
      <Flex marginTop={5} alignItems="center">
        <Box>
          <Flex alignItems="center">
            <Text textStyle="display-large" as="h1" marginRight={3}>
              {`${applicant.firstName} ${applicant.lastName}`}
            </Text>
            {applicant.status && (
              <Wrap>
                <Badge variant={applicant.status}>{applicant.status}</Badge>
              </Wrap>
            )}
          </Flex>
          <HStack spacing={3} marginTop={3}>
            <Text textStyle="caption" as="p">
              ID: #{applicant.rcdUserId}
            </Text>
          </HStack>
        </Box>
      </Flex>

      <Divider mt="24px" />

      <VStack spacing="12px" pt="24px" align="left">
        <HStack spacing="12px">
          <Text as="h4" textStyle="body-bold">
            Personal Information
          </Text>
        </HStack>
        <Text as="p" textStyle="body-regular">
          Date of Birth: {formatDate(applicant.dateOfBirth)}
        </Text>
        <Text as="p" textStyle="body-regular">
          Gender: {applicant.gender.toLowerCase().replace(/^\w/, c => c.toUpperCase())}
        </Text>
      </VStack>

      <Divider mt="24px" />

      <VStack spacing="12px" pt="24px" align="left">
        <HStack spacing="12px">
          <Text as="h4" textStyle="body-bold">
            Contact Information
          </Text>
        </HStack>
        <Tooltip
          hasArrow
          closeOnClick={false}
          label={hasCopied ? 'Copied to clipboard' : 'Click to copy address'}
          placement="top"
          bg="background.grayHover"
          color="black"
        >
          <Link
            textStyle="body-regular"
            color="primary"
            textDecoration="underline"
            onClick={onCopy}
          >
            {applicant.email}
          </Link>
        </Tooltip>
        <Text as="p" textStyle="body-regular">
          {applicant.phone}
        </Text>
      </VStack>

      <Divider mt="24px" />

      <VStack spacing="12px" pt="24px" align="left">
        <HStack spacing="12px">
          <Box>
            <Text as="h4" textStyle="body-bold">
              Home Address
            </Text>
          </Box>
        </HStack>
        <Box>
          <Text as="p" textStyle="body-regular">
            {applicant.addressLine1}
          </Text>
          <Text as="p" textStyle="body-regular">
            {applicant.addressLine2}
          </Text>
          <Text as="p" textStyle="body-regular">
            {applicant.city} {applicant.province}
          </Text>
          <Text as="p" textStyle="body-regular">
            Canada
          </Text>
          <Text as="p" textStyle="body-regular">
            {applicant.postalCode}
          </Text>
        </Box>
      </VStack>
    </GridItem>
  );
}
