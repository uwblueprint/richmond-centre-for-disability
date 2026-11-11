import { useToast } from '@chakra-ui/react';
import { useLazyQuery } from '@tools/hooks/graphql';
import {
  GENERATE_PERMIT_HOLDERS_REPORT_QUERY,
  GeneratePermitHoldersReportRequest,
  GeneratePermitHoldersReportResponse,
} from '@tools/admin/permit-holders/graphql/generate-report';
import { PERMIT_HOLDERS_COLUMNS, downloadReport } from '@tools/admin/reports';
import ReportForm from '@components/admin/reports/ReportForm';

export default function RenewalsReport() {
  const toast = useToast();

  const [generateReport, { loading }] = useLazyQuery<
    GeneratePermitHoldersReportResponse,
    GeneratePermitHoldersReportRequest
  >(GENERATE_PERMIT_HOLDERS_REPORT_QUERY, {
    fetchPolicy: 'network-only',
    onCompleted: ({ generatePermitHoldersReport: { ok, url } }) => {
      if (ok && !!url) {
        downloadReport(url);
        toast({
          status: 'success',
          description: 'A CSV renewals report has been successfully generated.',
        });
      }
    },
  });

  return (
    <ReportForm
      description="Permit holders with a permit expiring in the date range, for renewal follow-up. This was previously the Permit Holders report."
      dateLabel="Expiry Date"
      columns={PERMIT_HOLDERS_COLUMNS}
      loading={loading}
      onExport={input => generateReport({ variables: { input } })}
    />
  );
}
