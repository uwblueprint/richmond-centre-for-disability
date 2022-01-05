import { Box, Text, Divider, Button } from '@chakra-ui/react'; // Chakra UI
import Table from '@components/Table'; // Table component
import PermitHolderInfoCard from '@components/admin/PermitHolderInfoCard';
import MedicalHistoryModal from '@components/admin/permit-holders/medical-history/Modal'; // Medical History Modal
import { Column } from 'react-table'; // React table
import { MedicalHistoryEntry } from '@tools/pages/admin/permit-holders/types'; // Medical History type for table
import { formatDate } from '@lib/utils/format'; // Date formatter util

const COLUMNS: Column<any>[] = [
  {
    Header: 'Disabling Condition',
    accessor: 'disability',
    disableSortBy: true,
    minWidth: 250,
  },
  {
    Header: 'Certification Date',
    accessor: 'createdAt',
    disableSortBy: true,
    maxWidth: 200,
    Cell: ({ value }) => {
      return <Text>{formatDate(value)}</Text>;
    },
  },
  {
    accessor: 'applicantApplication',
    disableSortBy: true,
    minWidth: 180,
    Cell: ({ value }) => {
      if (value) {
        return (
          <MedicalHistoryModal application={value}>
            <Button color="primary" variant="ghost">
              <Text as="a" textStyle="body-regular">
                View details
              </Text>
            </Button>
          </MedicalHistoryModal>
        );
      }
      return null;
    },
  },
];

type Props = {
  readonly medicalHistory: MedicalHistoryEntry[];
};

export default function MedicalHistoryCard({ medicalHistory }: Props) {
  return (
    <PermitHolderInfoCard alignGridItems="normal" header={`Medical History`}>
      <Divider mt="24px" />
      <Box padding="20px 24px">
        <Table columns={COLUMNS} data={medicalHistory} />
      </Box>
    </PermitHolderInfoCard>
  );
}
