import { Box, Text, Divider } from '@chakra-ui/react'; // Chakra UI
import Table from '@components/internal/Table'; // Table component
import PermitHolderInfoCard from '@components/internal/PermitHolderInfoCard'; // Custom Card Component
import { PermitHolderAttachedFile } from '@tools/pages/admin/permit-holders/permit-holder-id'; // Attached file type

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
    Cell: (value: any) => {
      return <>{value && <Text as="p">{`#${value}`}</Text>}</>;
    },
  },
  {
    Header: 'Date Uploaded',
    accessor: 'dateUploaded',
    disableSortBy: true,
    maxWidth: 160,
    Cell: (value: any) => {
      return <Text>{new Date(value).toLocaleDateString('en-CA')}</Text>;
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

//Will replace this type with a GraphQL type
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
      associatedApp: attachedFile.appNumber || undefined,
      dateUploaded: attachedFile.createdAt,
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
