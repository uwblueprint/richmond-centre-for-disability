import { useQuery, useMutation } from '@tools/hooks/graphql';
import {
  Divider,
  VStack,
  Button,
  Text,
  useToast,
  Link,
  Tooltip,
  HStack,
  Switch,
} from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card Component
import AssignNumberModal from '@components/admin/requests/processing/AssignNumberModal'; // AssignNumber Modal component
import ProcessingTaskStep from '@components/admin/requests/processing/TaskStep'; // Processing Task Step
import {
  AssignAppNumberRequest,
  AssignAppNumberResponse,
  ASSIGN_APP_NUMBER_MUTATION,
  GenerateInvoiceRequest,
  GenerateInvoiceResponse,
  GENERATE_INVOICE_MUTATION,
  CreateWalletCardRequest,
  CreateWalletCardResponse,
  CREATE_WALLET_CARD_MUTATION,
  GetApplicationProcessingRequest,
  GetApplicationProcessingResponse,
  GET_APPLICATION_PROCESSING,
  HolepunchParkingPermitRequest,
  HolepunchParkingPermitResponse,
  HOLEPUNCH_APP_MUTATION,
  MailOutRequest,
  MailOutResponse,
  MAIL_OUT_APP_MUTATION,
  REVIEW_REQUEST_INFORMATION_MUTATION,
  ReviewRequestInformationRequest,
  ReviewRequestInformationResponse,
  UploadDocumentsResponse,
  UploadDocumentsRequest,
  UPLOAD_DOCUMENTS_MUTATION,
  RefundPaymentResponse,
  RefundPaymentRequest,
  REFUND_PAYMENT_MUTATION,
} from '@tools/admin/requests/processing-tasks-card';
import ReviewInformationStep from '@components/admin/requests/processing/ReviewInformationStep';
import { clientUploadToS3, getFileName } from '@lib/utils/s3-utils';
import TaskCardUploadStep from '@components/admin/requests/processing/TaskCardUploadStep';
import { useMemo, useState } from 'react';
import { formatFullName } from '@lib/utils/format';

type ProcessingTasksCardProps = {
  readonly applicationId: number;
};

/**
 * Card containing task processing in View Request page (after approval)
 * @param applicationId Application ID
 */
