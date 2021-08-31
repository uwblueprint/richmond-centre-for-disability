import { Box, Text, Divider } from '@chakra-ui/react'; // Chakra UI
import Link from 'next/link'; //Next.js Link
import Table from '@components/internal/Table'; // Table component
import RequestStatusBadge from '@components/internal/RequestStatusBadge'; // Request status badge component
import PermitHolderInfoCard from '@components/internal/PermitHolderInfoCard'; // Custom Card Component
import { Column } from 'react-table'; // React Table
import { PermitData } from '@tools/pages/admin/permit-holders/types'; // Permit Data Types

const COLUMNS: Column<any>[] = [
  {
    Header: 'Permit #',
    accessor: 'rcdPermitId',
    disableSortBy: true,
    maxWidth: 140,
    Cell: ({ value }) => {
      return (
        <>
          <Text as="p">{`#${value}`}</Text>
        </>
      );
    },
  },
  {
    Header: 'Request Type',
    accessor: 'isRenewal',
    disableSortBy: true,
    maxWidth: 140,
    Cell: ({ value }) => {
      return (
        <>
          <Text as="p">{value ? `Renewal` : `Replacement`}</Text>
        </>
      );
    },
  },
  {
    Header: 'Status',
    accessor: 'status',
    disableSortBy: true,
    maxWidth: 195,
    Cell: ({ value }) => {
      return (
        <Box pr="10px">
          <RequestStatusBadge variant={value} />
        </Box>
      );
    },
  },
  {
    Header: 'Expiry Date',
    accessor: 'expiryDate',
    disableSortBy: true,
    maxWidth: 140,
    Cell: ({ value }) => {
      return <Text>{new Date(value).toLocaleDateString('en-CA')}</Text>;
    },
  },
  {
    accessor: 'applicationId',
    disableSortBy: true,
    maxWidth: 140,
    Cell: ({ value }) => {
      return (
        <Link href={`/admin/request/${value}`} passHref>
          <Text textStyle="body-regular" textColor="primary" as="a">
            View APP
          </Text>
        </Link>
      );
    },
  },
];

type AppHistoryProps = {
  readonly permits: PermitData[];
};

export default function AppHistoryCard({ permits }: AppHistoryProps) {
  return (
    <PermitHolderInfoCard header={`APP History`} alignGridItems="normal">
      <Divider pt="24px" />
      <Box padding="20px 24px">
        <Table columns={COLUMNS} data={permits} />
      </Box>
    </PermitHolderInfoCard>
  );
}
