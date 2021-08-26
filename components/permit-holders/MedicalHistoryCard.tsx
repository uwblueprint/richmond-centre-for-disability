import { Box, Text, Divider, Link } from '@chakra-ui/react'; // Chakra UI
import Table from '@components/internal/Table'; // Table component
import PermitHolderInfoCard from '@components/internal/PermitHolderInfoCard';
import { Aid } from '@lib/graphql/types'; // Aid enum
import MedicalHistoryModal from '@components/permit-holders/modals/MedicalHistoryModal'; // Medical History Modal
import { useQuery } from '@apollo/client';
import {
  GetApplicantApplicationsRequest,
  GetApplicantApplicationsResponse,
  GET_APPLICANT_APPLICATIONS_QUERY,
} from '@tools/pages/admin/permit-holders/[permitHolderId]';
import { useState } from 'react';
import { Column } from 'react-table';

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
      return <Text>{new Date(value).toLocaleDateString('en-ZA')}</Text>;
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

type MedicalHistoryEntry = {
  disablingCondition: string;
  dateUploaded: Date;
  associatedApplication: {
    disability: string;
    affectsMobility: boolean;
    mobilityAidRequired: boolean;
    cannotWalk100m: boolean;
    aid: Aid[];
    createdAt: Date;
  };
};

type Props = {
  readonly permitHolderId: number;
};

export default function MedicalHistoryCard({ permitHolderId }: Props) {
  const [medicalHistoryData, setMedicalHistoryData] = useState<MedicalHistoryEntry[]>();

  //get data here from api
  useQuery<GetApplicantApplicationsResponse, GetApplicantApplicationsRequest>(
    GET_APPLICANT_APPLICATIONS_QUERY,
    {
      variables: {
        id: permitHolderId,
      },
      onCompleted: data => {
        setMedicalHistoryData(
          data.applicant.applications.map(record => ({
            disablingCondition: record.disability,
            dateUploaded: record.createdAt,
            associatedApplication: record,
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
