import { Box, Text, Divider, VStack, Button, Flex } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card Component
import EditDoctorInformationModal from '@components/admin/requests/doctor-information/EditModal'; // Edit doctor information modal component
import PreviousDoctorsModal from '@components/admin/permit-holders/doctor-information/PreviousDoctorsModal'; // Previous Doctors' Information Modal
import { PreviousPhysicianData } from '@tools/admin/permit-holders/types';
import { Physician } from '@tools/admin/requests/doctor-information';

type DoctorInformationProps = {
  readonly physician: Physician;
  readonly isUpdated?: boolean;
  readonly previousPhysicianData: PreviousPhysicianData[];
  readonly onSave: (physicianData: Physician) => void;
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
      <Divider mt="24px" />

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

      <Divider mt="24px" />

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
          <PreviousDoctorsModal previousPhysicianData={previousPhysicianData}>
            <Button color="primary" variant="ghost" textDecoration="underline">
              <Text textStyle="body-bold">{'View previous doctors'}</Text>
            </Button>
          </PreviousDoctorsModal>
        )}
      </Flex>
    </PermitHolderInfoCard>
  );
}