export default function ProcessingTasksCard({ applicationId }: ProcessingTasksCardProps) {
  const { data, refetch } = useQuery<
    GetApplicationProcessingResponse,
    GetApplicationProcessingRequest
  >(GET_APPLICATION_PROCESSING, {
    variables: { id: applicationId },
  });

  const [showTaskLog, setShowTaskLog] = useState(false);

  const [assignAppNumber, { loading: assignAppNumberLoading }] = useMutation<
    AssignAppNumberResponse,
    AssignAppNumberRequest
  >(ASSIGN_APP_NUMBER_MUTATION);
  const handleAssignAppNumber = async (appNumber: number | null) => {
    await assignAppNumber({ variables: { input: { applicationId, appNumber } } });
    refetch();
  };

  const [holepunchParkingPermit, { loading: holepunchParkingPermitLoading }] =
    useMutation<HolepunchParkingPermitResponse, HolepunchParkingPermitRequest>(
      HOLEPUNCH_APP_MUTATION
    );
  const handleHolepunchParkingPermit = async (appHolepunched: boolean) => {
    await holepunchParkingPermit({ variables: { input: { applicationId, appHolepunched } } });
    refetch();
  };

  const [createWalletCard, { loading: createWalletCardLoading }] = useMutation<
    CreateWalletCardResponse,
    CreateWalletCardRequest
  >(CREATE_WALLET_CARD_MUTATION);
  const handleCreateWalletCard = async (walletCardCreated: boolean) => {
    await createWalletCard({ variables: { input: { applicationId, walletCardCreated } } });
    refetch();
  };

  const [reviewRequestInformation, { loading: reviewRequestInformationLoading }] = useMutation<
    ReviewRequestInformationResponse,
    ReviewRequestInformationRequest
  >(REVIEW_REQUEST_INFORMATION_MUTATION);
  const handleReviewRequestInformation = async (reviewRequestCompleted: boolean) => {
    await reviewRequestInformation({
      variables: { input: { applicationId, reviewRequestCompleted } },
    });
    refetch();
  };

  const [generateInvoice, { loading: generateInvoiceLoading }] =
    useMutation<GenerateInvoiceResponse, GenerateInvoiceRequest>(GENERATE_INVOICE_MUTATION);
  const handleGenerateInvoice = async (isDonation: boolean) => {
    await generateInvoice({ variables: { input: { applicationId, isDonation } } });
    refetch();
  };

  const [uploadDocuments, { loading: uploadDocumentsLoading }] =
    useMutation<UploadDocumentsResponse, UploadDocumentsRequest>(UPLOAD_DOCUMENTS_MUTATION);

  const [mailOut, { loading: mailOutLoading }] =
    useMutation<MailOutResponse, MailOutRequest>(MAIL_OUT_APP_MUTATION);
  const handleMailOut = async (appMailed: boolean) => {
    await mailOut({ variables: { input: { applicationId, appMailed } } });
    refetch();
  };

  const [refundPayment, { loading: refundPaymentLoading }] =
    useMutation<RefundPaymentResponse, RefundPaymentRequest>(REFUND_PAYMENT_MUTATION);
  const handleRefundPayment = async () => {
    await refundPayment({ variables: { input: { applicationId } } });
    refetch();
  };

  const toast = useToast();

  const handleSubmitDocuments = async (applicationDoc: File) => {
    let documentsS3ObjectKey;
    try {
      const { key } = await clientUploadToS3(applicationDoc, 'rcd/application-documents');
      documentsS3ObjectKey = key;
    } catch (err) {
      toast({
        status: 'error',
        description: `Failed to upload documents: ${err}`,
        isClosable: true,
      });
      return;
    }

    await uploadDocuments({
      variables: { input: { applicationId, documentsS3ObjectKey } },
    });
    refetch();
  };

  const handleUndoDocumentsUpload = async () => {
    await uploadDocuments({
      variables: { input: { applicationId, documentsS3ObjectKey: null } },
    });
    refetch();
  };

  /** Processing tasks header */
  const _header = useMemo(
    () => (
      <HStack width="100%" justify="space-between">
        <Text as="h5" textStyle="display-small-semibold">
          Processing Tasks
        </Text>
        <HStack align="flex-start">
          <Text as="p" textStyle="xsmall">
            Show task log
          </Text>
          <Switch isChecked={showTaskLog} onChange={e => setShowTaskLog(e.target.checked)} />
        </HStack>
      </HStack>
    ),
    [showTaskLog, setShowTaskLog]
  );

  if (!data?.application.processing) {
    return null;
  }

  const {
    application: {
      paidThroughShopify,
      shopifyConfirmationNumber,
      shopifyOrderNumber,
      donationAmount,
      secondDonationAmount,
      processing: {
        status,
        appNumber,
        appNumberEmployee,
        appNumberUpdatedAt,
        appHolepunched,
        appHolepunchedEmployee,
        appHolepunchedUpdatedAt,
        walletCardCreated,
        walletCardCreatedEmployee,
        walletCardCreatedUpdatedAt,
        invoice,
        documentsUrl,
        documentsUrlEmployee,
        documentsUrlUpdatedAt,
        appMailed,
        appMailedEmployee,
        appMailedUpdatedAt,
        reviewRequestCompleted,
        reviewRequestCompletedEmployee,
        reviewRequestCompletedUpdatedAt,
        paymentRefunded,
        paymentRefundedEmployee,
        paymentRefundedUpdatedAt,
      },
    },
  } = data;
  const shopifyOrderUrl = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/admin/orders/${shopifyConfirmationNumber}`;

  return (
    <PermitHolderInfoCard colSpan={7} header={_header}>
      <Divider mt="8px" />
      <VStack marginTop={5} spacing={10} alignItems="left" width="100%">
        {status === 'REJECTED' ? (
          // TODO: API Hookup
          <ProcessingTaskStep
            id={1}
            label="Refund customer"
            description={
              paidThroughShopify ? (
                <>
                  <Text as="p" textStyle="caption">
                    Refund through Shopify for online payments
                  </Text>
                  <Text as="p" textStyle="caption">
                    Paid with Shopify: Order{' '}
                    <Link
                      href={shopifyOrderUrl}
                      isExternal={true}
                      textStyle="caption-bold"
                      textDecoration="underline"
                      color="primary"
                    >
                      {`#${shopifyOrderNumber}`}
                    </Link>
                  </Text>
                </>
              ) : undefined
            }
            isCompleted={paymentRefunded}
            showLog={showTaskLog}
            log={
              showTaskLog && paymentRefundedEmployee
                ? {
                    name: formatFullName(
                      paymentRefundedEmployee.firstName,
                      paymentRefundedEmployee.lastName
                    ),
                    date: paymentRefundedUpdatedAt,
                  }
                : null
            }
          >
            {!paymentRefunded && (
              <Button
                marginLeft="auto"
                height="35px"
                bg="background.gray"
                _hover={{ bg: 'background.grayHover' }}
                color="black"
                onClick={handleRefundPayment}
                isDisabled={refundPaymentLoading}
                isLoading={refundPaymentLoading}
              >
                <Text textStyle="xsmall-medium">Mark as complete</Text>
              </Button>
            )}
          </ProcessingTaskStep>
        ) : (
          <>
            {/* Task 1: Assign new APP number: Assign number (MODAL) */}
            <ProcessingTaskStep
              id={1}
              label={`Assign new APP number${appNumber === null ? '' : `: ${appNumber}`}`}
              isCompleted={appNumber !== null}
              showLog={showTaskLog}
              log={
                showTaskLog && appNumberEmployee
                  ? {
                      name: formatFullName(appNumberEmployee.firstName, appNumberEmployee.lastName),
                      date: appNumberUpdatedAt,
                    }
                  : null
              }
            >
              {appNumber === null && !reviewRequestCompleted ? (
                <AssignNumberModal
                  modalTitle="Assign New APP Number"
                  fieldName="New APP number"
                  onAssign={handleAssignAppNumber}
                >
                  <Button
                    marginLeft="auto"
                    height="35px"
                    bg="background.gray"
                    _hover={{ bg: 'background.grayHover' }}
                    color="black"
                    isDisabled={assignAppNumberLoading}
                    isLoading={assignAppNumberLoading}
                    loadingText="Assign number"
                    fontWeight="normal"
                    fontSize="14px"
                  >
                    <Text textStyle="xsmall-medium">Assign number</Text>
                  </Button>
                </AssignNumberModal>
              ) : appNumber !== null && !reviewRequestCompleted ? (
                <Button
                  variant="ghost"
                  textDecoration="underline black"
                  onClick={() => handleAssignAppNumber(null)}
                  isDisabled={assignAppNumberLoading}
                  isLoading={assignAppNumberLoading}
                  loadingText="Undo"
                  fontWeight="normal"
                  fontSize="14px"
                >
                  <Text textStyle="caption" color="black">
                    Undo
                  </Text>
                </Button>
              ) : null}
            </ProcessingTaskStep>
            {/* Task 2: Hole punch parking permit: Mark as complete (CHECK) */}
            <ProcessingTaskStep
              id={2}
              label="Hole punch parking permit"
              description="Expiry Year and Month"
              isCompleted={appHolepunched}
              showLog={showTaskLog}
              log={
                showTaskLog && appHolepunchedEmployee
                  ? {
                      name: formatFullName(
                        appHolepunchedEmployee.firstName,
                        appHolepunchedEmployee.lastName
                      ),
                      date: appHolepunchedUpdatedAt,
                    }
                  : null
              }
            >
              {appHolepunched && !reviewRequestCompleted ? (
                <Button
                  variant="ghost"
                  textDecoration="underline black"
                  onClick={() => handleHolepunchParkingPermit(false)}
                  isDisabled={holepunchParkingPermitLoading}
                  isLoading={holepunchParkingPermitLoading}
                  loadingText="Undo"
                  fontWeight="normal"
                  fontSize="14px"
                >
                  <Text textStyle="caption" color="black">
                    Undo
                  </Text>
                </Button>
              ) : !appHolepunched && !reviewRequestCompleted ? (
                <Button
                  marginLeft="auto"
                  height="35px"
                  bg="background.gray"
                  _hover={{ bg: 'background.grayHover' }}
                  color="black"
                  onClick={() => handleHolepunchParkingPermit(true)}
                  isDisabled={holepunchParkingPermitLoading}
                  isLoading={holepunchParkingPermitLoading}
                  loadingText="Mark as complete"
                  fontWeight="normal"
                  fontSize="14px"
                >
                  <Text textStyle="xsmall-medium">Mark as complete</Text>
                </Button>
              ) : null}
            </ProcessingTaskStep>
            {/* Task 3: Review Information: Review Information (MODAL) */}
            <ProcessingTaskStep
              id={3}
              label={'Review request information'}
              description="Editing will be disabled upon completion of this step"
              isCompleted={reviewRequestCompleted}
              showLog={showTaskLog}
              log={
                showTaskLog && reviewRequestCompletedEmployee
                  ? {
                      name: formatFullName(
                        reviewRequestCompletedEmployee.firstName,
                        reviewRequestCompletedEmployee.lastName
                      ),
                      date: reviewRequestCompletedUpdatedAt,
                    }
                  : null
              }
            >
              <ReviewInformationStep
                isCompleted={reviewRequestCompleted}
                isDisabled={!appNumber || !appHolepunched}
                applicationId={applicationId}
                onConfirmed={() => handleReviewRequestInformation(true)}
                onUndo={() => {
                  handleReviewRequestInformation(false);
                }}
                loading={reviewRequestInformationLoading}
              />
            </ProcessingTaskStep>
            {/* Task 4: Generate Invoice */}
            <ProcessingTaskStep
              id={4}
              label={
                Number(donationAmount) + (Number(secondDonationAmount) || 0) >= 20
                  ? 'Generate invoice and donation receipt'
                  : 'Generate invoice'
              }
              description="Invoice number will be automatically assigned"
              isCompleted={invoice !== null}
              showLog={showTaskLog}
              log={
                showTaskLog && invoice
                  ? {
                      name: formatFullName(invoice.employee.firstName, invoice.employee.lastName),
                      date: invoice.updatedAt,
                    }
                  : null
              }
            >
              {invoice === null ? (
                <Button
                  marginLeft="auto"
                  height="35px"
                  bg="background.gray"
                  _hover={!reviewRequestCompleted ? undefined : { bg: 'background.grayHover' }}
                  color="black"
                  onClick={() => {
                    Number(donationAmount) + (Number(secondDonationAmount) || 0) >= 20
                      ? handleGenerateInvoice(true)
                      : handleGenerateInvoice(false);
                  }}
                  isDisabled={!reviewRequestCompleted || generateInvoiceLoading}
                  isLoading={generateInvoiceLoading}
                  loadingText="Generate document"
                  fontWeight="normal"
                  fontSize="14px"
                >
                  <Text textStyle="xsmall-medium">Generate document</Text>
                </Button>
              ) : (
                <Tooltip
                  hasArrow
                  closeOnClick={false}
                  label="Clicking on this link will open the document in a new tab"
                  placement="bottom"
                  bg="background.grayHover"
                  color="black"
                >
                  <Link
                    href={invoice.s3ObjectUrl as string}
                    isExternal={true}
                    textStyle="caption"
                    textDecoration="underline"
                    padding="0px 16px"
                    color="primary"
                  >
                    {/* File name from the object key e.g "rcd/invoice/invoice-1.pdf" */}
                    {invoice.s3ObjectKey && getFileName(invoice.s3ObjectKey)}
                  </Link>
                </Tooltip>
              )}
            </ProcessingTaskStep>
            {/* Task 5: Upload document: Choose document (UPLOAD FILE) */}
            <ProcessingTaskStep
              id={5}
              label="Upload documents"
              description="Scan all documents and upload as one PDF"
              isCompleted={documentsUrl !== null}
              showLog={showTaskLog}
              log={
                showTaskLog && documentsUrlEmployee
                  ? {
                      name: formatFullName(
                        documentsUrlEmployee.firstName,
                        documentsUrlEmployee.lastName
                      ),
                      date: documentsUrlUpdatedAt,
                    }
                  : null
              }
            >
              <TaskCardUploadStep
                isDisabled={invoice === null || uploadDocumentsLoading}
                fileUrl={documentsUrl}
                onUploadFile={handleSubmitDocuments}
                onUndo={handleUndoDocumentsUpload}
                loading={uploadDocumentsLoading}
              />
            </ProcessingTaskStep>
            {/* Task 6: Create a new wallet card: Mark as complete (CHECK) */}
            <ProcessingTaskStep
              id={6}
              label="Create a new wallet card"
              description="Include permit number, expiry date, full name and birth month"
              isCompleted={walletCardCreated}
              showLog={showTaskLog}
              log={
                showTaskLog && walletCardCreatedEmployee
                  ? {
                      name: formatFullName(
                        walletCardCreatedEmployee.firstName,
                        walletCardCreatedEmployee.lastName
                      ),
                      date: walletCardCreatedUpdatedAt,
                    }
                  : null
              }
            >
              {walletCardCreated ? (
                <Button
                  variant="ghost"
                  textDecoration="underline black"
                  onClick={() => handleCreateWalletCard(false)}
                  isDisabled={createWalletCardLoading}
                  isLoading={createWalletCardLoading}
                  loadingText="Undo"
                  fontWeight="normal"
                  fontSize="14px"
                >
                  <Text textStyle="caption" color="black">
                    Undo
                  </Text>
                </Button>
              ) : (
                <Button
                  marginLeft="auto"
                  height="35px"
                  bg="background.gray"
                  _hover={documentsUrl === null ? undefined : { bg: 'background.grayHover' }}
                  color="black"
                  onClick={() => handleCreateWalletCard(true)}
                  isDisabled={documentsUrl === null || createWalletCardLoading}
                  isLoading={createWalletCardLoading}
                  loadingText="Mark as complete"
                  fontWeight="normal"
                  fontSize="14px"
                >
                  <Text textStyle="xsmall-medium">Mark as complete</Text>
                </Button>
              )}
            </ProcessingTaskStep>
            {/* Task 7: Mail out: Mark as complete (CHECK) */}
            <ProcessingTaskStep
              id={7}
              label="Mail out"
              description="Include returning envelope and previous permit number"
              isCompleted={appMailed}
              showLog={showTaskLog}
              log={
                showTaskLog && appMailedEmployee
                  ? {
                      name: formatFullName(appMailedEmployee.firstName, appMailedEmployee.lastName),
                      date: appMailedUpdatedAt,
                    }
                  : null
              }
            >
              {appMailed ? (
                <Button
                  variant="ghost"
                  textDecoration="underline black"
                  onClick={() => handleMailOut(false)}
                  isDisabled={mailOutLoading}
                  isLoading={mailOutLoading}
                  loadingText="Undo"
                  fontWeight="normal"
                  fontSize="14px"
                >
                  <Text textStyle="caption" color="black">
                    Undo
                  </Text>
                </Button>
              ) : (
                <Button
                  marginLeft="auto"
                  height="35px"
                  bg="background.gray"
                  _hover={!walletCardCreated ? undefined : { bg: 'background.grayHover' }}
                  color="black"
                  onClick={() => handleMailOut(true)}
                  isDisabled={!walletCardCreated || mailOutLoading}
                  isLoading={mailOutLoading}
                  loadingText="Mark as complete"
                  fontWeight="normal"
                  fontSize="14px"
                >
                  <Text textStyle="xsmall-medium">Mark as complete</Text>
                </Button>
              )}
            </ProcessingTaskStep>
          </>
        )}
      </VStack>
    </PermitHolderInfoCard>
  );
}
