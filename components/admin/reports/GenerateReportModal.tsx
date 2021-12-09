import { ChangeEvent, useState } from 'react'; // React
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
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
import { GenerateReportStep } from '@tools/components/admin/reports/generate-report-steps'; //GenerateReportStep enum
import { useLazyQuery } from '@apollo/client';
import {
  GenerateApplicationsReportRequest,
  GenerateApplicationsReportResponse,
  GENERATE_APPLICATIONS_REPORT_QUERY,
} from '@tools/pages/admin/requests/queries';
import { ApplicationsReportColumn } from '@lib/graphql/types';

type GenerateReportProps<T> = {
  readonly page: 'requests' | 'permitHolders';
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onChange?: (value: ReadonlyArray<T>) => void;
  readonly onSubmit?: () => void;
  /** Available columns that can be selected */
  readonly columns?: ReadonlyArray<T>;
};

/**
 * Modal for filtering dates and selecting columns to include in requests and permit holders reports
 */
export default function GenerateReportModal<T>(props: GenerateReportProps<T>) {
  const { isOpen, onClose, page } = props;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [step, setStep] = useState(GenerateReportStep.SelectColumns);

  const [selectedColumns, setSelectedColumns] = useState<Set<ApplicationsReportColumn>>(new Set());

  // A function that returns an event-handler function that adds/removes the column from selectedColumns
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
      ? new Set([
          ApplicationsReportColumn.UserId,
          ApplicationsReportColumn.ApplicantName,
          ApplicationsReportColumn.ApplicantDateOfBirth,
          ApplicationsReportColumn.AppNumber,
          ApplicationsReportColumn.ApplicationDate,
          ApplicationsReportColumn.PaymentMethod,
          ApplicationsReportColumn.FeeAmount,
          ApplicationsReportColumn.DonationAmount,
          ApplicationsReportColumn.TotalAmount,
        ])
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
      if (data?.generateApplicationsReport.ok) {
        toast({
          status: 'success',
          description: `A CSV ${
            page === 'permitHolders' ? 'permit holders' : 'requests'
          } report has been successfully generated.`,
        });
      }
    },
    onError: error => {
      toast({
        status: 'error',
        description: error.message,
      });
    },
  });

  /**
   * Handle CSV export
   */
  const handleSubmit = async () => {
    const columns = [];

    selectedColumns.has(ApplicationsReportColumn.UserId) &&
      columns.push(ApplicationsReportColumn.UserId);
    selectedColumns.has(ApplicationsReportColumn.ApplicantName) &&
      columns.push(ApplicationsReportColumn.ApplicantName);
    selectedColumns.has(ApplicationsReportColumn.ApplicantDateOfBirth) &&
      columns.push(ApplicationsReportColumn.ApplicantDateOfBirth);
    selectedColumns.has(ApplicationsReportColumn.AppNumber) &&
      columns.push(ApplicationsReportColumn.AppNumber);
    selectedColumns.has(ApplicationsReportColumn.ApplicationDate) &&
      columns.push(ApplicationsReportColumn.ApplicationDate);
    selectedColumns.has(ApplicationsReportColumn.PaymentMethod) &&
      columns.push(ApplicationsReportColumn.PaymentMethod);
    selectedColumns.has(ApplicationsReportColumn.FeeAmount) &&
      columns.push(ApplicationsReportColumn.FeeAmount);
    selectedColumns.has(ApplicationsReportColumn.DonationAmount) &&
      columns.push(ApplicationsReportColumn.DonationAmount);
    selectedColumns.has(ApplicationsReportColumn.TotalAmount) &&
      columns.push(ApplicationsReportColumn.TotalAmount);

    await exportCSV({
      variables: {
        input: {
          startDate,
          endDate,
          columns,
        },
      },
    });

    onClose();
  };

  /**
   * Render select columns step
   */
  const renderSelectColumns = () => {
    return (
      <form>
        <ModalContent paddingLeft="16px" maxWidth="45rem" maxHeight="600px" paddingRight="16px">
          <ModalHeader paddingTop="24px" paddingBottom="12px">
            <Text textStyle="display-medium-bold">
              {page === 'requests' ? 'Requests Report' : 'Permit Holder Report'}
            </Text>
          </ModalHeader>
          <ModalBody paddingY="20px" paddingBottom="44px">
            <Box paddingBottom="32px">
              <FormControl isRequired>
                <FormLabel fontSize="20px" paddingBottom="16px">
                  {page === 'requests' ? 'Application Date' : 'Expiry Date'}
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
                isChecked={
                  page === 'requests'
                    ? selectedColumns.has(ApplicationsReportColumn.UserId) &&
                      selectedColumns.has(ApplicationsReportColumn.ApplicantName) &&
                      selectedColumns.has(ApplicationsReportColumn.ApplicantDateOfBirth) &&
                      selectedColumns.has(ApplicationsReportColumn.AppNumber) &&
                      selectedColumns.has(ApplicationsReportColumn.ApplicationDate) &&
                      selectedColumns.has(ApplicationsReportColumn.PaymentMethod) &&
                      selectedColumns.has(ApplicationsReportColumn.FeeAmount) &&
                      selectedColumns.has(ApplicationsReportColumn.DonationAmount) &&
                      selectedColumns.has(ApplicationsReportColumn.TotalAmount)
                    : false
                }
                onChange={handleSelectAllColumns}
              >
                Select All
              </Checkbox>
              {page === 'requests' ? (
                <SimpleGrid columns={3} spacingX="20px" spacingY="6px">
                  <Checkbox
                    isChecked={selectedColumns.has(ApplicationsReportColumn.UserId)}
                    onChange={handleSelectColumn(ApplicationsReportColumn.UserId)}
                  >
                    User ID
                  </Checkbox>
                  <Checkbox
                    isChecked={selectedColumns.has(ApplicationsReportColumn.ApplicantName)}
                    onChange={handleSelectColumn(ApplicationsReportColumn.ApplicantName)}
                  >
                    Applicant Name
                  </Checkbox>
                  <Checkbox
                    isChecked={selectedColumns.has(ApplicationsReportColumn.ApplicantDateOfBirth)}
                    onChange={handleSelectColumn(ApplicationsReportColumn.ApplicantDateOfBirth)}
                  >
                    Applicant DoB
                  </Checkbox>
                  <Checkbox
                    isChecked={selectedColumns.has(ApplicationsReportColumn.AppNumber)}
                    onChange={handleSelectColumn(ApplicationsReportColumn.AppNumber)}
                  >
                    APP Number
                  </Checkbox>
                  <Checkbox
                    isChecked={selectedColumns.has(ApplicationsReportColumn.ApplicationDate)}
                    onChange={handleSelectColumn(ApplicationsReportColumn.ApplicationDate)}
                  >
                    Application Date
                  </Checkbox>
                  <Checkbox
                    isChecked={selectedColumns.has(ApplicationsReportColumn.PaymentMethod)}
                    onChange={handleSelectColumn(ApplicationsReportColumn.PaymentMethod)}
                  >
                    Payment Method
                  </Checkbox>
                  <Checkbox
                    isChecked={selectedColumns.has(ApplicationsReportColumn.FeeAmount)}
                    onChange={handleSelectColumn(ApplicationsReportColumn.FeeAmount)}
                  >
                    Fee Amount
                  </Checkbox>
                  <Checkbox
                    isChecked={selectedColumns.has(ApplicationsReportColumn.DonationAmount)}
                    onChange={handleSelectColumn(ApplicationsReportColumn.DonationAmount)}
                  >
                    Donation Amount
                  </Checkbox>
                  <Checkbox
                    isChecked={selectedColumns.has(ApplicationsReportColumn.TotalAmount)}
                    onChange={handleSelectColumn(ApplicationsReportColumn.TotalAmount)}
                  >
                    Total Amount
                  </Checkbox>
                </SimpleGrid>
              ) : (
                <SimpleGrid columns={3} spacingX="0px" spacingY="6px">
                  <Checkbox>User ID</Checkbox>
                  <Checkbox>Applicant Name</Checkbox>
                  <Checkbox>Applicant DoB</Checkbox>
                  <Checkbox>Home Address</Checkbox>
                  <Checkbox>Email</Checkbox>
                  <Checkbox>Phone Number</Checkbox>
                  <Checkbox>Guardian/POA Name</Checkbox>
                  <Checkbox>Guardian/POA Relation</Checkbox>
                  <Checkbox>Guardian/POA Address</Checkbox>
                  <Checkbox>Recent APP Number</Checkbox>
                  <Checkbox>Recent APP Type</Checkbox>
                  <Checkbox>User Status</Checkbox>
                </SimpleGrid>
              )}
            </Box>
          </ModalBody>
          <ModalFooter paddingBottom="24px">
            <Button colorScheme="gray" variant="solid" onClick={onClose}>
              {'Cancel'}
            </Button>
            <Button
              variant="solid"
              ml={'12px'}
              onClick={() => setStep(GenerateReportStep.Export)}
              disabled={
                !startDate ||
                !endDate ||
                (!selectedColumns.has(ApplicationsReportColumn.UserId) &&
                  !selectedColumns.has(ApplicationsReportColumn.ApplicantName) &&
                  !selectedColumns.has(ApplicationsReportColumn.ApplicantDateOfBirth) &&
                  !selectedColumns.has(ApplicationsReportColumn.AppNumber) &&
                  !selectedColumns.has(ApplicationsReportColumn.ApplicationDate) &&
                  !selectedColumns.has(ApplicationsReportColumn.PaymentMethod) &&
                  !selectedColumns.has(ApplicationsReportColumn.FeeAmount) &&
                  !selectedColumns.has(ApplicationsReportColumn.DonationAmount) &&
                  !selectedColumns.has(ApplicationsReportColumn.TotalAmount))
              }
            >
              {'Next'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    );
  };

  /**
   * Render export step
   */
  const renderExport = () => {
    return (
      <ModalContent paddingLeft="16px" maxWidth="46rem" maxHeight="438px" paddingRight="16px">
        <ModalHeader paddingTop="24px" paddingBottom="0px">
          <Stack direction="row">
            <Text textStyle="display-medium-bold" paddingRight="10px">
              {page === 'requests' ? 'Requests Report' : 'Permit Holder Report'}
            </Text>
            <Button variant="outline" onClick={() => setStep(GenerateReportStep.SelectColumns)}>
              Edit
            </Button>
          </Stack>
        </ModalHeader>
        <ModalBody paddingTop="20px" paddingBottom="24px">
          <Box paddingBottom="20px">
            <Stack spacing="16px">
              <Stack direction="row">
                <Text textStyle="display-medium-bold" fontSize="22px">
                  {page === 'requests' ? 'Application Date:' : 'Expiry Date:'}
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
            {page === 'requests' ? (
              <SimpleGrid columns={3} spacingY="6px">
                {selectedColumns.has(ApplicationsReportColumn.UserId) && (
                  <ListItem fontSize="17px">User ID</ListItem>
                )}
                {selectedColumns.has(ApplicationsReportColumn.ApplicantName) && (
                  <ListItem fontSize="17px">Applicant Name</ListItem>
                )}
                {selectedColumns.has(ApplicationsReportColumn.ApplicantDateOfBirth) && (
                  <ListItem fontSize="17px">Applicant DoB</ListItem>
                )}
                {selectedColumns.has(ApplicationsReportColumn.AppNumber) && (
                  <ListItem fontSize="17px">APP Number</ListItem>
                )}
                {selectedColumns.has(ApplicationsReportColumn.ApplicationDate) && (
                  <ListItem fontSize="17px">Application Date</ListItem>
                )}
                {selectedColumns.has(ApplicationsReportColumn.PaymentMethod) && (
                  <ListItem fontSize="17px">Payment Method</ListItem>
                )}
                {selectedColumns.has(ApplicationsReportColumn.FeeAmount) && (
                  <ListItem fontSize="17px">Fee Amount</ListItem>
                )}
                {selectedColumns.has(ApplicationsReportColumn.DonationAmount) && (
                  <ListItem fontSize="17px">Donation Amount</ListItem>
                )}
                {selectedColumns.has(ApplicationsReportColumn.TotalAmount) && (
                  <ListItem fontSize="17px">Total Amount</ListItem>
                )}
              </SimpleGrid>
            ) : (
              <SimpleGrid columns={3} spacingY="6px" spacingX="10px">
                <ListItem fontSize="17px">User ID</ListItem>
                <ListItem fontSize="17px">Applicant Name</ListItem>
                <ListItem fontSize="17px">Applicant DoB</ListItem>
                <ListItem fontSize="17px">Home Address</ListItem>
                <ListItem fontSize="17px">Email</ListItem>
                <ListItem fontSize="17px">Phone Number</ListItem>
                <ListItem fontSize="17px">Guardian/POA Name</ListItem>
                <ListItem fontSize="17px">Guardian/POA Relation</ListItem>
                <ListItem fontSize="17px">Guardian/POA Address</ListItem>
                <ListItem fontSize="17px">Recent APP Number</ListItem>
                <ListItem fontSize="17px">Recent APP Type</ListItem>
                <ListItem fontSize="17px">User Status</ListItem>
              </SimpleGrid>
            )}
          </Box>
        </ModalBody>
        <ModalFooter paddingBottom="40px">
          <Button
            colorScheme="gray"
            variant="solid"
            onClick={() => {
              setStep(GenerateReportStep.SelectColumns);
              onClose();
            }}
          >
            {page === 'requests' ? 'Back to Requests Table' : 'Back to Permit Holder Table'}
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            variant="solid"
            ml="12px"
            leftIcon={<DownloadIcon />}
          >
            {'Export as CSV'}
          </Button>
        </ModalFooter>
      </ModalContent>
    );
  };

  /**
   * Render the modal content based on the current step number
   */
  const renderStep = () => {
    if (step === GenerateReportStep.SelectColumns) {
      return renderSelectColumns();
    } else {
      return renderExport();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={'xl'}>
        <ModalOverlay />
        {renderStep()}
      </Modal>
    </>
  );
}
