import { FC, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { HStack, VStack, Text, Divider, Button } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card component
import EditPermitHolderInformationModal from '@components/admin/requests/permit-holder-information/EditModal'; // Edit modal
import {
  GetApplicantInformationRequest,
  GetApplicantInformationResponse,
  GET_APPLICANT_INFORMATION,
  PermitHolderCardData,
  PermitHolderFormData,
  UpdatePermitHolderInformationRequest,
  UpdatePermitHolderInformationResponse,
  UPDATE_PERMIT_HOLDER_INFORMATION,
} from '@tools/admin/requests/permit-holder-information'; // Applicant type
import { getPermitExpiryStatus } from '@lib/utils/permit-expiry'; // Get variant of PermitHolderStatusBadge
import { formatDateYYYYMMDD, formatFullName } from '@lib/utils/format';
import PermitHolderStatusBadge from '@components/admin/PermitHolderStatusBadge';
import Updated from '@components/admin/Updated';
import Address from '@components/admin/Address';

type Props = {
  readonly applicationId: number;
  readonly contactInfoUpdated?: boolean;
  readonly addressInfoUpdated?: boolean;
};

// TODO: Updated states

/**
 * Personal information card for View Request page
 * @param applicationId Application ID
 * @param contactInfoUpdated Whether contact information was updated
 * @param addressInfoUpdated Whether address information was updated
 */
const Card: FC<Props> = props => {
  const { applicationId, contactInfoUpdated, addressInfoUpdated } = props;

  const [permitHolderInformation, setPermitHolderInformation] =
    useState<PermitHolderCardData | null>(null);

  const { refetch } = useQuery<GetApplicantInformationResponse, GetApplicantInformationRequest>(
    GET_APPLICANT_INFORMATION,
    {
      variables: { id: applicationId },
      onCompleted: data => {
        if (data) {
          setPermitHolderInformation(data.application);
        }
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const [updatePermitHolderInformation] = useMutation<
    UpdatePermitHolderInformationResponse,
    UpdatePermitHolderInformationRequest
  >(UPDATE_PERMIT_HOLDER_INFORMATION);

  if (!permitHolderInformation) {
    return null;
  }

  /** Handler for saving permit holder information */
  const handleSave = async (data: PermitHolderFormData) => {
    await updatePermitHolderInformation({ variables: { input: { id: applicationId, ...data } } });
    refetch();
  };

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
  } = permitHolderInformation;

  // Personal information card header
  const Header =
    type === 'NEW' ? (
      formatFullName(firstName, middleName, lastName)
    ) : (
      <a
        href={`/admin/permit-holder/${permitHolderInformation.applicant.id}`}
        target="_blank"
        rel="noreferrer"
      >
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
            User ID: {type === 'NEW' ? 'N/A' : permitHolderInformation.applicant.id}
          </Text>
          <VStack align="left">
            <HStack spacing="12px">
              <Text as="p" textStyle="body-regular">
                Most recent APP:{' '}
                {type !== 'NEW' && permitHolderInformation.applicant.mostRecentPermit
                  ? `#${permitHolderInformation.applicant.mostRecentPermit.rcdPermitId}`
                  : 'N/A'}
              </Text>
              {type !== 'NEW' && permitHolderInformation.applicant.mostRecentPermit && (
                <PermitHolderStatusBadge
                  variant={
                    getPermitExpiryStatus(
                      new Date(permitHolderInformation.applicant.mostRecentPermit.expiryDate)
                    ) === 'EXPIRED'
                      ? 'INACTIVE'
                      : 'ACTIVE'
                  }
                />
              )}
            </HStack>
            {type !== 'NEW' && permitHolderInformation.applicant.mostRecentPermit && (
              // TODO: Fix text styles to avoid !important
              <Text as="p" textStyle="xsmall" margin="0 !important" color="secondary">
                Expiring{' '}
                {new Date(
                  permitHolderInformation.applicant.mostRecentPermit.expiryDate
                ).toDateString()}
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
              type === 'NEW'
                ? permitHolderInformation.dateOfBirth
                : permitHolderInformation.applicant.dateOfBirth
            ) || 'N/A'}
          </Text>
          <Text as="p" textStyle="body-regular">
            Gender:{' '}
            {type === 'NEW'
              ? permitHolderInformation.gender === 'OTHER'
                ? permitHolderInformation.otherGender
                : permitHolderInformation.gender
              : permitHolderInformation.applicant.gender === 'OTHER'
              ? permitHolderInformation.applicant.otherGender
              : permitHolderInformation.applicant.gender}
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
          <Address address={{ addressLine1, addressLine2, city, province, country, postalCode }} />
        </VStack>
      </VStack>
    </PermitHolderInfoCard>
  );
};

export default Card;