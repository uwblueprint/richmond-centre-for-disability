import { Box, Link, Text, Divider } from '@chakra-ui/react'; // Chakra UI
import Table from '@components/internal/Table'; // Table component
import PermitHolderInfoCard from '@components/internal/PermitHolderInfoCard'; // Custom Card Component

// Placeholder data

const DATA = Array(4).fill({
  fileName: 'test.pdf',
  associatedApp: { associatedApp: 12345 },
  dateUploaded: '2021/01/01',
  fileUrl: { fileUrl: '/' },
});

const COLUMNS = [
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
    Cell: _renderAssociatedApp,
  },
  {
    Header: 'Date Uploaded',
    accessor: 'dateUploaded',
    disableSortBy: true,
    maxWidth: 160,
  },
  {
    accessor: 'fileUrl',
    disableSortBy: true,
    maxWidth: 140,
    Cell: _renderFileLink,
  },
];

type AssociatedAppProps = {
  value: { associatedApp: number };
};

function _renderAssociatedApp({ value }: AssociatedAppProps) {
  return (
    <>
      <Text as="p">{`#${value.associatedApp}`}</Text>
    </>
  );
}

type downloadFileProps = {
  value: { fileUrl: number };
};

function _renderFileLink({ value }: downloadFileProps) {
  return (
    <Link href={`/${value.fileUrl}`} passHref>
      <Text textStyle="body-regular" textColor="primary" as="a">
        Download file
      </Text>
    </Link>
  );
}

export default function AttachedFilesCard() {
  return (
    <PermitHolderInfoCard colSpan={12} header={`Attached Files`}>
      <Divider pt="24px" />
      <Box padding="20px 24px">
        <Table columns={COLUMNS} data={DATA} />
      </Box>
    </PermitHolderInfoCard>
  );
}
