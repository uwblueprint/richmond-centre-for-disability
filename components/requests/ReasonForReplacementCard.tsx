import { Box, Text, Divider, SimpleGrid, Button } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/internal/PermitHolderInfoCard'; // Custom Card Component
import EditReasonForReplacementModal from '@components/requests/modals/EditReasonForReplacementModal'; // Edit modal
import { ReasonForReplacement } from '@lib/types'; // Types

type ReplacementProps = {
  readonly cause: ReasonForReplacement;
  readonly timestamp: string;
  readonly locationLost: string;
  readonly description: string;
  readonly isUpdated?: boolean;
};

export default function ReasonForReplacementCard(props: ReplacementProps) {
  const { isUpdated } = props;
  return (
    <PermitHolderInfoCard
      colSpan={7}
      header={`Reason For Replacement`}
      updated={isUpdated}
      editModal={
        <EditReasonForReplacementModal>
          <Button color="primary" variant="ghost" textDecoration="underline">
            <Text textStyle="body-bold">Edit</Text>
          </Button>
        </EditReasonForReplacementModal>
      }
    >
      <Divider pt="24px" />
      <SimpleGrid columns={2} spacingY="12px" spacingX="20px" pt="20px">
        <InfoSection title={`Cause`}>{props.cause}</InfoSection>
        <InfoSection title={`Event Timestamp`}>{props.timestamp}</InfoSection>
        <InfoSection title={`Location Lost`}>{props.locationLost}</InfoSection>
        <InfoSection title={`Event Description`}>{props.description}</InfoSection>
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
