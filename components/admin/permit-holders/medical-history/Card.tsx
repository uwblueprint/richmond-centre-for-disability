import { Box, Text, Button } from '@chakra-ui/react'; // Chakra UI
import Table from '@components/Table'; // Table component
import PermitHolderInfoCard from '@components/admin/LayoutCard';
import MedicalHistoryModal from '@components/admin/permit-holders/medical-history/Modal'; // Medical History Modal
import { Column } from 'react-table'; // React table
import { formatDateYYYYMMDD } from '@lib/utils/format'; // Date formatter util
import {
  GetMedicalHistoryRequest,
  GetMedicalHistoryResponse,
  GET_MEDICAL_HISTORY,
  MedicalHistoryRow,
} from '@tools/admin/permit-holders/medical-history';
import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { NewApplication } from '@lib/graphql/types';

const COLUMNS: Column<MedicalHistoryRow>[] = [
  {
    Header: 'Disabling Condition',
    accessor: 'disability',
    disableSortBy: true,
    minWidth: 250,
  },
  {
    Header: 'Certification Date',
    accessor: 'disabilityCertificationDate',
    disableSortBy: true,
    maxWidth: 200,
    Cell: ({ value }) => <Text>{formatDateYYYYMMDD(new Date(value))}</Text>,
  },
  {
    accessor: 'details',
    disableSortBy: true,
    minWidth: 180,
    Cell: ({ value }) => (
      <MedicalHistoryModal details={value}>
        <Button color="primary" variant="ghost">
          <Text as="a" textStyle="body-regular">
            View details
          </Text>
        </Button>
      </MedicalHistoryModal>
    ),
  },
];

type Props = {
  readonly applicantId: number;
};

export default function MedicalHistoryCard({ applicantId }: Props) {
  const { data } = useQuery<GetMedicalHistoryResponse, GetMedicalHistoryRequest>(
    GET_MEDICAL_HISTORY,
    { variables: { id: applicantId } }
  );

  const medicalHistory = useMemo<Array<MedicalHistoryRow>>(() => {
    if (!data?.applicant.completedApplications) {
      return [];
    }

    const filteredApplications = data.applicant.completedApplications.filter(
      application => application.type === 'NEW'
    ) as Array<
      Pick<
        NewApplication,
        | 'disability'
        | 'disabilityCertificationDate'
        | 'patientCondition'
        | 'mobilityAids'
        | 'otherPatientCondition'
      >
    >;

    return filteredApplications.map(
      ({
        disability,
        disabilityCertificationDate,
        patientCondition,
        mobilityAids,
        otherPatientCondition,
      }) => ({
        disability,
        disabilityCertificationDate,
        details: {
          disability,
          disabilityCertificationDate,
          patientCondition,
          mobilityAids: mobilityAids || [],
          notes: otherPatientCondition,
        },
      })
    );
  }, [data]);

  return (
    <PermitHolderInfoCard alignGridItems="normal" header={`Medical History`} divider>
      <Box padding="0 24px 20px">
        <Table columns={COLUMNS} data={medicalHistory} />
      </Box>
    </PermitHolderInfoCard>
  );
}
