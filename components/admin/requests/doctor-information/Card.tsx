import { FC, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Text, Divider, Button, VStack } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card Component
import EditDoctorInformationModal from '@components/admin/requests/doctor-information/EditModal'; // Edit modal
import {
  DoctorCardData,
  GetDoctorInformationResponse,
  GetDoctorInformationRequest,
  GET_DOCTOR_INFORMATION,
  UpdateDoctorInformationResponse,
  UpdateDoctorInformationRequest,
  UPDATE_DOCTOR_INFORMATION,
  DoctorFormData,
} from '@tools/admin/requests/doctor-information'; // Physician type
import { formatFullName, formatPhoneNumber } from '@lib/utils/format';
import Address from '@components/admin/Address';

type Props = {
  readonly applicationId: number;
  readonly isUpdated?: boolean;
  readonly editDisabled?: boolean;
  /** Whether card is a subsection */
  readonly isSubsection?: boolean;
};

const Card: FC<Props> = props => {
  const { applicationId, isUpdated, editDisabled, isSubsection } = props;

  const [doctorInformation, setDoctorInformation] = useState<DoctorCardData | null>(null);

  const { refetch } = useQuery<GetDoctorInformationResponse, GetDoctorInformationRequest>(
    GET_DOCTOR_INFORMATION,
    {
      variables: { id: applicationId },
      onCompleted: data => {
        if (data) {
          setDoctorInformation(data.application);
        }
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const [updateDoctorInformation] =
    useMutation<UpdateDoctorInformationResponse, UpdateDoctorInformationRequest>(
      UPDATE_DOCTOR_INFORMATION
    );

  if (!doctorInformation) {
    return null;
  }

  /** Handler for saving doctor information */
  const handleSave = async (data: DoctorFormData) => {
    if (!data.mspNumber) {
      // TODO: Improve error handling
      return;
    }

    await updateDoctorInformation({
      variables: { input: { id: applicationId, ...data, mspNumber: data.mspNumber } },
    });
    refetch();
  };

  const {
    physicianFirstName: firstName,
    physicianLastName: lastName,
    physicianMspNumber: mspNumber,
    physicianPhone: phone,
    physicianAddressLine1: addressLine1,
    physicianAddressLine2: addressLine2,
    physicianCity: city,
    physicianProvince: province,
    physicianCountry: country,
    physicianPostalCode: postalCode,
  } = doctorInformation;

  return (
    <PermitHolderInfoCard
      colSpan={7}
      header={`Doctor's Information`}
      updated={isUpdated}
      divider
      isSubsection={isSubsection}
      editModal={
        !editDisabled && (
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
        )
      }
    >
      <VStack width="100%" spacing="24px" align="left">
        <VStack spacing="12px" align="left">
          <Text as="p" textStyle="body-regular">
            {formatFullName(firstName, lastName)}
          </Text>
          <Text as="p" textStyle="body-regular">
            MSP Number: {mspNumber}
          </Text>
          <Text as="p" textStyle="body-regular">
            Phone: {formatPhoneNumber(phone)}
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
    </PermitHolderInfoCard>
  );
};

export default Card;
