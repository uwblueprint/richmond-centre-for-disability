import { Box, Text, Divider, VStack, Button, Flex } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/PermitHolderInfoCard'; // Custom Card Component
import { UpsertPhysicianInput } from '@lib/graphql/types'; // Physician type
import EditDoctorInformationModal from '@components/admin/requests/modals/EditDoctorInformationModal'; // Edit doctor information modal component
import PreviousDoctorsInformationModal from '@components/admin/permit-holders/modals/PreviousDoctorsInformationModal'; // Previous Doctors' Information Modal
import { PreviousPhysicianData } from '@tools/pages/admin/permit-holders/types';
import { DoctorInformation } from '@tools/components/admin/requests/forms/doctor-information-form';

type DoctorInformationProps = {
  readonly physician: DoctorInformation;
  readonly isUpdated?: boolean;
  readonly previousPhysicianData: PreviousPhysicianData[];
  readonly onSave: (physicianData: UpsertPhysicianInput) => void;
};

/**
 * Card component for doctor information using doctor information form.
 * @param props - Props
 * @returns doctor information card.
 */
export default function DoctorInformationCard(props: DoctorInformationProps) {
  const { physician, isUpdated, previousPhysicianData, onSave } = props;

  return (
    <PermitHolderInfoCard
      colSpan={7}
      header={`Doctor's Information`}
      updated={isUpdated}
      editModal={
        <EditDoctorInformationModal doctorInformation={physician} onSave={onSave}>
          <Button color="primary" variant="ghost" textDecoration="underline">
            <Text textStyle="body-bold">Edit</Text>
          </Button>
        </EditDoctorInformationModal>
      }
    >
      <Divider pt="24px" />

      <VStack spacing="12px" align="left" paddingTop="24px">
        <Box>
          <Text as="p" textStyle="body-regular">
            {physician.name}
          </Text>
        </Box>
        <Box>
          <Text as="p" textStyle="body-regular">
            {`MSP Number: ${physician.mspNumber}`}
          </Text>
        </Box>
        <Box>
          <Text as="p" textStyle="body-regular">
            {`Phone: ${physician.phone}`}
          </Text>
        </Box>
      </VStack>

      <Divider pt="24px" />

      <VStack spacing="12px" pt="24px" align="left">
        <Box>
          <Text as="h4" textStyle="body-bold">
            Address
          </Text>
        </Box>
        <Box>
          <Text as="p" textStyle="body-regular">
            {physician.addressLine1}
          </Text>
          <Text as="p" textStyle="body-regular">
            {physician.addressLine2 || ''}
          </Text>
          <Text as="p" textStyle="body-regular">
            {`${physician.city}`}
          </Text>
          <Text as="p" textStyle="body-regular">
            {`Canada`}
          </Text>
          <Text as="p" textStyle="body-regular">
            {physician.postalCode}
          </Text>
        </Box>
      </VStack>

      <Flex w="100%" justifyContent="flex-end" paddingTop="8px">
        {previousPhysicianData.length > 0 && (
          <PreviousDoctorsInformationModal previousPhysicianData={previousPhysicianData}>
            <Button color="primary" variant="ghost" textDecoration="underline">
              <Text textStyle="body-bold">{'View previous doctors'}</Text>
            </Button>
          </PreviousDoctorsInformationModal>
        )}
      </Flex>
    </PermitHolderInfoCard>
  );
}
