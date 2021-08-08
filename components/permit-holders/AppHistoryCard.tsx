import { Box, Link, Text, Divider } from '@chakra-ui/react'; // Chakra UI
import Table from '@components/internal/Table'; // Table component
import RequestStatusBadge from '@components/internal/RequestStatusBadge'; // Request status badge component
import PermitHolderInfoCard from '@components/internal/PermitHolderInfoCard'; // Custom Card Component

// Placeholder data

const DATA = Array(4).fill({
  rcdPermitId: { rcdPermitId: 354 },
  isRenewal: 'false',
  requestStatus: 'EXPIRING',
  expiryDate: '2021/01/01',
  applicationId: { applicationId: 1 },
});

const COLUMNS = [
  {
    Header: 'Permit #',
    accessor: 'rcdPermitId',
    disableSortBy: true,
    maxWidth: 140,
    Cell: _renderPermitId,
  },
  {
    Header: 'Request Type',
    accessor: 'isRenewal',
    disableSortBy: true,
    maxWidth: 140,
    Cell: _renderRequestType,
  },
  {
    Header: 'Status',
    accessor: 'requestStatus',
    disableSortBy: true,
    maxWidth: 195,
    Cell: _renderStatusBadge,
  },
  {
    Header: 'Expiry Date',
    accessor: 'expiryDate',
    disableSortBy: true,
    maxWidth: 140,
  },
  {
    accessor: 'applicationId',
    disableSortBy: true,
    maxWidth: 140,
    Cell: _renderAppLink,
  },
];

type PermitIdProps = {
  value: { rcdPermitId: number };
};

function _renderPermitId({ value }: PermitIdProps) {
  return (
    <>
      <Text as="p">{`#${value.rcdPermitId}`}</Text>
    </>
  );
}

type RequestTypeProps = {
  value: { isRenewal: boolean };
};

function _renderRequestType({ value }: RequestTypeProps) {
  return (
    <>
      <Text as="p">{value.isRenewal ? `Renewal` : `Replacement`}</Text>
    </>
  );
}

type StatusProps = {
  value: 'COMPLETED' | 'INPROGRESS' | 'PENDING' | 'REJECTED' | 'EXPIRING' | 'EXPIRED' | 'ACTIVE';
};

function _renderStatusBadge({ value }: StatusProps) {
  return (
    <Box pr="10px">
      <RequestStatusBadge variant={value} />
    </Box>
  );
}

type appProps = {
  value: { applicationId: number };
};

function _renderAppLink({ value }: appProps) {
  return (
    <Link href={`/admin/request/${value.applicationId}`} passHref>
      <Text textStyle="body-regular" textColor="primary" as="a">
        View APP
      </Text>
    </Link>
  );
}

export default function AppHistoryCard() {
  return (
    <PermitHolderInfoCard header={`APP History`} alignGridItems="normal">
      <Divider pt="24px" />
      <Box padding="20px 24px">
        <Table columns={COLUMNS} data={DATA} />
      </Box>
    </PermitHolderInfoCard>
  );
}
