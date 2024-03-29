import { useState } from 'react';
import {
  VStack,
  Text,
  Divider,
  Link,
  Button,
  Tooltip,
  useClipboard,
  useToast,
} from '@chakra-ui/react'; // Chakra UI
import EditUserInformationModal from '@components/admin/permit-holders/permit-holder-information/EditModal'; // Edit User Information Modal
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card component
import { formatDateYYYYMMDD } from '@lib/utils/date'; // Date formatter util
import { formatPhoneNumber } from '@lib/utils/format'; // String formatter util
import {
  ApplicantCardData,
  ApplicantFormData,
  GetApplicantRequest,
  GetApplicantResponse,
  GET_APPLICANT_QUERY,
  UpdateApplicantGeneralInformationRequest,
  UpdateApplicantGeneralInformationResponse,
  UPDATE_APPLICANT_GENERAL_INFORMATION_MUTATION,
} from '@tools/admin/permit-holders/permit-holder-information';
import { useMutation, useQuery } from '@tools/hooks/graphql';
import Address from '@components/admin/Address';
import { permitHolderInformationSchema } from '@lib/applicants/validation';
import { titlecase } from '@tools/string';

type PersonalInformationProps = {
  readonly applicantId: number;
};

export default function PermitHolderInformationCard(props: PersonalInformationProps) {
  const { applicantId } = props;

  const toast = useToast();

  const [permitHolderInformation, setPermitHolderInformation] =
    useState<ApplicantCardData | null>(null);

  const { refetch } = useQuery<GetApplicantResponse, GetApplicantRequest>(GET_APPLICANT_QUERY, {
    variables: { id: applicantId },
    onCompleted: data => {
      if (data) {
        setPermitHolderInformation(data.applicant);
      }
    },
    notifyOnNetworkStatusChange: true,
  });

  const [updateGeneralInformation, { loading }] = useMutation<
    UpdateApplicantGeneralInformationResponse,
    UpdateApplicantGeneralInformationRequest
  >(UPDATE_APPLICANT_GENERAL_INFORMATION_MUTATION, {
    onCompleted: data => {
      if (data.updateApplicantGeneralInformation.ok) {
        toast({
          status: 'success',
          description: "User's information has been edited.",
          isClosable: true,
        });
      }
    },
  });
  const handleSave = async (applicantFormData: ApplicantFormData) => {
    const validatedData = await permitHolderInformationSchema.validate(applicantFormData);

    const { data } = await updateGeneralInformation({
      variables: { input: { id: applicantId, ...validatedData } },
    });

    refetch();
    return data;
  };

  const { hasCopied, onCopy } = useClipboard(permitHolderInformation?.email || '');

  if (!permitHolderInformation) {
    return null;
  }

  const {
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    gender,
    otherGender,
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

  return (
    <PermitHolderInfoCard
      colSpan={5}
      header={
        <Text as="h4" textStyle="body-bold">
          Personal Information
        </Text>
      }
      editModal={
        <EditUserInformationModal
          applicant={{
            firstName,
            middleName,
            lastName,
            dateOfBirth,
            gender,
            phone,
            email,
            receiveEmailUpdates,
            addressLine1,
            addressLine2,
            city,
            postalCode,
          }}
          onSave={handleSave}
          loading={loading}
        >
          <Button color="primary" variant="ghost" textDecoration="underline">
            <Text textStyle="body-bold">Edit</Text>
          </Button>
        </EditUserInformationModal>
      }
    >
      <VStack width="100%" spacing="24px" align="stretch">
        {/* Personal information */}
        <VStack spacing="12px" align="left">
          <Text as="p" textStyle="body-regular">
            Date of Birth: {formatDateYYYYMMDD(new Date(dateOfBirth))}
          </Text>
          <Text as="p" textStyle="body-regular">
            Gender: {gender === 'OTHER' && otherGender ? otherGender : titlecase(gender)}
          </Text>
        </VStack>

        <Divider />

        <VStack spacing="12px" align="left">
          <Text as="h4" textStyle="body-bold">
            Contact Information
          </Text>
          <Text as="p" textStyle="body-regular">
            {formatPhoneNumber(phone)}
          </Text>
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
            Renewal updates through email: <b>{receiveEmailUpdates ? 'Yes' : 'No'}</b>
          </Text>
        </VStack>

        <Divider />

        <VStack spacing="12px" align="left">
          <Text as="h4" textStyle="body-bold">
            Home Address
          </Text>
          <Address address={{ addressLine1, addressLine2, city, province, country, postalCode }} />
        </VStack>
      </VStack>
    </PermitHolderInfoCard>
  );
}
