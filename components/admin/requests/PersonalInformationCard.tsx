import Link from 'next/link'; // Next Link
import { Box, HStack, VStack, Text, Divider, Button } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/PermitHolderInfoCard'; // Custom Card component
import EditPermitHolderInformationModal from '@components/admin/requests/modals/EditPermitHolderInformationModal'; // Edit modal
import RequestStatusBadge from '@components/admin/RequestStatusBadge'; // Request status badge
import { UpdateApplicationInput } from '@lib/graphql/types'; // GraphQL Types
import { PersonalInformationCardApplicant } from '@tools/components/admin/requests/personal-information-card'; // Applicant type
import { getPermitExpiryStatus } from '@tools/components/admin/request-status-badge'; // Get variant of RequestStatusBadge

type Props = {
  readonly applicant: PersonalInformationCardApplicant;
  readonly contactInfoUpdated?: boolean;
  readonly addressInfoUpdated?: boolean;
  readonly isRenewal: boolean;
  readonly onSave: (applicationData: Omit<UpdateApplicationInput, 'id'>) => void;
};

/**
 * Personal information card for View Request page
 * @param applicant Applicant data
 * @param contactInfoUpdated Whether contact information was updated
 * @param addressInfoUpdated Whether address information was updated
 * @param onSave Callback function on save
 */
export default function PersonalInformationCard(props: Props) {
  const { applicant, contactInfoUpdated, addressInfoUpdated, isRenewal, onSave } = props;

  if (applicant === undefined) {
    return null;
  }

  // Personal information card header
  const Header = (
    <Link href={`/admin/permit-holder/${applicant.id}`}>
      <Text
        variant="link"
        textStyle="display-small-semibold"
        color="primary"
        textDecoration="underline"
        cursor="pointer"
      >{`${applicant.firstName} ${applicant.middleName || ''} ${applicant.lastName}`}</Text>
    </Link>
  );

  // Remove unneeded fields
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mostRecentAppNumber, mostRecentAppExpiryDate, ...permitHolder } = applicant;

  // Personal information card editing modal
  const EditModal = (
    <EditPermitHolderInformationModal
      permitHolderInformation={{
        type: isRenewal ? 'renewal' : 'replacement',
        permitHolderInformation: permitHolder,
      }}
      onSave={onSave}
    >
      <Button variant="ghost" textDecoration="underline">
        <Text textStyle="body-bold">Edit</Text>
      </Button>
    </EditPermitHolderInformationModal>
  );

  return (
    <PermitHolderInfoCard colSpan={5} header={Header} editModal={EditModal}>
      <VStack spacing="12px" pt="12px" align="left">
        <Box>
          <Text as="p" textStyle="body-regular">
            Permanent Permit Holder
          </Text>
        </Box>
        <Box>
          <Text as="p" textStyle="body-regular">
            User ID: {applicant.rcdUserId}
          </Text>
        </Box>
        <Box>
          <HStack spacing="4px">
            <Text as="p" textStyle="body-regular" marginRight={2}>
              Most recent APP: #{applicant.mostRecentAppNumber}
            </Text>
            <RequestStatusBadge
              variant={getPermitExpiryStatus(applicant.mostRecentAppExpiryDate)}
            />
          </HStack>
          <Text as="p" textStyle="xsmall" color="secondary">
            Expiring {applicant.mostRecentAppExpiryDate.toDateString()}
          </Text>
        </Box>
      </VStack>
      <Divider mt="24px" />
      <VStack spacing="12px" pt="12px" align="left">
        <HStack spacing="12px">
          <Box>
            <Text as="h4" textStyle="body-bold">
              Contact Information
            </Text>
          </Box>
          {contactInfoUpdated && (
            <Text as="p" textStyle="caption" opacity="0.5">
              updated
            </Text>
          )}
        </HStack>
        <Box>
          <a href={`mailto:${applicant.email}`}>
            <Text textStyle="body-regular" color="primary">
              {applicant.email}
            </Text>
          </a>
        </Box>
        <Box>
          <Text as="p" textStyle="body-regular">
            {applicant.phone}
          </Text>
        </Box>
      </VStack>
      <Divider mt="24px" />
      <VStack spacing="12px" pt="12px" align="left">
        <HStack spacing="12px">
          <Box>
            <Text as="h4" textStyle="body-bold">
              Home Address
            </Text>
          </Box>
          {addressInfoUpdated && (
            <Text as="p" textStyle="caption" opacity="0.5">
              updated
            </Text>
          )}
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
