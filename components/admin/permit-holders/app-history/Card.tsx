import { Box, Text } from '@chakra-ui/react'; // Chakra UI
import Link from 'next/link'; //Next.js Link
import Table from '@components/Table'; // Table component
import PermitStatusBadge from '@components/admin/PermitStatusBadge'; // Request status badge component
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card Component
import { Column } from 'react-table'; // React Table
import { formatDateYYYYMMDD } from '@lib/utils/format'; // Date formatter util
import {
  AppHistoryRow,
  GetAppHistoryRequest,
  GetAppHistoryResponse,
  GET_APP_HISTORY,
} from '@tools/admin/permit-holders/app-history';
import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { getPermitExpiryStatus } from '@lib/utils/permit-expiry';

const COLUMNS: Column<AppHistoryRow>[] = [
  {
    Header: 'Permit #',
    accessor: 'rcdPermitId',
    disableSortBy: true,
    maxWidth: 140,
    Cell: ({ value }) => <Text as="p">{`#${value}`}</Text>,
  },
  {
    Header: 'Request Type',
    accessor: 'requestType',
    disableSortBy: true,
    maxWidth: 140,
    Cell: ({ value }) => <Text as="p">{value}</Text>,
  },
  {
    Header: 'Status',
    accessor: 'status',
    disableSortBy: true,
    maxWidth: 195,
    Cell: ({ value }) => (
      <Box pr="10px">
        <PermitStatusBadge variant={getPermitExpiryStatus(new Date(value))} />
      </Box>
    ),
  },
  {
    Header: 'Expiry Date',
    accessor: 'expiryDate',
    disableSortBy: true,
    maxWidth: 140,
    Cell: ({ value }) => {
      return <Text>{formatDateYYYYMMDD(value)}</Text>;
    },
  },
  {
    accessor: 'applicationId',
    disableSortBy: true,
    maxWidth: 140,
    Cell: ({ value }) => (
      <Link href={`/admin/request/${value}`} passHref>
        <Text textStyle="body-regular" textColor="primary" as="a">
          View APP
        </Text>
      </Link>
    ),
  },
];

type AppHistoryProps = {
  readonly applicantId: number;
};

export default function AppHistoryCard({ applicantId }: AppHistoryProps) {
  const { data } = useQuery<GetAppHistoryResponse, GetAppHistoryRequest>(GET_APP_HISTORY, {
    variables: { id: applicantId },
  });

  const appHistory = useMemo<Array<AppHistoryRow>>(
    () =>
      data?.applicant.permits
        ? data.applicant.permits.map(({ expiryDate, rcdPermitId, application }) => ({
            rcdPermitId,
            requestType: application.type,
            status: getPermitExpiryStatus(new Date(expiryDate)),
            expiryDate,
            applicationId: application.id,
          }))
        : [],
    [data]
  );

  return (
    <PermitHolderInfoCard header={`APP History`} alignGridItems="normal" divider>
      <Box padding="0 24px 20px">
        <Table columns={COLUMNS} data={appHistory} />
      </Box>
    </PermitHolderInfoCard>
  );
}
