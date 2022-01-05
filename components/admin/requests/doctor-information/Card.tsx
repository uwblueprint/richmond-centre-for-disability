import { Box, Text, Divider, SimpleGrid, Button } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card Component
import EditDoctorInformationModal from '@components/admin/requests/doctor-information/EditModal'; // Edit modal
import { UpdateApplicationInput } from '@lib/graphql/types'; // GraphQL types
import { Physician } from '@tools/components/admin/requests/doctor-information'; // Physician type

type DoctorInformationProps = {
  readonly physician: Physician;
  readonly isUpdated?: boolean;
  readonly onSave: (
    physicianData: Pick<
      UpdateApplicationInput,
      | 'physicianMspNumber'
      | 'physicianName'
      | 'physicianAddressLine1'
      | 'physicianAddressLine2'
      | 'physicianCity'
      | 'physicianPostalCode'
      | 'physicianPhone'
    >
  ) => void;
};

export default function DoctorInformationCard(props: DoctorInformationProps) {
  const { physician, isUpdated, onSave } = props;

  /**
   * Handle saving physician data
   * @param physicianData Physician data to save
   */
  const savePhysicianData = (physicianData: Physician) => {
    const { mspNumber, name, addressLine1, addressLine2, city, postalCode, phone } = physicianData;
    onSave({
      physicianName: name,
      physicianMspNumber: mspNumber,
      physicianPhone: phone,
      physicianAddressLine1: addressLine1,
      physicianAddressLine2: addressLine2,
      physicianCity: city,
      physicianPostalCode: postalCode,
    });
  };

  return (
    <PermitHolderInfoCard
      colSpan={7}
      header={`Doctor's Information`}
      updated={isUpdated}
      editModal={
        <EditDoctorInformationModal doctorInformation={physician} onSave={savePhysicianData}>
          <Button color="primary" variant="ghost" textDecoration="underline">
            <Text textStyle="body-bold">Edit</Text>
          </Button>
        </EditDoctorInformationModal>
      }
    >
      <Divider mt="20px" />
      <SimpleGrid columns={2} spacingX="20px" spacingY="12px" pt="20px">
        <InfoSection title={`Name`}>{physician.name}</InfoSection>
        <InfoSection title={`MSP #`}>{String(physician.mspNumber)}</InfoSection>
        <InfoSection title={`Phone`}>{physician.phone}</InfoSection>
        <InfoSection title={`Address`}>
          {physician.addressLine1} {physician.addressLine2}
          {`${physician.city} ${physician.province}`}
          {`Canada`}
          {physician.postalCode}
        </InfoSection>
      </SimpleGrid>
    </PermitHolderInfoCard>
  );
}

type InfoSectionProps = {
  readonly title: string;
  readonly children: string | ReadonlyArray<string | null | undefined>;
};

function InfoSection({ title, children }: InfoSectionProps) {
  return (
    <>
      <Box w="200px" h="27px">
        <Text as="p" textStyle="body-regular">
          {title}
        </Text>
      </Box>
      <Box>
        {typeof children === 'string' ? (
          <Text as="p" textStyle="body-regular">
            {children}
          </Text>
        ) : (
          children.map(
            (paragraph, i) =>
              paragraph && (
                <Text as="p" key={`paragraph-${i}`} textStyle="body-regular">
                  {paragraph}
                </Text>
              )
          )
        )}
      </Box>
    </>
  );
}
