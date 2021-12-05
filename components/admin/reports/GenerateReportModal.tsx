import { useState } from 'react'; // React
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

  // Checkbox states
  const [selectAll, setSelectAll] = useState(false);
  const [userID, setUserID] = useState(false);
  const [applicantName, setApplicantName] = useState(false);
  const [applicantDoB, setApplicantDoB] = useState(false);
  const [APPNumber, setAPPNumber] = useState(false);
  const [applicationDate, setApplicationDate] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [feeAmount, setFeeAmount] = useState(false);
  const [donationAmount, setDonationAmount] = useState(false);
  const [totalAmount, setTotalAmount] = useState(false);

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
          description: 'A CSV report has been successfully generated.',
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

    userID && columns.push(ApplicationsReportColumn.UserId);
    applicantName && columns.push(ApplicationsReportColumn.ApplicantName);
    applicantDoB && columns.push(ApplicationsReportColumn.ApplicantDateOfBirth);
    APPNumber && columns.push(ApplicationsReportColumn.AppNumber);
    applicationDate && columns.push(ApplicationsReportColumn.ApplicationDate);
    paymentMethod && columns.push(ApplicationsReportColumn.PaymentMethod);
    feeAmount && columns.push(ApplicationsReportColumn.FeeAmount);
    donationAmount && columns.push(ApplicationsReportColumn.DonationAmount);
    totalAmount && columns.push(ApplicationsReportColumn.TotalAmount);

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
                isChecked={selectAll}
                onChange={event => {
                  setSelectAll(event.target.checked);
                  setUserID(event.target.checked);
                  setApplicantName(event.target.checked);
                  setApplicantDoB(event.target.checked);
                  setAPPNumber(event.target.checked);
                  setApplicationDate(event.target.checked);
                  setPaymentMethod(event.target.checked);
                  setFeeAmount(event.target.checked);
                  setDonationAmount(event.target.checked);
                  setTotalAmount(event.target.checked);
                }}
              >
                Select All
              </Checkbox>
              {page === 'requests' ? (
                <SimpleGrid columns={3} spacingX="20px" spacingY="6px">
                  <Checkbox
                    isChecked={userID}
                    onChange={event => {
                      setUserID(event.target.checked);
                      !event.target.checked && setSelectAll(false);
                    }}
                  >
                    User ID
                  </Checkbox>
                  <Checkbox
                    isChecked={applicantName}
                    onChange={event => {
                      setApplicantName(event.target.checked);
                      !event.target.checked && setSelectAll(false);
                    }}
                  >
                    Applicant Name
                  </Checkbox>
                  <Checkbox
                    isChecked={applicantDoB}
                    onChange={event => {
                      setApplicantDoB(event.target.checked);
                      !event.target.checked && setSelectAll(false);
                    }}
                  >
                    Applicant DoB
                  </Checkbox>
                  <Checkbox
                    isChecked={APPNumber}
                    onChange={event => {
                      setAPPNumber(event.target.checked);
                      !event.target.checked && setSelectAll(false);
                    }}
                  >
                    APP Number
                  </Checkbox>
                  <Checkbox
                    isChecked={applicationDate}
                    onChange={event => {
                      setApplicationDate(event.target.checked);
                      !event.target.checked && setSelectAll(false);
                    }}
                  >
                    Application Date
                  </Checkbox>
                  <Checkbox
                    isChecked={paymentMethod}
                    onChange={event => {
                      setPaymentMethod(event.target.checked);
                      !event.target.checked && setSelectAll(false);
                    }}
                  >
                    Payment Method
                  </Checkbox>
                  <Checkbox
                    isChecked={feeAmount}
                    onChange={event => {
                      setFeeAmount(event.target.checked);
                      !event.target.checked && setSelectAll(false);
                    }}
                  >
                    Fee Amount
                  </Checkbox>
                  <Checkbox
                    isChecked={donationAmount}
                    onChange={event => {
                      setDonationAmount(event.target.checked);
                      !event.target.checked && setSelectAll(false);
                    }}
                  >
                    Donation Amount
                  </Checkbox>
                  <Checkbox
                    isChecked={totalAmount}
                    onChange={event => {
                      setTotalAmount(event.target.checked);
                      !event.target.checked && setSelectAll(false);
                    }}
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
                (!userID &&
                  !applicantName &&
                  !applicantDoB &&
                  !APPNumber &&
                  !applicationDate &&
                  !paymentMethod &&
                  !feeAmount &&
                  !donationAmount &&
                  !totalAmount)
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
                {userID && <ListItem fontSize="17px">User ID</ListItem>}
                {applicantName && <ListItem fontSize="17px">Applicant Name</ListItem>}
                {applicantDoB && <ListItem fontSize="17px">Applicant DoB</ListItem>}
                {APPNumber && <ListItem fontSize="17px">APP Number</ListItem>}
                {applicationDate && <ListItem fontSize="17px">Application Date</ListItem>}
                {paymentMethod && <ListItem fontSize="17px">Payment Method</ListItem>}
                {feeAmount && <ListItem fontSize="17px">Fee Amount</ListItem>}
                {donationAmount && <ListItem fontSize="17px">Donation Amount</ListItem>}
                {totalAmount && <ListItem fontSize="17px">Total Amount</ListItem>}
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
