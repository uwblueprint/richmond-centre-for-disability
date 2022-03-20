import { useQuery, useMutation } from '@apollo/client';
import { Divider, VStack, Button, Text } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card Component
import AssignNumberModal from '@components/admin/requests/processing/AssignNumberModal'; // AssignNumber Modal component
import ProcessingTaskStep from '@components/admin/requests/processing/TaskStep'; // Processing Task Step
import {
  AssignAppNumberRequest,
  AssignAppNumberResponse,
<<<<<<< HEAD
  ASSIGN_APP_NUMBER_MUTATION,
=======
  GenerateInvoiceRequest,
  GenerateInvoiceResponse,
  ASSIGN_APP_NUMBER_MUTATION,
  GENERATE_INVOICE_MUTATION,
>>>>>>> Install PDFMake dependency, generate PDF with dynamic values, update GraphQL API
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
  AssignInvoiceNumberResponse,
  AssignInvoiceNumberRequest,
  ASSIGN_INVOICE_NUMBER_MUTATION,
  UploadDocumentsResponse,
  UploadDocumentsRequest,
  UPLOAD_DOCUMENTS_MUTATION,
} from '@tools/admin/requests/processing-tasks-card';
import ReviewInformationStep from '@components/admin/requests/processing/ReviewInformationStep';

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

<<<<<<< HEAD
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

  // TODO: Update with invoice generation
  const [assignInvoiceNumber] = useMutation<
    AssignInvoiceNumberResponse,
    AssignInvoiceNumberRequest
  >(ASSIGN_INVOICE_NUMBER_MUTATION);
  const handleAssignInvoiceNumber = async (invoiceNumber: number) => {
=======
  const [generateInvoice] =
    useMutation<GenerateInvoiceResponse, GenerateInvoiceRequest>(GENERATE_INVOICE_MUTATION);
  const handleGenerateInvoice = async (invoiceNumber: number) => {
>>>>>>> Install PDFMake dependency, generate PDF with dynamic values, update GraphQL API
    // TODO: we need to generate the invoice first before assigning.
    // Ideally we call an endpoint to generate it and then pass the returned invoice number
    await generateInvoice({ variables: { input: { applicationId, invoiceNumber } } });
    refetch();
  };

  // TODO: Hook up to S3 upload
  const [uploadDocuments] =
    useMutation<UploadDocumentsResponse, UploadDocumentsRequest>(UPLOAD_DOCUMENTS_MUTATION);
  const handleUploadDocuments = async (documentsUrl: string) => {
    await uploadDocuments({ variables: { input: { applicationId, documentsUrl } } });
    refetch();
  };

  const [mailOut] = useMutation<MailOutResponse, MailOutRequest>(MAIL_OUT_APP_MUTATION);
  const handleMailOut = async (appMailed: boolean) => {
    await mailOut({ variables: { input: { applicationId, appMailed } } });
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
        invoiceNumber,
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
              handleMailOut(false);
              handleReviewRequestInformation(false);
            }}
          />
        </ProcessingTaskStep>

        {/* Task 5: Generate Invoice */}
        <ProcessingTaskStep
          id={5}
          label="Generate Invoice"
          description="Invoice number will be automatically assigned"
          isCompleted={invoiceNumber !== null}
        >
<<<<<<< HEAD
          {invoiceNumber !== null ? (
            <Button
              color={'blue'}
              variant="ghost"
              textDecoration="underline black"
              // TODO: Integrate with invoice generation
              onClick={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
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
              _hover={{ bg: 'background.grayHover' }}
              color="black"
              disabled={!reviewRequestCompleted}
              // TODO: Integrate with invoice generation
              onClick={() => handleAssignInvoiceNumber(12345)} // eslint-disable-line @typescript-eslint/no-empty-function
            >
              <Text textStyle="xsmall-medium">Generate document</Text>
            </Button>
          )}
=======
          <AssignNumberModal
            modalTitle="Assign Invoice Number"
            fieldName="Invoice number"
            onAssign={handleGenerateInvoice}
          >
            {invoiceNumber === null ? (
              <Button
                marginLeft="auto"
                height="35px"
                bg="background.gray"
                _hover={{ bg: 'background.grayHover' }}
                color="black"
              >
                <Text textStyle="xsmall-medium">Assign number</Text>
              </Button>
            ) : (
              <Button variant="ghost" textDecoration="underline black">
                <Text textStyle="caption" color="black">
                  Edit number
                </Text>
              </Button>
            )}
          </AssignNumberModal>
>>>>>>> Install PDFMake dependency, generate PDF with dynamic values, update GraphQL API
        </ProcessingTaskStep>

        {/* Task 6: Upload document: Choose document (UPLOAD FILE) */}
        <ProcessingTaskStep
          id={6}
          label="Upload document"
          description="Scan all documents and upload as one PDF"
          isCompleted={documentsUrl !== null}
        >
          {documentsUrl !== null && reviewRequestCompleted ? (
            <Button
              variant="ghost"
              textDecoration="underline black"
              // TODO: Integrate with document upload
              onClick={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
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
              _hover={{ bg: 'background.grayHover' }}
              color="black"
              disabled={invoiceNumber === null}
              // TODO: Add generate invoice functionality
              onClick={() => handleUploadDocuments('placeholder url')}
            >
              <Text textStyle="xsmall-medium">Choose document</Text>
            </Button>
          )}
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
              _hover={{ bg: 'background.grayHover' }}
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
