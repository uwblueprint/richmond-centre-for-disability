import { Box, Text, Divider, SimpleGrid, Button } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/internal/PermitHolderInfoCard'; // Custom Card Component
import EditReasonForReplacementModal from '@components/requests/modals/EditReasonForReplacementModal'; // Edit modal
import { ReplacementData } from '@tools/components/internal/requests/reason-for-replacement-card'; // ReplacementData type

type ReplacementProps = {
  readonly replacement: ReplacementData;
  readonly isUpdated?: boolean;
};

export default function ReasonForReplacementCard(props: ReplacementProps) {
  const { replacement, isUpdated } = props;
  return (
    <PermitHolderInfoCard
      colSpan={7}
      header={`Reason For Replacement`}
      updated={isUpdated}
      editModal={
        <EditReasonForReplacementModal replacement={replacement}>
          <Button color="primary" variant="ghost" textDecoration="underline">
            <Text textStyle="body-bold">Edit</Text>
          </Button>
        </EditReasonForReplacementModal>
      }
    >
      <Divider pt="24px" />
      <SimpleGrid columns={2} spacingY="12px" spacingX="20px" pt="20px">
        <InfoSection title={`Cause`}>{replacement.reason}</InfoSection>
        <InfoSection title={`Event Timestamp`}>{replacement.lostTimestamp}</InfoSection>
        {replacement.lostLocation && (
          <InfoSection title={`Location Lost`}>{replacement.lostLocation}</InfoSection>
        )}
        {replacement.description && (
          <InfoSection title={`Event Description`}>{replacement.description}</InfoSection>
        )}
      </SimpleGrid>
    </PermitHolderInfoCard>
  );
}

type InfoSectionProps = {
  readonly title: string;
  readonly children: string;
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
        <Text as="p" textStyle="body-regular">
          {children}
        </Text>
      </Box>
    </>
  );
}
