import { Box, Text, Divider, Link } from '@chakra-ui/react'; // Chakra UI
import Table from '@components/internal/Table'; // Table component
import PermitHolderInfoCard from '@components/internal/PermitHolderInfoCard';
import { Aid, MedicalInformation } from '@lib/graphql/types'; // Aid enum & MedicalInformation type
import MedicalHistoryModal from '@components/permit-holders/modals/MedicalHistoryModal'; // Medical History Modal

// Placeholder data
const mockMedicalHistory = {
  disability: 'Condition 1',
  affectsMobility: true,
  mobilityAidRequired: true,
  cannotWalk100m: true,
  aid: [Aid.Cane, Aid.ElectricChair],
  notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  certificationDate: '2021/01/01',
};

const DATA = Array(4).fill({
  disablingCondition: 'Condition 1',
  associatedApp: { associatedApp: 12345 },
  dateUploaded: '2021/01/01',
  fileUrl: { fileUrl: '/' },
  application: { application: mockMedicalHistory },
});

const COLUMNS = [
  {
    Header: 'Disabling Condition(s)',
    accessor: 'disablingCondition',
    disableSortBy: true,
    minWidth: 250,
  },
  {
    Header: 'Certification Date',
    accessor: 'dateUploaded',
    disableSortBy: true,
    // NOTE: Check value
    minWidth: 200,
  },
  {
    accessor: 'associatedApplicationId',
    disableSortBy: true,
    minWidth: 180,
    Cell: _renderConditionDetailsLink,
  },
];

function _renderConditionDetailsLink() {
  return (
    <MedicalHistoryModal medicalInformation={mockMedicalHistory as MedicalInformation}>
      <Link>
        <Text as="a" color="primary" textStyle="body-regular">
          View details
        </Text>
      </Link>
    </MedicalHistoryModal>
  );
}

export default function MedicalHistoryCard() {
  return (
    <PermitHolderInfoCard colSpan={12} header={`Medical History`}>
      <Divider pt="24px" />
      <Box padding="20px 24px">
        <Table columns={COLUMNS} data={DATA} />
      </Box>
    </PermitHolderInfoCard>
  );
}
