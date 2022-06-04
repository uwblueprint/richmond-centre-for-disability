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
  UpdateNewApplicationPermitHolderInformationRequest,
  UpdateNewApplicationPermitHolderInformationResponse,
  UpdatePermitHolderInformationRequest,
  UpdatePermitHolderInformationResponse,
  UPDATE_NEW_APPLICATION_PERMIT_HOLDER_INFORMATION,
  UPDATE_PERMIT_HOLDER_INFORMATION,
} from '@tools/admin/requests/permit-holder-information'; // Applicant type
import { getPermitExpiryStatus } from '@lib/utils/permit-expiry'; // Get variant of PermitHolderStatusBadge
import { formatDateYYYYMMDD, formatFullName, formatPhoneNumber } from '@lib/utils/format';
import PermitHolderStatusBadge from '@components/admin/PermitHolderStatusBadge';
import Updated from '@components/admin/Updated';
import Address from '@components/admin/Address';
import { permitHolderInformationSchema } from '@lib/applicants/validation';
import { titlecase } from '@tools/string';

type Props = {
  readonly applicationId: number;
  readonly contactInfoUpdated?: boolean;
  readonly addressInfoUpdated?: boolean;
  readonly editDisabled?: boolean;
  /** Whether card is a subsection */
  readonly isSubsection?: boolean;
};

// TODO: Updated states

/**
 * Personal information card for View Request page
 * @param applicationId Application ID
 * @param contactInfoUpdated Whether contact information was updated
 * @param addressInfoUpdated Whether address information was updated
 */
const Card: FC<Props> = props => {
  const { applicationId, contactInfoUpdated, addressInfoUpdated, editDisabled, isSubsection } =
    props;

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

  const [updatePermitHolderInformation] = useMutation<
    UpdatePermitHolderInformationResponse,
    UpdatePermitHolderInformationRequest
  >(UPDATE_PERMIT_HOLDER_INFORMATION);

  const [updateNewPermitHolderInformation] = useMutation<
    UpdateNewApplicationPermitHolderInformationResponse,
    UpdateNewApplicationPermitHolderInformationRequest
  >(UPDATE_NEW_APPLICATION_PERMIT_HOLDER_INFORMATION);

  if (!permitHolderInformation) {
    return null;
  }

  /** Handler for saving permit holder information */
  const handleSave = async (permitHolderFormData: PermitHolderFormData) => {
    const { type, ...permitHolderData } = permitHolderFormData;

    let data:
      | UpdatePermitHolderInformationResponse
      | UpdateNewApplicationPermitHolderInformationResponse
      | undefined
      | null;
    if (type === 'NEW') {
      const validatedData = await permitHolderInformationSchema.validate(permitHolderData);

      ({ data } = await updateNewPermitHolderInformation({
        variables: { input: { id: applicationId, ...validatedData } },
      }));
    } else {
      ({ data } = await updatePermitHolderInformation({
        variables: { input: { id: applicationId, ...permitHolderData } },
      }));
    }

    refetch();
    return data;
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
  const EditModal = (
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

  /** Gender */
  const gender =
    type === 'NEW'
      ? permitHolderInformation.gender === 'OTHER'
        ? permitHolderInformation.otherGender
        : permitHolderInformation.gender
      : permitHolderInformation.applicant.gender === 'OTHER'
      ? permitHolderInformation.applicant.otherGender
      : permitHolderInformation.applicant.gender;

  return (
    <PermitHolderInfoCard
      colSpan={5}
      header={Header}
      editModal={!editDisabled && EditModal}
      isSubsection={isSubsection}
    >
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
            Gender: {gender ? titlecase(gender) : 'N/A'}
          </Text>
        </VStack>
        <Divider />
        <VStack spacing="12px" align="left">
          <Text as="h4" textStyle="body-bold">
            Contact Information {contactInfoUpdated && <Updated />}
          </Text>
          <Text as="p" textStyle="body-regular">
            {formatPhoneNumber(phone)}
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
