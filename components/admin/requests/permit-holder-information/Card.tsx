import { FC, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { HStack, VStack, Text, Divider, Button, useToast } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card component
import EditPermitHolderInformationModal from '@components/admin/requests/permit-holder-information/EditModal'; // Edit modal
import {
  GetApplicantInformationRequest,
  GetApplicantInformationResponse,
  GET_APPLICANT_INFORMATION,
  PermitHolderCardData,
  PermitHolderFormData,
  UpdateNewApplicationPermitHolderInformationRequest,
  UpdatePermitHolderInformationRequest,
  UpdatePermitHolderInformationResponse,
  UPDATE_NEW_APPLICATION_PERMIT_HOLDER_INFORMATION,
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
  readonly editDisabled?: boolean;
};

// TODO: Updated states

/**
 * Personal information card for View Request page
 * @param applicationId Application ID
 * @param contactInfoUpdated Whether contact information was updated
 * @param addressInfoUpdated Whether address information was updated
 */
const Card: FC<Props> = props => {
  const { applicationId, contactInfoUpdated, addressInfoUpdated, editDisabled } = props;

  const [permitHolderInformation, setPermitHolderInformation] =
    useState<PermitHolderCardData | null>(null);

  const { refetch } = useQuery<GetApplicantInformationResponse, GetApplicantInformationRequest>(
    GET_APPLICANT_INFORMATION,
    {
      variables: { id: applicationId },
      onCompleted: data => {
        if (data) {
          if (data.application.type == 'NEW') {
            setPermitHolderInformation({
              ...data.application,
              dateOfBirth: formatDateYYYYMMDD(new Date(data.application.dateOfBirth)),
            });
          } else {
            setPermitHolderInformation(data.application);
          }
        }
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  // Toast message
  const toast = useToast();

  const [updatePermitHolderInformation] = useMutation<
    UpdatePermitHolderInformationResponse,
    UpdatePermitHolderInformationRequest
  >(UPDATE_PERMIT_HOLDER_INFORMATION);

  const [updateNewPermitHolderInformation] = useMutation<
    UpdatePermitHolderInformationResponse,
    UpdateNewApplicationPermitHolderInformationRequest
  >(UPDATE_NEW_APPLICATION_PERMIT_HOLDER_INFORMATION);

  if (!permitHolderInformation) {
    return null;
  }

  /** Handler for saving permit holder information */
  const handleSave = async (data: PermitHolderFormData) => {
    if (data.type === 'NEW') {
      if (!data.gender) {
        toast({ status: 'error', description: 'Missing gender', isClosable: true });
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { type, gender, ...permitHolderData } = data;
      await updateNewPermitHolderInformation({
        variables: { input: { id: applicationId, ...permitHolderData, gender } },
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { type, ...permitHolderData } = data;
      await updatePermitHolderInformation({
        variables: { input: { id: applicationId, ...permitHolderData } },
      });
    }
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
    applicant,
  } = permitHolderInformation;

  // Personal information card header
  const Header = applicant ? (
    <a href={`/admin/permit-holder/${applicant.id}`} target="_blank" rel="noreferrer">
      <Text as="h5" variant="link" textStyle="display-small-semibold">
        {formatFullName(firstName, middleName, lastName)}
      </Text>
    </a>
  ) : (
    formatFullName(firstName, middleName, lastName)
  );

  // Personal information card editing modal
  const EditModal = editDisabled !== true && (
    <EditPermitHolderInformationModal
      permitHolderInformation={{
        ...(type === 'NEW'
          ? {
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
              postalCode,
              dateOfBirth: permitHolderInformation.dateOfBirth,
              gender: permitHolderInformation.gender,
              otherGender: permitHolderInformation.otherGender,
            }
          : {
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
              postalCode,
            }),
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
            User ID: {applicant ? applicant.id : 'N/A'}
          </Text>
          <VStack align="left">
            <HStack spacing="12px">
              <Text as="p" textStyle="body-regular">
                Most recent APP:{' '}
                {applicant && applicant.mostRecentPermit
                  ? `#${applicant.mostRecentPermit.rcdPermitId}`
                  : 'N/A'}
              </Text>
              {applicant && applicant.mostRecentPermit && (
                <PermitHolderStatusBadge
                  variant={
                    getPermitExpiryStatus(new Date(applicant.mostRecentPermit.expiryDate)) ===
                    'EXPIRED'
                      ? 'INACTIVE'
                      : 'ACTIVE'
                  }
                />
              )}
            </HStack>
            {applicant && applicant.mostRecentPermit && (
              // TODO: Fix text styles to avoid !important
              <Text as="p" textStyle="xsmall" margin="0 !important" color="secondary">
                Expiring {new Date(applicant.mostRecentPermit.expiryDate).toDateString()}
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
            Renewal updates through email:{' '}
            <b>
              {(
                type === 'NEW'
                  ? receiveEmailUpdates
                  : permitHolderInformation.applicant.receiveEmailUpdates
              )
                ? 'Yes'
                : 'No'}
            </b>
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
