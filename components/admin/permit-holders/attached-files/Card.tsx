import { Box, Text } from '@chakra-ui/react'; // Chakra UI
import Table from '@components/Table'; // Table component
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card Component
import { Column } from 'react-table';
import { formatDate } from '@lib/utils/format'; // Date formatter util
import {
  AttachedFilesRow,
  GetAttachedFilesRequest,
  GetAttachedFilesResponse,
  GET_ATTACHED_FILES,
} from '@tools/admin/permit-holders/attached-files';
import { useQuery } from '@apollo/client';
import { FC, useMemo } from 'react';

const COLUMNS: Column<AttachedFilesRow>[] = [
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

type Props = {
  readonly applicantId: number;
};

const AttachedFilesCard: FC<Props> = ({ applicantId }) => {
  // TODO: Integrate file names and download functionality once AWS is set up

  const { data } = useQuery<GetAttachedFilesResponse, GetAttachedFilesRequest>(GET_ATTACHED_FILES, {
    variables: { id: applicantId },
  });

  const attachedFiles = useMemo<Array<AttachedFilesRow>>(() => {
    if (!data?.applicant.permits) {
      return [];
    }

    // Need type declaration as TS could not infer type
    const filteredPermits = data.applicant.permits.filter(
      permit => permit.application.processing.documentsUrl !== null
    ) as unknown as Array<{
      rcdPermitId: number;
      application: {
        processing: { documentsUrl: string; documentsUrlUpdatedAt: Date };
      };
    }>;

    return filteredPermits.map(permit => {
      const { rcdPermitId, application } = permit;
      const { documentsUrl, documentsUrlUpdatedAt } = application.processing;

      return {
        fileName: 'Placeholder file name', // TODO: Replace with real file name
        associatedApp: rcdPermitId,
        dateUploaded: documentsUrlUpdatedAt,
        fileUrl: documentsUrl,
      };
    });
  }, [data]);

  return (
    <PermitHolderInfoCard alignGridItems="normal" header={`Attached Files`} divider>
      <Box padding="0 24px 20px">
        <Table columns={COLUMNS} data={attachedFiles} />
      </Box>
    </PermitHolderInfoCard>
  );
};

export default AttachedFilesCard;
