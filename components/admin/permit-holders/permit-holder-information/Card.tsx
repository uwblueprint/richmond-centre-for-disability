import {
  Box,
  HStack,
  VStack,
  Text,
  Divider,
  Link,
  Button,
  Tooltip,
  useClipboard,
} from '@chakra-ui/react'; // Chakra UI
import EditUserInformationModal from '@components/admin/permit-holders/permit-holder-information/EditModal'; // Edit User Information Modal
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card component
import { ApplicantData } from '@tools/admin/permit-holders/types'; // Applicant data type
import { UpdateApplicantInput } from '@lib/graphql/types';
import { formatDate } from '@lib/utils/format'; // Date formatter util

type PersonalInformationProps = {
  readonly applicant: ApplicantData;
  readonly onSave: (applicationData: UpdateApplicantInput) => void;
};

export default function PersonalInformationCard(props: PersonalInformationProps) {
  const { applicant, onSave } = props;
  const { hasCopied, onCopy } = useClipboard(applicant?.email ? applicant?.email : '');

  return (
    <PermitHolderInfoCard
      colSpan={5}
      header={
        <Text as="h4" textStyle="body-bold">
          Personal Information
        </Text>
      }
      editModal={
        <EditUserInformationModal applicant={applicant} onSave={onSave}>
          <Button color="primary" variant="ghost" textDecoration="underline">
            <Text textStyle="body-bold">Edit</Text>
          </Button>
        </EditUserInformationModal>
      }
    >
      <VStack spacing="12px" align="left">
        <Box>
          <Text as="p" textStyle="body-regular">
            Date of Birth: {formatDate(applicant.dateOfBirth)}
          </Text>
        </Box>
        <Box>
          <Text as="p" textStyle="body-regular">
            Gender: {applicant.gender.toLowerCase().replace(/^\w/, c => c.toUpperCase())}
          </Text>
        </Box>
      </VStack>

      <Divider mt="24px" />

      <VStack spacing="12px" pt="24px" align="left">
        <HStack spacing="12px">
          <Box>
            <Text as="h4" textStyle="body-bold">
              Contact Information
            </Text>
          </Box>
        </HStack>
        <Box>
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
        </Box>
        <Box>
          <Text as="p" textStyle="body-regular">
            {applicant.phone}
          </Text>
        </Box>
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
    </PermitHolderInfoCard>
  );
}