import { useQuery, useMutation } from '@apollo/client';
import { Divider, VStack, Button, Text, useToast, Link, Tooltip } from '@chakra-ui/react'; // Chakra UI
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
} from '@tools/admin/requests/processing-tasks-card';
import ReviewInformationStep from '@components/admin/requests/processing/ReviewInformationStep';
import { clientUploadToS3 } from '@lib/utils/s3-utils';
import TaskCardUploadStep from '@components/admin/requests/processing/TaskCardUploadStep';

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

  const [assignAppNumber] = useMutation<AssignAppNumberResponse, AssignAppNumberRequest>(
    ASSIGN_APP_NUMBER_MUTATION
  );
  const handleAssignAppNumber = async (appNumber: number) => {
    await assignAppNumber({ variables: { input: { applicationId, appNumber } } });
    refetch();
  };

  const [holepunchParkingPermit] =
    useMutation<HolepunchParkingPermitResponse, HolepunchParkingPermitRequest>(
      HOLEPUNCH_APP_MUTATION
    );
  const handleHolepunchParkingPermit = async (appHolepunched: boolean) => {
    await holepunchParkingPermit({ variables: { input: { applicationId, appHolepunched } } });
    refetch();
  };

  const [createWalletCard] = useMutation<CreateWalletCardResponse, CreateWalletCardRequest>(
    CREATE_WALLET_CARD_MUTATION
  );
  const handleCreateWalletCard = async (walletCardCreated: boolean) => {
    await createWalletCard({ variables: { input: { applicationId, walletCardCreated } } });
    refetch();
  };

  const [reviewRequestInformation] = useMutation<
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
  const handleGenerateInvoice = async () => {
    await generateInvoice({ variables: { input: { applicationId } } });
    refetch();
  };

  const [uploadDocuments] =
    useMutation<UploadDocumentsResponse, UploadDocumentsRequest>(UPLOAD_DOCUMENTS_MUTATION);

  const [mailOut] = useMutation<MailOutResponse, MailOutRequest>(MAIL_OUT_APP_MUTATION);
  const handleMailOut = async (appMailed: boolean) => {
    await mailOut({ variables: { input: { applicationId, appMailed } } });
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

  if (!data?.application.processing) {
    return null;
  }

  const {
    application: {
      processing: {
        appNumber,
        appHolepunched,
        walletCardCreated,
        invoice,
        documentsUrl,
        appMailed,
        reviewRequestCompleted,
      },
    },
  } = data;

  return (
    <PermitHolderInfoCard colSpan={7} header={`Processing Tasks`}>
      <Divider mt="20px" />
      <VStack marginTop={5} spacing={10} alignItems="left" width="100%">
        {/* Task 1: Assign new APP number: Assign number (MODAL) */}
        <ProcessingTaskStep
          id={1}
          label={`Assign new APP number${appNumber === null ? '' : `: ${appNumber}`}`}
          isCompleted={appNumber !== null}
        >
          <AssignNumberModal
            modalTitle="Assign New APP Number"
            fieldName="New APP number"
            onAssign={handleAssignAppNumber}
          >
            {appNumber === null && !reviewRequestCompleted ? (
              <Button
                marginLeft="auto"
                height="35px"
                bg="background.gray"
                _hover={{ bg: 'background.grayHover' }}
                color="black"
              >
                <Text textStyle="xsmall-medium">Assign number</Text>
              </Button>
            ) : appNumber !== null && !reviewRequestCompleted ? (
              <Button variant="ghost" textDecoration="underline black">
                <Text textStyle="caption" color="black">
                  Edit number
                </Text>
              </Button>
            ) : null}
          </AssignNumberModal>
        </ProcessingTaskStep>

        {/* Task 2: Hole punch parking permit: Mark as complete (CHECK) */}
        <ProcessingTaskStep
          id={2}
          label="Hole punch parking permit"
          description="Gender, Year and Month"
          isCompleted={appHolepunched}
        >
          {appHolepunched && !reviewRequestCompleted ? (
            <Button
              variant="ghost"
              textDecoration="underline black"
              onClick={() => handleHolepunchParkingPermit(false)}
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
            >
              <Text textStyle="xsmall-medium">Mark as complete</Text>
            </Button>
          ) : null}
        </ProcessingTaskStep>

        {/* Task 3: Create a new wallet card: Mark as complete (CHECK) */}
        <ProcessingTaskStep
          id={3}
          label="Create a new wallet card"
          description="Include permit number, expiry date, full name, and birth month"
          isCompleted={walletCardCreated}
        >
          {walletCardCreated && !reviewRequestCompleted ? (
            <Button
              variant="ghost"
              textDecoration="underline black"
              onClick={() => handleCreateWalletCard(false)}
            >
              <Text textStyle="caption" color="black">
                Undo
              </Text>
            </Button>
          ) : !walletCardCreated && !reviewRequestCompleted ? (
            <Button
              marginLeft="auto"
              height="35px"
              bg="background.gray"
              _hover={{ bg: 'background.grayHover' }}
              color="black"
              onClick={() => handleCreateWalletCard(true)}
            >
              <Text textStyle="xsmall-medium">Mark as complete</Text>
            </Button>
          ) : null}
        </ProcessingTaskStep>

        {/* Task 4: Review Information: Review Information (MODAL) */}
        <ProcessingTaskStep
          id={4}
          label={'Review request information'}
          description="Editing will be disabled upon completion of this step"
          isCompleted={reviewRequestCompleted}
        >
          <ReviewInformationStep
            isCompleted={reviewRequestCompleted}
            isDisabled={!appNumber || !appHolepunched || !walletCardCreated}
            applicationId={applicationId}
            onConfirmed={() => handleReviewRequestInformation(true)}
            onUndo={() => {
              handleReviewRequestInformation(false);
            }}
          />
        </ProcessingTaskStep>

        {/* Task 5: Generate Invoice */}
        <ProcessingTaskStep
          id={5}
          label="Generate Invoice"
          description="Invoice number will be automatically assigned"
          isCompleted={invoice !== null}
        >
          {invoice === null ? (
            <Button
              marginLeft="auto"
              height="35px"
              bg="background.gray"
              _hover={!reviewRequestCompleted ? undefined : { bg: 'background.grayHover' }}
              disabled={!reviewRequestCompleted || generateInvoiceLoading}
              color="black"
              onClick={handleGenerateInvoice}
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
                {invoice.s3ObjectKey?.split('/').at(-1)}
              </Link>
            </Tooltip>
          )}
        </ProcessingTaskStep>

        {/* Task 6: Upload document: Choose document (UPLOAD FILE) */}
        <ProcessingTaskStep
          id={6}
          label="Upload document"
          description="Scan all documents and upload as one PDF"
          isCompleted={documentsUrl !== null}
        >
          <TaskCardUploadStep
            isDisabled={invoice === null}
            file={documentsUrl}
            onUploadFile={handleSubmitDocuments}
            onUndo={handleUndoDocumentsUpload}
          />
        </ProcessingTaskStep>

        {/* Task 7: Mail out: Mark as complete (CHECK) */}
        <ProcessingTaskStep
          id={7}
          label="Mail out"
          description="Include returning envelope and previous permit number"
          isCompleted={appMailed}
        >
          {appMailed ? (
            <Button
              variant="ghost"
              textDecoration="underline black"
              onClick={() => handleMailOut(false)}
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
              disabled={documentsUrl === null}
              onClick={() => handleMailOut(true)}
            >
              <Text textStyle="xsmall-medium">Mark as complete</Text>
            </Button>
          )}
        </ProcessingTaskStep>
      </VStack>
    </PermitHolderInfoCard>
  );
}
