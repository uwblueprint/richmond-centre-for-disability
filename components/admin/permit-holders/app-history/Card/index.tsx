import { StackDivider, VStack } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card Component
import {
  GetAppHistoryRequest,
  GetAppHistoryResponse,
  GET_APP_HISTORY,
} from '@tools/admin/permit-holders/app-history';
import { useQuery } from '@apollo/client';
import AppHistoryRecord from '@components/admin/permit-holders/app-history/Card/AppHistoryRecord';

type Props = {
  readonly applicantId: number;
};

/** Card for displaying past permits of an applicant */
export default function AppHistoryCard({ applicantId }: Props) {
  const { data } = useQuery<GetAppHistoryResponse, GetAppHistoryRequest>(GET_APP_HISTORY, {
    variables: { id: applicantId },
  });

  if (!data?.applicant.permits) {
    return null;
  }

  return (
    <PermitHolderInfoCard header={`Past APPs`} alignGridItems="normal" divider>
      <VStack
        maxHeight="704px"
        alignItems="stretch"
        overflowY="auto"
        spacing="16px"
        divider={<StackDivider borderColor="border.secondary" />}
      >
        {data.applicant.permits.map(permit => (
          <AppHistoryRecord key={permit.application.id} permit={permit} />
        ))}
      </VStack>
    </PermitHolderInfoCard>
  );
}
