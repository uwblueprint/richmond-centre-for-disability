import { ChangeEvent, useState, useMemo } from 'react'; // React
import {
  GridItem,
  Button,
  Text,
  Box,
  Stack,
  Input,
  FormControl,
  FormLabel,
  Checkbox,
  SimpleGrid,
  ListItem,
  useToast,
} from '@chakra-ui/react'; // Chakra UI
import { DownloadIcon } from '@chakra-ui/icons';
import { APPLICATIONS_COLUMNS, GenerateReportStep } from '@tools/admin/reports'; //GenerateReportStep enum
import { useLazyQuery } from '@tools/hooks/graphql';
import {
  GENERATE_APPLICATIONS_REPORT_QUERY,
  GenerateApplicationsReportRequest,
  GenerateApplicationsReportResponse,
} from '@tools/admin/requests/graphql/generate-report';
import { ApplicationsReportColumn } from '@lib/graphql/types';

export default function RequestReports() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [step, setStep] = useState(GenerateReportStep.SelectColumns);

  const [selectedColumns, setSelectedColumns] = useState<Set<ApplicationsReportColumn>>(new Set());

  const areAllColumnsSelected = useMemo(
    () => APPLICATIONS_COLUMNS.every(({ value }) => selectedColumns.has(value)),
    [selectedColumns]
  );

  const handleSelectColumn =
    (column: ApplicationsReportColumn) => (event: ChangeEvent<HTMLInputElement>) => {
      const updatedSelectedColumns = new Set([...selectedColumns]);
      event.target.checked
        ? updatedSelectedColumns.add(column)
        : updatedSelectedColumns.delete(column);
      setSelectedColumns(updatedSelectedColumns);
    };

  const handleSelectAllColumns = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedSelectedColumns = event.target.checked
      ? new Set(APPLICATIONS_COLUMNS.map(({ value }) => value))
      : new Set([]);
    setSelectedColumns(updatedSelectedColumns);
  };

  // Toast message
  const toast = useToast();

  // Export csv query
  const [exportCSV, { loading }] = useLazyQuery<
    GenerateApplicationsReportResponse,
    GenerateApplicationsReportRequest
  >(GENERATE_APPLICATIONS_REPORT_QUERY, {
    onCompleted: data => {
      if (data.generateApplicationsReport.ok && !!data.generateApplicationsReport.url) {
        const link = document.createElement('a');
        link.setAttribute('href', data.generateApplicationsReport.url);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          status: 'success',
          description: `A CSV requests report has been successfully generated.`,
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
          columns: [...selectedColumns],
        },
      },
    });
  };

  return (
    <GridItem alignItems="center">
      <Box />
      {step === GenerateReportStep.SelectColumns ? (
        <Box paddingLeft="16px" maxWidth="45rem" maxHeight="700px" paddingRight="16px">
          <Box paddingTop="24px" paddingBottom="12px">
            <Text textStyle="display-medium-bold">Requests Report</Text>
          </Box>
          <Box paddingY="20px" paddingBottom="44px">
            <Box paddingBottom="32px">
              <FormControl isRequired>
                <FormLabel fontSize="20px" paddingBottom="16px">
                  Application Date
                </FormLabel>
              </FormControl>
              <Stack direction="row" spacing="20px">
                <FormControl isRequired>
                  <FormLabel>{'Start date'}</FormLabel>
                  <Input
                    type="date"
                    width="184px"
                    value={startDate}
                    onChange={event => setStartDate(event.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>{'End date'}</FormLabel>
                  <Input
                    type="date"
                    width="184px"
                    value={endDate}
                    onChange={event => {
                      setEndDate(event.target.value);
                    }}
                  />
                </FormControl>
              </Stack>
            </Box>
            <Box>
              <Stack direction="row" spacing="20px" paddingBottom="16px">
                <FormControl>
                  <FormLabel fontSize="20px">{'Columns to Export'}</FormLabel>
                </FormControl>
              </Stack>
            </Box>
            <Box>
              <Checkbox
                paddingBottom="6px"
                fontWeight="bold"
                isChecked={areAllColumnsSelected}
                onChange={handleSelectAllColumns}
              >
                Select All
              </Checkbox>
              <SimpleGrid columns={3} spacingX="20px" spacingY="6px">
                {APPLICATIONS_COLUMNS.map(({ name, value }) => (
                  <Checkbox
                    key={value}
                    isChecked={selectedColumns.has(value)}
                    onChange={handleSelectColumn(value)}
                  >
                    {name}
                  </Checkbox>
                ))}
              </SimpleGrid>
            </Box>
          </Box>
          <Box paddingBottom="24px">
            <Button
              variant="solid"
              ml={'12px'}
              onClick={() => setStep(GenerateReportStep.Export)}
              disabled={!startDate || !endDate || selectedColumns.size === 0}
            >
              {'Next'}
            </Button>
          </Box>
        </Box>
      ) : step === GenerateReportStep.Export ? (
        <Box paddingLeft="16px" maxWidth="46rem" maxHeight="500px" paddingRight="16px">
          <Box paddingTop="24px" paddingBottom="0px">
            <Stack direction="row">
              <Text textStyle="display-medium-bold" paddingRight="10px">
                Requests Report
              </Text>
              <Button variant="outline" onClick={() => setStep(GenerateReportStep.SelectColumns)}>
                Edit
              </Button>
            </Stack>
          </Box>
          <Box paddingTop="20px" paddingBottom="24px">
            <Box paddingBottom="20px">
              <Stack spacing="16px">
                <Stack direction="row">
                  <Text textStyle="display-medium-bold" fontSize="22px">
                    Application Date:
                  </Text>
                  <Text textStyle="display-medium" fontSize="22px">
                    {startDate} - {endDate}
                  </Text>
                </Stack>
                <Text textStyle="display-medium-bold" fontSize="21px">
                  Columns Exported:
                </Text>
              </Stack>
            </Box>
            <Box>
              <SimpleGrid columns={3} spacingY="6px">
                {APPLICATIONS_COLUMNS.map(({ name, value }) =>
                  selectedColumns.has(value) ? (
                    <ListItem key={value} fontSize="17px">
                      {name}
                    </ListItem>
                  ) : null
                )}
              </SimpleGrid>
            </Box>
          </Box>
          <Box paddingBottom="40px">
            <Button
              onClick={handleSubmit}
              loading={loading}
              variant="solid"
              ml="12px"
              leftIcon={<DownloadIcon />}
            >
              {'Export as CSV'}
            </Button>
          </Box>
        </Box>
      ) : null}
    </GridItem>
  );
}
