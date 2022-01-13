import { FC } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box, HStack, VStack, Text, Divider, Button } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card component
import EditPermitHolderInformationModal from '@components/admin/requests/permit-holder-information/EditModal'; // Edit modal
import {
  GetApplicantInformationRequest,
  GetApplicantInformationResponse,
  GET_APPLICANT_INFORMATION,
  PermitHolderFormData,
  UpdatePermitHolderInformationRequest,
  UpdatePermitHolderInformationResponse,
  UPDATE_PERMIT_HOLDER_INFORMATION,
} from '@tools/admin/requests/permit-holder-information'; // Applicant type
import { getPermitExpiryStatus } from '@lib/utils/permit-expiry'; // Get variant of PermitHolderStatusBadge
import { formatDateYYYYMMDD, formatFullName } from '@lib/utils/format';
import PermitHolderStatusBadge from '@components/admin/PermitHolderStatusBadge';
import Updated from '@components/admin/Updated';

type Props = {
  readonly applicationId: number;
  readonly contactInfoUpdated?: boolean;
  readonly addressInfoUpdated?: boolean;
};

// TODO: Updated states

/**
 * Personal information card for View Request page
 * @param applicant Applicant data
 * @param contactInfoUpdated Whether contact information was updated
 * @param addressInfoUpdated Whether address information was updated
 * @param onSave Callback function on save
 */
const Card: FC<Props> = props => {
  const { applicationId, contactInfoUpdated, addressInfoUpdated } = props;

  const { data, refetch } = useQuery<
    GetApplicantInformationResponse,
    GetApplicantInformationRequest
  >(GET_APPLICANT_INFORMATION, { variables: { id: applicationId } });

  const [updatePermitHolderInformation] = useMutation<
    UpdatePermitHolderInformationResponse,
    UpdatePermitHolderInformationRequest
  >(UPDATE_PERMIT_HOLDER_INFORMATION);

  if (!data?.application) {
    return null;
  }

  /** Handler for saving permit holder information */
  const handleSave = async (data: PermitHolderFormData) => {
    await updatePermitHolderInformation({ variables: { input: { id: applicationId, ...data } } });
    refetch();
  };

  const { application } = data;
  const {
    type,
    firstName,
    middleName,
    lastName,
    phone,
    email,
    receiveEmailUpdates,
    addressLine1,
    addressLine2,
    city,
    province,
    country,
    postalCode,
  } = application;

  // Personal information card header
  const Header =
    type === 'NEW' ? (
      formatFullName(firstName, middleName, lastName)
    ) : (
      <a href={`/admin/permit-holder/${application.applicant.id}`} target="_blank" rel="noreferrer">
        <Text as="h5" variant="link" textStyle="display-small-semibold">
          {formatFullName(firstName, middleName, lastName)}
        </Text>
      </a>
    );

  // Personal information card editing modal
  const EditModal = (
    <EditPermitHolderInformationModal
      type={type}
      permitHolderInformation={{
        firstName,
        middleName,
        lastName,
        phone,
        email,
        receiveEmailUpdates,
        addressLine1,
        addressLine2,
        city,
        postalCode,
      }}
      onSave={handleSave}
    >
      <Button variant="ghost" textDecoration="underline">
        <Text textStyle="body-bold">Edit</Text>
      </Button>
    </EditPermitHolderInformationModal>
  );

  return (
    <PermitHolderInfoCard colSpan={5} header={Header} editModal={EditModal}>
      <VStack width="100%" spacing="24px" align="left">
        {/* Permit holder information */}
        <VStack spacing="12px" align="left">
          <Text as="p" textStyle="body-regular">
            User ID: {type === 'NEW' ? 'N/A' : application.applicant.rcdUserId}
          </Text>
          <VStack align="left">
            <HStack spacing="12px">
              <Text as="p" textStyle="body-regular">
                Most recent APP:{' '}
                {type !== 'NEW' && application.applicant.mostRecentPermit
                  ? `#${application.applicant.mostRecentPermit.rcdPermitId}`
                  : 'N/A'}
              </Text>
              {type !== 'NEW' && application.applicant.mostRecentPermit && (
                <PermitHolderStatusBadge
                  variant={
                    getPermitExpiryStatus(application.applicant.mostRecentPermit.expiryDate) ===
                    'EXPIRED'
                      ? 'INACTIVE'
                      : 'ACTIVE'
                  }
                />
              )}
            </HStack>
            {type !== 'NEW' && application.applicant.mostRecentPermit && (
              // TODO: Fix text styles to avoid !important
              <Text as="p" textStyle="xsmall" margin="0 !important" color="secondary">
                Expiring {application.applicant.mostRecentPermit.expiryDate.toDateString()}
              </Text>
            )}
          </VStack>
        </VStack>
        <Divider />
        {/* Personal information */}
        <VStack spacing="12px" align="left">
          <Text as="h4" textStyle="body-bold">
            Personal Information {contactInfoUpdated && <Updated />}
          </Text>
          <Text as="p" textStyle="body-regular">
            Date of Birth:{' '}
            {formatDateYYYYMMDD(
              type === 'NEW' ? application.dateOfBirth : application.applicant.dateOfBirth
            ) || 'N/A'}
          </Text>
          <Text as="p" textStyle="body-regular">
            Gender:{' '}
            {type === 'NEW'
              ? application.gender === 'OTHER'
                ? application.otherGender
                : application.gender
              : application.applicant.gender === 'OTHER'
              ? application.applicant.otherGender
              : application.applicant.gender}
          </Text>
        </VStack>
        <Divider />
        <VStack spacing="12px" align="left">
          <Text as="h4" textStyle="body-bold">
            Contact Information {contactInfoUpdated && <Updated />}
          </Text>
          <Text as="p" textStyle="body-regular">
            {phone}
          </Text>
          {email && (
            <a href={`mailto:${email}`}>
              {/* TODO: Replace with copy to clipboard */}
              <Text textStyle="body-regular" color="primary">
                {email}
              </Text>
            </a>
          )}
          <Text as="p" textStyle="body-regular">
            Renewal updates through email: <b>{receiveEmailUpdates ? 'Yes' : 'No'}</b>
          </Text>
        </VStack>
        <Divider />
        <VStack spacing="12px" align="left">
          <Text as="h4" textStyle="body-bold">
            Home Address {addressInfoUpdated && <Updated />}
          </Text>
          <Box>
            <Text as="p" textStyle="body-regular">
              {addressLine2 ? `${addressLine2} - ${addressLine1}` : addressLine1}
            </Text>
            <Text as="p" textStyle="body-regular">
              {city} {province}
            </Text>
            <Text as="p" textStyle="body-regular">
              {country}
            </Text>
            <Text as="p" textStyle="body-regular">
              {postalCode}
            </Text>
          </Box>
        </VStack>
      </VStack>
    </PermitHolderInfoCard>
  );
};

export default Card;
