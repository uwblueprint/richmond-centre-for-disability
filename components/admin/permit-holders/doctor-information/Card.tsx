import { Text, Divider, VStack, Button, Flex, useToast } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card Component
import EditDoctorInformationModal from '@components/admin/requests/doctor-information/EditModal'; // Edit doctor information modal component
import PreviousDoctorsModal from '@components/admin/permit-holders/doctor-information/PreviousDoctorsModal'; // Previous Doctors' Information Modal
import { useMutation, useQuery } from '@apollo/client';
import {
  DoctorFormData,
  GetDoctorInformationRequest,
  GetDoctorInformationResponse,
  GET_DOCTOR_INFORMATION,
  PreviousDoctorRow,
  UpdateDoctorInformationRequest,
  UpdateDoctorInformationResponse,
  UPDATE_DOCTOR_INFORMATION,
} from '@tools/admin/permit-holders/doctor-information';
import { formatFullName } from '@lib/utils/format';
import Address from '@components/admin/Address';
import { useMemo } from 'react';

type DoctorInformationProps = {
  readonly applicantId: number;
  readonly isUpdated?: boolean;
};

/**
 * Card component for doctor information using doctor information form.
 * @param props - Props
 * @returns doctor information card.
 */
export default function DoctorInformationCard(props: DoctorInformationProps) {
  const { applicantId, isUpdated } = props;

  const toast = useToast();

  const { data, refetch } = useQuery<GetDoctorInformationResponse, GetDoctorInformationRequest>(
    GET_DOCTOR_INFORMATION,
    {
      variables: { id: applicantId },
    }
  );

  const [updateDoctorInformation] = useMutation<
    UpdateDoctorInformationResponse,
    UpdateDoctorInformationRequest
  >(UPDATE_DOCTOR_INFORMATION, {
    onError: error => {
      toast({
        status: 'error',
        description: error.message,
        isClosable: true,
      });
    },
  });
  const handleSave = async (data: DoctorFormData) => {
    if (!data.mspNumber) {
      // TODO: Improve error handling
      return;
    }

    await updateDoctorInformation({
      variables: { input: { id: applicantId, ...data, mspNumber: data.mspNumber } },
    });
    refetch();
  };

  /** Previous doctors data */
  const previousDoctors = useMemo<PreviousDoctorRow[]>(() => {
    if (!data?.applicant.completedApplications) {
      return [];
    }

    // Need type declaration as TS could not infer type
    const filteredApplications = data.applicant.completedApplications.filter(
      ({ type }) => type !== 'REPLACEMENT'
    ) as Array<{
      id: number;
      type: 'NEW' | 'RENEWAL';
      physicianFirstName: string;
      physicianLastName: string;
      physicianPhone: string;
      physicianMspNumber: string;
    }>;

    return filteredApplications.map(
      ({ physicianFirstName, physicianLastName, physicianPhone, physicianMspNumber, id }) => ({
        name: {
          firstName: physicianFirstName,
          lastName: physicianLastName,
        },
        phone: physicianPhone,
        mspNumber: physicianMspNumber,
        applicationId: id,
      })
    );
  }, [data]);

  if (!data?.applicant.medicalInformation.physician) {
    return null;
  }

  const {
    firstName,
    lastName,
    mspNumber,
    phone,
    addressLine1,
    addressLine2,
    city,
    province,
    country,
    postalCode,
  } = data.applicant.medicalInformation.physician;

  return (
    <PermitHolderInfoCard
      colSpan={7}
      header={`Doctor's Information`}
      updated={isUpdated}
      divider
      editModal={
        <EditDoctorInformationModal
          doctorInformation={{
            firstName,
            lastName,
            mspNumber,
            phone,
            addressLine1,
            addressLine2,
            city,
            postalCode,
          }}
          onSave={handleSave}
        >
          <Button color="primary" variant="ghost" textDecoration="underline">
            <Text textStyle="body-bold">Edit</Text>
          </Button>
        </EditDoctorInformationModal>
      }
    >
      <VStack width="100%" spacing="24px" align="stretch">
        <VStack spacing="12px" align="left">
          <Text as="p" textStyle="body-regular" textAlign="left">
            {formatFullName(firstName, lastName)}
          </Text>
          <Text as="p" textStyle="body-regular" textAlign="left">
            {`MSP Number: ${mspNumber}`}
          </Text>
          <Text as="p" textStyle="body-regular" textAlign="left">
            {`Phone: ${phone}`}
          </Text>
        </VStack>
        <Divider />
        <VStack spacing="12px" align="left">
          <Text as="h4" textStyle="body-bold">
            Address
          </Text>
          <Address address={{ addressLine1, addressLine2, city, province, country, postalCode }} />
        </VStack>
      </VStack>

      <Flex w="100%" justifyContent="flex-end" paddingTop="8px">
        <PreviousDoctorsModal previousPhysicianData={previousDoctors}>
          <Button color="primary" variant="ghost" textDecoration="underline">
            <Text textStyle="body-bold">{'View previous doctors'}</Text>
          </Button>
        </PreviousDoctorsModal>
      </Flex>
    </PermitHolderInfoCard>
  );
}
