import { Box, Link, Text, Divider } from '@chakra-ui/react'; // Chakra UI
import Table from '@components/internal/Table'; // Table component
import PermitHolderInfoCard from '@components/internal/PermitHolderInfoCard'; // Custom Card Component
import { Column } from 'react-table'; // React table
import { PermitHolderAttachedFile } from '@pages/admin/permit-holder/[permitHolderId]'; // Attached file type

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
      return (
        <>
          <Text as="p">{`#${value.associatedApp}`}</Text>
        </>
      );
    },
  },
  {
    Header: 'Date Uploaded',
    accessor: 'dateUploaded',
    disableSortBy: true,
    maxWidth: 160,
    Cell: ({ value }) => {
      return <Text>{new Date(value).toLocaleDateString('en-ZA')}</Text>;
    },
  },
  {
    accessor: 'fileUrl',
    disableSortBy: true,
    maxWidth: 140,
    Cell: ({ value }) => {
      return (
        <Link href={`/${value}`} passHref>
          <Text textStyle="body-regular" textColor="primary" as="a">
            Download file
          </Text>
        </Link>
      );
    },
  },
];

type AttachedFile = {
  fileName: string;
  associatedApp?: number;
  dateUploaded: Date;
  fileUrl: string;
};

type Props = {
  readonly attachedFiles?: PermitHolderAttachedFile[];
};

export default function AttachedFilesCard({ attachedFiles }: Props) {
  const path = require('path');

  const attachedFilesData: AttachedFile[] =
    attachedFiles?.map(attachedFile => ({
      fileName: path.parse(attachedFile.fileUrl).base,
      associatedApp: attachedFile.associatedApp,
      dateUploaded: attachedFile.dateUploaded,
      fileUrl: attachedFile.fileUrl,
    })) || [];

  return (
    <PermitHolderInfoCard alignGridItems="normal" header={`Attached Files`}>
      <Divider pt="24px" />
      <Box padding="20px 24px">
        <Table columns={COLUMNS} data={attachedFilesData || []} />
      </Box>
    </PermitHolderInfoCard>
  );
}
