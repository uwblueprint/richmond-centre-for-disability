import { Box, Link, Text, Divider } from '@chakra-ui/react'; // Chakra UI
import Table from '@components/internal/Table'; // Table component
import PermitHolderInfoCard from '@components/internal/PermitHolderInfoCard'; // Custom Card Component
import { useState } from 'react'; //React
import { Column } from 'react-table'; // React table
import {
  GetApplicantAttachedFilesRequest,
  GetApplicantAttachedFilesResponse,
  GET_APPLICANT_ATTACHED_FILES_QUERY,
} from '@tools/pages/admin/permit-holders/[permitHolderId]'; // Applicant attached files query
import { useQuery } from '@apollo/client'; // Apollo client

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
  associatedApp: number;
  dateUploaded: Date;
  fileUrl: string;
};

type Props = {
  readonly permitHolderId: number;
};

export default function AttachedFilesCard({ permitHolderId }: Props) {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>();
  const path = require('path');

  useQuery<GetApplicantAttachedFilesResponse, GetApplicantAttachedFilesRequest>(
    GET_APPLICANT_ATTACHED_FILES_QUERY,
    {
      variables: {
        id: permitHolderId,
      },
      onCompleted: data => {
        const files: AttachedFile[] = [];
        data.applicant.applications.forEach(application => {
          application.applicationProcessing.documentUrls?.forEach(documentUrl => {
            files.push({
              fileName: path.parse(documentUrl).base,
              associatedApp: application.id,
              dateUploaded: application.applicationProcessing.createdAt,
              fileUrl: documentUrl,
            });
          });
        });
        setAttachedFiles(files);
      },
    }
  );

  return (
    <PermitHolderInfoCard alignGridItems="normal" header={`Attached Files`}>
      <Divider pt="24px" />
      <Box padding="20px 24px">
        <Table columns={COLUMNS} data={attachedFiles || []} />
      </Box>
    </PermitHolderInfoCard>
  );
}
