import { StackDivider, VStack } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card Component
import { PermitRecord } from '@tools/admin/permit-holders/app-history';
import AppHistoryRecord from '@components/admin/permit-holders/app-history/Card/AppHistoryRecord';

type Props = {
  readonly appHistory: ReadonlyArray<PermitRecord>;
};

/** Card for displaying past permits of an applicant */
export default function AppHistoryCard({ appHistory }: Props) {
  return (
    <PermitHolderInfoCard header={`Past APPs`} alignGridItems="normal" divider>
      <VStack
        maxHeight="704px"
        alignItems="stretch"
        overflowY="auto"
        spacing="16px"
        divider={<StackDivider borderColor="border.secondary" />}
      >
        {appHistory.map(permit => (
          <AppHistoryRecord key={permit.application.id} permit={permit} />
        ))}
      </VStack>
    </PermitHolderInfoCard>
  );
}
