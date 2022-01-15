import { useMutation, useQuery } from '@apollo/client';
import { Box, Text, SimpleGrid, Button } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card Component
import EditReasonForReplacementModal from '@components/admin/requests/reason-for-replacement/EditModal'; // Edit modal
import { formatDateVerbose } from '@lib/utils/format';
import {
  GetReasonForReplacementRequest,
  GetReasonForReplacementResponse,
  GET_REASON_FOR_REPLACEMENT,
  UpdateReasonForReplacementRequest,
  UpdateReasonForReplacementResponse,
  UPDATE_REASON_FOR_REPLACEMENT,
} from '@tools/admin/requests/reason-for-replacement';
import { ReasonForReplacementFormData } from '@tools/admin/requests/reason-for-replacement';

type ReplacementProps = {
  readonly applicationId: number;
  readonly isUpdated?: boolean;
};

export default function ReasonForReplacementCard(props: ReplacementProps) {
  const { applicationId, isUpdated } = props;

  const { data, refetch } = useQuery<
    GetReasonForReplacementResponse,
    GetReasonForReplacementRequest
  >(GET_REASON_FOR_REPLACEMENT, { variables: { id: applicationId } });

  const [updateReasonForReplacement] = useMutation<
    UpdateReasonForReplacementResponse,
    UpdateReasonForReplacementRequest
  >(UPDATE_REASON_FOR_REPLACEMENT);
  const handleSave = async (data: ReasonForReplacementFormData) => {
    // TODO: Improve validation
    const {
      reason,
      lostTimestamp,
      lostLocation,
      stolenJurisdiction,
      stolenPoliceFileNumber,
      stolenPoliceOfficerName,
      eventDescription,
    } = data;
    if (reason !== null) {
      await updateReasonForReplacement({
        variables: {
          input: {
            id: applicationId,
            reason,
            lostTimestamp,
            lostLocation,
            stolenJurisdiction,
            stolenPoliceFileNumber,
            stolenPoliceOfficerName,
            eventDescription,
          },
        },
      });
      refetch();
    }
  };

  if (!data?.application) {
    return null;
  }

  // TODO: Support STOLEN
  const { reason, lostTimestamp, lostLocation, eventDescription } = data.application;

  return (
    <PermitHolderInfoCard
      colSpan={7}
      header={`Reason For Replacement`}
      updated={isUpdated}
      divider
      editModal={
        <EditReasonForReplacementModal
          reasonForReplacement={{ ...data.application }}
          onSave={handleSave}
        >
          <Button color="primary" variant="ghost" textDecoration="underline">
            <Text textStyle="body-bold">Edit</Text>
          </Button>
        </EditReasonForReplacementModal>
      }
    >
      <SimpleGrid columns={2} spacingY="12px" spacingX="20px">
        <InfoSection title={`Cause`}>{reason}</InfoSection>
        {lostTimestamp && (
          <InfoSection title={`Event Timestamp`}>
            {formatDateVerbose(new Date(lostTimestamp))}
          </InfoSection>
        )}
        {lostLocation && <InfoSection title={`Location Lost`}>{lostLocation}</InfoSection>}
        {eventDescription && (
          <InfoSection title={`Event Description`}>{eventDescription}</InfoSection>
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
        <Text as="p" textStyle="body-regular" textAlign="left">
          {title}
        </Text>
      </Box>
      <Box>
        <Text as="p" textStyle="body-regular" textAlign="left">
          {children}
        </Text>
      </Box>
    </>
  );
}
