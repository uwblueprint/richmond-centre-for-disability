import { Text, GridItem, Box, Flex, Input, Button, Spinner, useToast } from '@chakra-ui/react'; // Chakra UI
import { DownloadIcon } from '@chakra-ui/icons'; // Chakra UI icons
import { useState } from 'react'; // React
import { useLazyQuery } from '@tools/hooks/graphql';
import {
  GENERATE_ACCOUNTANT_REPORT_QUERY,
  GenerateAccountantReportRequest,
  GenerateAccountantReportResponse,
} from '@tools/admin/permit-holders/graphql/generate-report';
import EmptyMessage from '@components/EmptyMessage';

export default function AccountantReports() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // Toast message
  const toast = useToast();
  // Export csv query
  const [exportCSV, { loading: queryLoading }] = useLazyQuery<
    GenerateAccountantReportResponse,
    GenerateAccountantReportRequest
  >(GENERATE_ACCOUNTANT_REPORT_QUERY, {
    fetchPolicy: 'network-only',
    onCompleted: data => {
      if (data.generateAccountantReport.ok && !!data.generateAccountantReport.url) {
        const link = document.createElement('a');
        link.setAttribute('href', data.generateAccountantReport.url);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          status: 'success',
          description: `A CSV permit holders report has been successfully generated.`,
        });
      }
    },
  });

  /**
   * Handle CSV export
   */
  const handleSubmit = async () => {
    await exportCSV({
      variables: {
        input: {
          startDate,
          endDate,
        },
      },
    });
  };

  return (
    <GridItem colSpan={12}>
      <Box padding="24px" justifyContent="space-between">
        <Flex marginBottom="20px">
          <Box marginRight="10px">
            <Flex>
              <Text textStyle="button-semibold" padding="8px 8px 0 0">
                Start Date:{' '}
              </Text>
              <Input
                type="date"
                width="184px"
                value={startDate}
                onChange={event => setStartDate(event.target.value)}
              />
            </Flex>
          </Box>
          <Text textStyle="button-semibold" padding="8px">
            {' '}
            -{' '}
          </Text>
          <Box marginLeft="10px">
            <Flex>
              <Text textStyle="button-semibold" padding="8px 8px 0 0">
                End Date:{' '}
              </Text>
              <Input
                type="date"
                width="184px"
                value={endDate}
                onChange={event => {
                  setEndDate(event.target.value);
                }}
              />
            </Flex>
          </Box>
        </Flex>
        {startDate && endDate ? (
          queryLoading ? (
            <Box padding="218px">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
                paddingBottom="16px"
              />
              <Text textStyle="display-large">Fetching Data...</Text>
            </Box>
          ) : (
            <Box padding="153px">
              <Text textStyle="display-large">Processing Date:</Text>
              <Text textStyle="display-large">
                {startDate} - {endDate}
              </Text>
              <Flex justify="center">
                <Text padding="16px" margin="auto" w="23em">
                  Accounting Report has been successfully generated. Please download the report as a
                  .csv by clicking the button below:
                </Text>
              </Flex>
              <Button onClick={handleSubmit} leftIcon={<DownloadIcon />}>
                Export as .CSV
              </Button>
            </Box>
          )
        ) : (
          <EmptyMessage title="No Payments Found" message="Please select a date range" />
        )}
      </Box>
    </GridItem>
  );
}
