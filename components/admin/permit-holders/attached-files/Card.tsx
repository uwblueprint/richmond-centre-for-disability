import { Box, Text, Divider } from '@chakra-ui/react'; // Chakra UI
import Table from '@components/Table'; // Table component
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card Component
import { Column } from 'react-table';
import { formatDate } from '@lib/utils/format'; // Date formatter util

const DATA = Array(4).fill({
  fileName: 'test.pdf',
  associatedApp: 12345,
  dateUploaded: '2021/01/01',
  fileUrl: '/',
});

const COLUMNS: Column<any>[] = [
  {
    Header: 'File Name',
    accessor: 'fileName',
    disableSortBy: true,
    minWidth: 160,
  },
  {
    Header: 'Associated APP',
    accessor: 'associatedApp',
    disableSortBy: true,
    maxWidth: 220,
    Cell: ({ value }) => {
      return <>{value && <Text as="p">{`#${value}`}</Text>}</>;
    },
  },
  {
    Header: 'Date Uploaded',
    accessor: 'dateUploaded',
    disableSortBy: true,
    maxWidth: 160,
    Cell: ({ value }) => {
      return <Text>{formatDate(value)}</Text>;
    },
  },
  {
    accessor: 'fileUrl',
    disableSortBy: true,
    maxWidth: 140,
    Cell: () => {
      return null;
    },
  },
];

export default function AttachedFilesCard() {
  //TODO: use attachedFiles from [permitHolderId].tsx instead of hardcoded DATA when AWS is setup.

  return (
    <PermitHolderInfoCard alignGridItems="normal" header={`Attached Files`}>
      <Divider mt="24px" />
      <Box padding="20px 24px">
        <Table columns={COLUMNS} data={DATA} />
      </Box>
    </PermitHolderInfoCard>
  );
}
