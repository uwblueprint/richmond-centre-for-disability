import { useToast } from '@chakra-ui/react';
import { useLazyQuery } from '@tools/hooks/graphql';
import {
  GENERATE_APPLICATIONS_REPORT_QUERY,
  GenerateApplicationsReportRequest,
  GenerateApplicationsReportResponse,
} from '@tools/admin/requests/graphql/generate-report';
import { APPLICATIONS_COLUMNS, downloadReport } from '@tools/admin/reports';
import ReportForm from '@components/admin/reports/ReportForm';

export default function RequestsReport() {
  const toast = useToast();

  const [generateReport, { loading }] = useLazyQuery<
    GenerateApplicationsReportResponse,
    GenerateApplicationsReportRequest
  >(GENERATE_APPLICATIONS_REPORT_QUERY, {
    fetchPolicy: 'network-only',
    onCompleted: ({ generateApplicationsReport: { ok, url } }) => {
      if (ok && !!url) {
        downloadReport(url);
        toast({
          status: 'success',
          description: 'A CSV requests report has been successfully generated.',
        });
      }
    },
  });

  return (
    <ReportForm
      description="Every new, renewal and replacement request received in the date range, with the columns you choose."
      dateLabel="Application Date"
      columns={APPLICATIONS_COLUMNS}
      loading={loading}
      onExport={input => generateReport({ variables: { input } })}
    />
  );
}
