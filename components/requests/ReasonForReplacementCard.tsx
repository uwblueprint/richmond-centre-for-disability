import { Box, Text, Divider, SimpleGrid } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/internal/PermitHolderInfoCard'; // Custom Card Component
import { MouseEventHandler } from 'react'; // React

type ReplacementProps = {
  readonly cause: string;
  readonly timestamp: string;
  readonly locationLost: string;
  readonly description: string;
  readonly handleEdit: MouseEventHandler;
  readonly isUpdated?: boolean;
};

export default function ReasonForReplacementCard(props: ReplacementProps) {
  const { isUpdated, handleEdit } = props;
  return (
    <PermitHolderInfoCard
      colSpan={7}
      header={`Reason For Replacement`}
      updated={isUpdated}
      handleEdit={handleEdit}
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
        <Text textStyle="body-regular">{title}</Text>
      </Box>
      <Box>
        <Text textStyle="body-regular">{children}</Text>
      </Box>
    </>
  );
}
