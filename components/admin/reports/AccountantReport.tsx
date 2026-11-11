import { useToast } from '@chakra-ui/react';
import { useLazyQuery } from '@tools/hooks/graphql';
import {
  GENERATE_ACCOUNTANT_REPORT_QUERY,
  GenerateAccountantReportRequest,
  GenerateAccountantReportResponse,
} from '@tools/admin/permit-holders/graphql/generate-report';
import { downloadReport } from '@tools/admin/reports';
import ReportForm from '@components/admin/reports/ReportForm';

export default function AccountantReport() {
  const toast = useToast();

  const [generateReport, { loading }] = useLazyQuery<
    GenerateAccountantReportResponse,
    GenerateAccountantReportRequest
  >(GENERATE_ACCOUNTANT_REPORT_QUERY, {
    fetchPolicy: 'network-only',
    onCompleted: ({ generateAccountantReport: { ok, url } }) => {
      if (ok && !!url) {
        downloadReport(url);
        toast({
          status: 'success',
          description: 'A CSV accountant report has been successfully generated.',
        });
      }
    },
  });

  return (
    <ReportForm
      description="Totals of fees, donations and refunds by payment method for requests received in the date range."
      dateLabel="Application Date"
      loading={loading}
      onExport={({ startDate, endDate }) =>
        generateReport({ variables: { input: { startDate, endDate } } })
      }
    />
  );
}
