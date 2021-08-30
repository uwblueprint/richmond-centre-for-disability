import { Box, Text, Divider, Link } from '@chakra-ui/react'; // Chakra UI
import Table from '@components/internal/Table'; // Table component
import PermitHolderInfoCard from '@components/internal/PermitHolderInfoCard';
import MedicalHistoryModal from '@components/permit-holders/modals/MedicalHistoryModal'; // Medical History Modal
import { Column } from 'react-table'; // React table
import { MedicalHistoryEntry } from '@tools/pages/admin/permit-holders/permit-holder-id'; // Medical History type for table

const COLUMNS: Column<any>[] = [
  {
    Header: 'Disabling Condition',
    accessor: 'disablingCondition',
    disableSortBy: true,
    minWidth: 250,
  },
  {
    Header: 'Certification Date',
    accessor: 'dateUploaded',
    disableSortBy: true,
    maxWidth: 200,
    Cell: ({ value }) => {
      return <Text>{new Date(value).toLocaleDateString('en-CA')}</Text>;
    },
  },
  {
    accessor: 'associatedApplication',
    disableSortBy: true,
    minWidth: 180,
    Cell: ({ value }) => {
      return (
        <MedicalHistoryModal application={value}>
          <Link>
            <Text as="a" color="primary" textStyle="body-regular">
              View details
            </Text>
          </Link>
        </MedicalHistoryModal>
      );
    },
  },
];

type Props = {
  readonly medicalHistory: MedicalHistoryEntry[];
};

export default function MedicalHistoryCard({ medicalHistory }: Props) {
  return (
    <PermitHolderInfoCard alignGridItems="normal" header={`Medical History`}>
      <Divider pt="24px" />
      <Box padding="20px 24px">
        <Table columns={COLUMNS} data={medicalHistory || []} />
      </Box>
    </PermitHolderInfoCard>
  );
}
