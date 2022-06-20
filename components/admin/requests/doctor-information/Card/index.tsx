import { FC, useEffect, useState } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { Text, Divider, Button, VStack, Box } from '@chakra-ui/react'; // Chakra UI
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
  CompareDoctorInformationResponse,
  CompareDoctorInformationRequest,
  COMPARE_DOCTOR_INFORMATION,
  GetCurrentPhysicianMspNumberResponse,
  GetCurrentPhysicianMspNumberRequest,
  GET_CURRENT_PHYSICIAN_MSP_NUMBER,
} from '@tools/admin/requests/doctor-information'; // Physician type
import { formatFullName, formatPhoneNumber } from '@lib/utils/format';
import Address from '@components/admin/Address';
import { requestPhysicianInformationSchema } from '@lib/physicians/validation';
import PhysicianDiffAlert from './PhysicianDiffAlert';
import { Physician, PhysicianMatchStatus } from '@lib/graphql/types';

type Props = {
  readonly applicationId: number;
  readonly applicationCompleted?: boolean;
  readonly applicantId?: number;
  readonly isUpdated?: boolean;
  readonly editDisabled?: boolean;
  /** Whether card is a subsection */
  readonly isSubsection?: boolean;
};

const Card: FC<Props> = props => {
  const {
    applicationId,
    applicationCompleted = false,
    applicantId,
    isUpdated,
    editDisabled,
    isSubsection,
  } = props;

  const [doctorInformation, setDoctorInformation] = useState<DoctorCardData | null>(null);

  const [physicianDiffStatus, setPhysicianDiffStatus] =
    useState<PhysicianMatchStatus | 'OUTDATED' | null>(null);
  const [existingPhysicianData, setExistingPhysicianData] =
    useState<Omit<Physician, 'status'> | null>(null);

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

  const [comparePhysicians] = useLazyQuery<
    CompareDoctorInformationResponse,
    CompareDoctorInformationRequest
  >(COMPARE_DOCTOR_INFORMATION);

  const [getCurrentPhysician] = useLazyQuery<
    GetCurrentPhysicianMspNumberResponse,
    GetCurrentPhysicianMspNumberRequest
  >(GET_CURRENT_PHYSICIAN_MSP_NUMBER);

  const [updateDoctorInformation] =
    useMutation<UpdateDoctorInformationResponse, UpdateDoctorInformationRequest>(
      UPDATE_DOCTOR_INFORMATION
    );

  useEffect(() => {
    const getPhysicianDiffStatus = async () => {
      if (!doctorInformation) {
        return null;
      }

      if (applicationCompleted && applicantId && doctorInformation?.physicianMspNumber) {
        // Completed application - compare to applicant's current doctor information
        const { data } = await getCurrentPhysician({
          variables: {
            id: applicantId,
          },
        });
        const currentPhysicianMspNumber = data?.applicant?.medicalInformation.physician.mspNumber;
        if (
          currentPhysicianMspNumber &&
          currentPhysicianMspNumber !== doctorInformation.physicianMspNumber
        ) {
          setPhysicianDiffStatus('OUTDATED');
        } else {
          setPhysicianDiffStatus(null);
        }
        setExistingPhysicianData(null);
      } else {
        // Application is not complete, compare to doctor record
        const {
          physicianMspNumber,
          physicianFirstName,
          physicianLastName,
          physicianPhone,
          physicianAddressLine1,
          physicianAddressLine2,
          physicianCity,
          physicianProvince,
          physicianCountry,
          physicianPostalCode,
        } = doctorInformation;

        const { data } = await comparePhysicians({
          variables: {
            input: {
              mspNumber: physicianMspNumber,
              firstName: physicianFirstName,
              lastName: physicianLastName,
              phone: physicianPhone,
              addressLine1: physicianAddressLine1,
              addressLine2: physicianAddressLine2,
              city: physicianCity,
              province: physicianProvince,
              country: physicianCountry,
              postalCode: physicianPostalCode,
            },
          },
        });

        setPhysicianDiffStatus(data?.comparePhysicians.status || null);
        setExistingPhysicianData(data?.comparePhysicians.existingPhysicianData || null);
      }
    };

    getPhysicianDiffStatus();
  }, [
    applicationCompleted,
    applicantId,
    doctorInformation,
    getCurrentPhysician,
    comparePhysicians,
  ]);

  if (!doctorInformation) {
    return null;
  }

  /** Handler for saving doctor information */
  const handleSave = async (doctorFormData: DoctorFormData) => {
    const validatedData = await requestPhysicianInformationSchema.validate(doctorFormData);

    const { data } = await updateDoctorInformation({
      variables: {
        input: { id: applicationId, ...validatedData, mspNumber: validatedData.mspNumber },
      },
    });

    refetch();
    return data;
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
        {physicianDiffStatus !== null && (
          <PhysicianDiffAlert applicantId={applicantId} matchStatus={physicianDiffStatus} />
        )}
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
        {physicianDiffStatus === 'DOES_NOT_MATCH_EXISTING' && existingPhysicianData && (
          <Box padding="20px" backgroundColor="background.grey" borderRadius="6px">
            <VStack align="flex-start" spacing="12px">
              <Text textStyle="button-semibold" as="h3">
                Information last saved with this MSP number:
              </Text>
              <Text as="p" textStyle="body-regular">
                {formatFullName(existingPhysicianData.firstName, existingPhysicianData.lastName)}
              </Text>
              <Text as="p" textStyle="body-regular">
                MSP Number: {existingPhysicianData.mspNumber}
              </Text>
              <Text as="p" textStyle="body-regular">
                Phone: {formatPhoneNumber(existingPhysicianData.phone)}
              </Text>
              <Divider />
              <Text as="h4" textStyle="body-bold">
                Address
              </Text>
              <Address
                address={{
                  addressLine1: existingPhysicianData.addressLine1,
                  addressLine2: existingPhysicianData.addressLine2,
                  city: existingPhysicianData.city,
                  province: existingPhysicianData.province,
                  country: existingPhysicianData.country,
                  postalCode: existingPhysicianData.postalCode,
                }}
              />
            </VStack>
          </Box>
        )}
      </VStack>
    </PermitHolderInfoCard>
  );
};

export default Card;
