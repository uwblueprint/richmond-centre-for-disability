import { ChangeEvent, useState, useMemo } from 'react'; // React
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
  GeneratePermitHoldersReportRequest,
  GeneratePermitHoldersReportResponse,
  GENERATE_APPLICATIONS_REPORT_QUERY,
  GENERATE_PERMIT_HOLDERS_REPORT_QUERY,
} from '@tools/pages/admin/requests/queries';
import { ApplicationsReportColumn, PermitHoldersReportColumn } from '@lib/graphql/types';

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

  const [selectedColumns, setSelectedColumns] = useState<
    Set<ApplicationsReportColumn | PermitHoldersReportColumn>
  >(new Set());

  const areAllColumnsSelected = useMemo(
    () =>
      Object.values(
        page === 'requests' ? ApplicationsReportColumn : PermitHoldersReportColumn
      ).every(column => selectedColumns.has(column)),
    [selectedColumns]
  );

  const handleSelectColumn =
    (column: ApplicationsReportColumn | PermitHoldersReportColumn) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const updatedSelectedColumns = new Set([...selectedColumns]);
      event.target.checked
        ? updatedSelectedColumns.add(column)
        : updatedSelectedColumns.delete(column);
      setSelectedColumns(updatedSelectedColumns);
    };

  const handleSelectAllColumns = (event: ChangeEvent<HTMLInputElement>) => {
    let updatedSelectedColumns = new Set<ApplicationsReportColumn | PermitHoldersReportColumn>();

    if (page === 'requests') {
      updatedSelectedColumns = event.target.checked
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
    } else {
      updatedSelectedColumns = event.target.checked
        ? new Set([
            PermitHoldersReportColumn.UserId,
            PermitHoldersReportColumn.ApplicantName,
            PermitHoldersReportColumn.ApplicantDateOfBirth,
            PermitHoldersReportColumn.HomeAddress,
            PermitHoldersReportColumn.Email,
            PermitHoldersReportColumn.PhoneNumber,
            PermitHoldersReportColumn.GuardianPoaName,
            PermitHoldersReportColumn.GuardianPoaRelation,
            PermitHoldersReportColumn.GuardianPoaAddress,
            PermitHoldersReportColumn.RecentAppNumber,
            PermitHoldersReportColumn.RecentAppType,
            PermitHoldersReportColumn.UserStatus,
          ])
        : new Set([]);
    }

    setSelectedColumns(updatedSelectedColumns);
  };

  // Toast message
  const toast = useToast();

  // Export csv query
  const [exportCSV, { loading }] =
    page === 'requests'
      ? useLazyQuery<GenerateApplicationsReportResponse, GenerateApplicationsReportRequest>(
          GENERATE_APPLICATIONS_REPORT_QUERY,
          {
            onCompleted: data => {
              if (data.generateApplicationsReport.ok) {
                toast({
                  status: 'success',
                  description: `A CSV requests report has been successfully generated.`,
                });
              }
            },
            onError: error => {
              toast({
                status: 'error',
                description: error.message,
              });
            },
          }
        )
      : useLazyQuery<GeneratePermitHoldersReportResponse, GeneratePermitHoldersReportRequest>(
          GENERATE_PERMIT_HOLDERS_REPORT_QUERY,
          {
            onCompleted: data => {
              if (data.generatePermitHoldersReport.ok) {
                toast({
                  status: 'success',
                  description: `A CSV permit holders report has been successfully generated.`,
                });
              }
            },
            onError: error => {
              toast({
                status: 'error',
                description: error.message,
              });
            },
          }
        );

  /**
   * Handle CSV export
   */
  const handleSubmit = async () => {
    await exportCSV({
      variables: {
        input: {
          startDate,
          endDate,
          columns: [...selectedColumns] as ApplicationsReportColumn[] & PermitHoldersReportColumn[],
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
                isChecked={areAllColumnsSelected}
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
                  <Checkbox
                    isChecked={selectedColumns.has(PermitHoldersReportColumn.UserId)}
                    onChange={handleSelectColumn(PermitHoldersReportColumn.UserId)}
                  >
                    User ID
                  </Checkbox>
                  <Checkbox
                    isChecked={selectedColumns.has(PermitHoldersReportColumn.ApplicantName)}
                    onChange={handleSelectColumn(PermitHoldersReportColumn.ApplicantName)}
                  >
                    Applicant Name
                  </Checkbox>
                  <Checkbox
                    isChecked={selectedColumns.has(PermitHoldersReportColumn.ApplicantDateOfBirth)}
                    onChange={handleSelectColumn(PermitHoldersReportColumn.ApplicantDateOfBirth)}
                  >
                    Applicant DoB
                  </Checkbox>
                  <Checkbox
                    isChecked={selectedColumns.has(PermitHoldersReportColumn.HomeAddress)}
                    onChange={handleSelectColumn(PermitHoldersReportColumn.HomeAddress)}
                  >
                    Home Address
                  </Checkbox>
                  <Checkbox
                    isChecked={selectedColumns.has(PermitHoldersReportColumn.Email)}
                    onChange={handleSelectColumn(PermitHoldersReportColumn.Email)}
                  >
                    Email
                  </Checkbox>
                  <Checkbox
                    isChecked={selectedColumns.has(PermitHoldersReportColumn.PhoneNumber)}
                    onChange={handleSelectColumn(PermitHoldersReportColumn.PhoneNumber)}
                  >
                    Phone Number
                  </Checkbox>
                  <Checkbox
                    isChecked={selectedColumns.has(PermitHoldersReportColumn.GuardianPoaName)}
                    onChange={handleSelectColumn(PermitHoldersReportColumn.GuardianPoaName)}
                  >
                    Guardian/POA Name
                  </Checkbox>
                  <Checkbox
                    isChecked={selectedColumns.has(PermitHoldersReportColumn.GuardianPoaRelation)}
                    onChange={handleSelectColumn(PermitHoldersReportColumn.GuardianPoaRelation)}
                  >
                    Guardian/POA Relation
                  </Checkbox>
                  <Checkbox
                    isChecked={selectedColumns.has(PermitHoldersReportColumn.GuardianPoaAddress)}
                    onChange={handleSelectColumn(PermitHoldersReportColumn.GuardianPoaAddress)}
                  >
                    Guardian/POA Address
                  </Checkbox>
                  <Checkbox
                    isChecked={selectedColumns.has(PermitHoldersReportColumn.RecentAppNumber)}
                    onChange={handleSelectColumn(PermitHoldersReportColumn.RecentAppNumber)}
                  >
                    Recent APP Number
                  </Checkbox>
                  <Checkbox
                    isChecked={selectedColumns.has(PermitHoldersReportColumn.RecentAppType)}
                    onChange={handleSelectColumn(PermitHoldersReportColumn.RecentAppType)}
                  >
                    Recent APP Type
                  </Checkbox>
                  <Checkbox
                    isChecked={selectedColumns.has(PermitHoldersReportColumn.UserStatus)}
                    onChange={handleSelectColumn(PermitHoldersReportColumn.UserStatus)}
                  >
                    User Status
                  </Checkbox>
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
              disabled={!startDate || !endDate || selectedColumns.size === 0}
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
                {selectedColumns.has(PermitHoldersReportColumn.UserId) && (
                  <ListItem fontSize="17px">User ID</ListItem>
                )}
                {selectedColumns.has(PermitHoldersReportColumn.ApplicantName) && (
                  <ListItem fontSize="17px">Applicant Name</ListItem>
                )}
                {selectedColumns.has(PermitHoldersReportColumn.ApplicantDateOfBirth) && (
                  <ListItem fontSize="17px">Applicant DoB</ListItem>
                )}
                {selectedColumns.has(PermitHoldersReportColumn.HomeAddress) && (
                  <ListItem fontSize="17px">Home Address</ListItem>
                )}
                {selectedColumns.has(PermitHoldersReportColumn.Email) && (
                  <ListItem fontSize="17px">Email</ListItem>
                )}
                {selectedColumns.has(PermitHoldersReportColumn.PhoneNumber) && (
                  <ListItem fontSize="17px">Phone Number</ListItem>
                )}
                {selectedColumns.has(PermitHoldersReportColumn.GuardianPoaName) && (
                  <ListItem fontSize="17px">Guardian/POA Name</ListItem>
                )}
                {selectedColumns.has(PermitHoldersReportColumn.GuardianPoaRelation) && (
                  <ListItem fontSize="17px">Guardian/POA Relation</ListItem>
                )}
                {selectedColumns.has(PermitHoldersReportColumn.GuardianPoaAddress) && (
                  <ListItem fontSize="17px">Guardian/POA Address</ListItem>
                )}
                {selectedColumns.has(PermitHoldersReportColumn.RecentAppNumber) && (
                  <ListItem fontSize="17px">Recent APP Number</ListItem>
                )}
                {selectedColumns.has(PermitHoldersReportColumn.RecentAppType) && (
                  <ListItem fontSize="17px">Recent APP Type</ListItem>
                )}
                {selectedColumns.has(PermitHoldersReportColumn.UserStatus) && (
                  <ListItem fontSize="17px">User Status</ListItem>
                )}
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
