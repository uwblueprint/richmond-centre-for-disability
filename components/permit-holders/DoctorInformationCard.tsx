import { Box, Text, Divider, VStack, Button, Flex } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/internal/PermitHolderInfoCard'; // Custom Card Component
import { Physician } from '@lib/graphql/types'; // Physician type
import EditDoctorInformationModal from '@components/requests/modals/EditDoctorInformationModal'; // Edit doctor information modal component
import PreviousDoctorsInformationModal from '@components/permit-holders/modals/PreviousDoctorsInformationModal'; // Previous Doctors' Information Modal

type DoctorInformationProps = {
  physician: Physician;
  readonly isUpdated?: boolean;
  readonly permitHolderId: number;
};

export default function DoctorInformationCard(props: DoctorInformationProps) {
  const { physician, isUpdated } = props;
  return (
    <PermitHolderInfoCard
      colSpan={7}
      header={`Doctor's Information`}
      updated={isUpdated}
      editModal={
        // TODO: Pass down a real onSave function from props
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        <EditDoctorInformationModal physician={physician} onSave={() => {}}>
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
            {physician?.name}
          </Text>
        </Box>
        <Box>
          <Text as="p" textStyle="body-regular">
            {`MSP Number: ${physician?.mspNumber}`}
          </Text>
        </Box>
        <Box>
          <Text as="p" textStyle="body-regular">
            {`Phone: ${physician?.phone}`}
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
            {physician?.addressLine1}
          </Text>
          <Text as="p" textStyle="body-regular">
            {physician?.addressLine2}
          </Text>
          <Text as="p" textStyle="body-regular">
            {`${physician?.city} ${physician?.province}`}
          </Text>
          <Text as="p" textStyle="body-regular">
            {`Canada`}
          </Text>
          <Text as="p" textStyle="body-regular">
            {physician?.postalCode}
          </Text>
        </Box>
      </VStack>

      <Flex w="100%" justifyContent="flex-end" paddingTop="8px">
        <PreviousDoctorsInformationModal permitHolderId={props.permitHolderId}>
          <Button color="primary" variant="ghost" textDecoration="underline">
            <Text textStyle="body-bold">{'View previous doctors'}</Text>
          </Button>
        </PreviousDoctorsInformationModal>
      </Flex>
    </PermitHolderInfoCard>
  );
}
