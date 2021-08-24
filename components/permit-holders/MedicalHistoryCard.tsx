import { Box, Text, Divider, Link } from '@chakra-ui/react'; // Chakra UI
import Table from '@components/internal/Table'; // Table component
import PermitHolderInfoCard from '@components/internal/PermitHolderInfoCard';
import { Aid, Application } from '@lib/graphql/types'; // Aid enum & Application type
import MedicalHistoryModal from '@components/permit-holders/modals/MedicalHistoryModal'; // Medical History Modal
import { useQuery } from '@apollo/client';
import {
  GetApplicantApplicationsRequest,
  GetApplicantApplicationsResponse,
  GET_APPLICANT_APPLICATIONS_QUERY,
} from '@tools/pages/admin/permit-holders/[permitHolderId]';
import { useState } from 'react';

// Placeholder data
const mockMedicalHistory = {
  disability: 'Condition 1',
  affectsMobility: true,
  mobilityAidRequired: true,
  cannotWalk100m: true,
  aid: [Aid.Cane, Aid.ElectricChair],
  notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  createdAt: '2021/01/01',
};

// const DATA = Array(4).fill({
//   disablingCondition: 'Condition 1',
//   associatedApp: { associatedApp: 12345 },
//   dateUploaded: '2021/01/01',
//   fileUrl: { fileUrl: '/' },
//   application: { application: mockMedicalHistory },
// });

const COLUMNS = [
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
    <MedicalHistoryModal application={mockMedicalHistory as unknown as Application}>
      <Link>
        <Text as="a" color="primary" textStyle="body-regular">
          View details
        </Text>
      </Link>
    </MedicalHistoryModal>
  );
}

type MedicalHistoryEntry = {
  disablingCondition: string;
  dateUploaded: Date;
  associatedApplicationId: number;
};

export default function MedicalHistoryCard() {
  const applicantId = 1;

  const [medicalHistoryData, setMedicalHistoryData] = useState<MedicalHistoryEntry[]>();

  //get data here from api
  useQuery<GetApplicantApplicationsResponse, GetApplicantApplicationsRequest>(
    GET_APPLICANT_APPLICATIONS_QUERY,
    {
      variables: {
        id: applicantId,
      },
      onCompleted: data => {
        setMedicalHistoryData(
          data.applications.map(record => ({
            disablingCondition: record.disability,
            dateUploaded: record.createdAt,
            associatedApplicationId: record.id,
          }))
        );
      },
    }
  );

  return (
    <PermitHolderInfoCard alignGridItems="normal" header={`Medical History`}>
      <Divider pt="24px" />
      <Box padding="20px 24px">
        <Table columns={COLUMNS} data={medicalHistoryData || []} />
      </Box>
    </PermitHolderInfoCard>
  );
}
