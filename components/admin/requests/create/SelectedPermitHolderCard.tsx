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
import { formatFullName, formatPhoneNumber } from '@lib/utils/format'; // Date formatter util
import { formatDateYYYYMMDD } from '@lib/utils/date';
import { useQuery } from '@tools/hooks/graphql';
import {
  GetSelectedApplicantRequest,
  GetSelectedApplicantResponse,
  GET_SELECTED_APPLICANT_QUERY,
} from '@tools/admin/requests/permit-holder-information';
import Address from '@components/admin/Address';

type SelectedPermitHolderCardProps = {
  readonly applicantId: number;
};

export default function SelectedPermitHolderCard(props: SelectedPermitHolderCardProps) {
  const { applicantId } = props;

  const { data, loading } = useQuery<GetSelectedApplicantResponse, GetSelectedApplicantRequest>(
    GET_SELECTED_APPLICANT_QUERY,
    { variables: { id: applicantId } }
  );

  const { hasCopied, onCopy } = useClipboard(data?.applicant.email || '');

  if (loading || !data?.applicant) {
    return (
      <VStack
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
      </VStack>
    );
  }

  const {
    firstName,
    middleName,
    lastName,
    status,
    dateOfBirth,
    gender,
    phone,
    email,
    addressLine1,
    addressLine2,
    city,
    province,
    country,
    postalCode,
  } = data.applicant;

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
      <VStack width="100%" spacing="24px" align="stretch">
        <Flex alignItems="center">
          <Box>
            <Flex alignItems="center">
              <Text textStyle="display-large" as="h1" marginRight={3}>
                {formatFullName(firstName, middleName, lastName)}
              </Text>
              {status && (
                <Wrap>
                  <Badge variant={status}>{status}</Badge>
                </Wrap>
              )}
            </Flex>
            <HStack spacing={3} marginTop={3}>
              <Text textStyle="caption" as="p">
                ID: #{applicantId}
              </Text>
            </HStack>
          </Box>
        </Flex>
        <Divider />
        <VStack spacing="12px" align="flex-start">
          <HStack spacing="12px">
            <Text as="h4" textStyle="body-bold">
              Personal Information
            </Text>
          </HStack>
          <Text as="p" textStyle="body-regular">
            Date of Birth: {formatDateYYYYMMDD(dateOfBirth)}
          </Text>
          <Text as="p" textStyle="body-regular">
            Gender: {gender.toLowerCase().replace(/^\w/, c => c.toUpperCase())}
          </Text>
        </VStack>
        <Divider />
        <VStack spacing="12px" align="flex-start">
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
              {email}
            </Link>
          </Tooltip>
          <Text as="p" textStyle="body-regular">
            {formatPhoneNumber(phone)}
          </Text>
        </VStack>
        <Divider />
        <VStack spacing="12px" align="flex-start">
          <HStack spacing="12px">
            <Box>
              <Text as="h4" textStyle="body-bold">
                Home Address
              </Text>
            </Box>
          </HStack>
          <Address address={{ addressLine1, addressLine2, city, province, country, postalCode }} />
        </VStack>
      </VStack>
    </GridItem>
  );
}
