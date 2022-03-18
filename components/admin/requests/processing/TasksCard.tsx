import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { Divider, VStack, Button, Text } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card Component
import AssignNumberModal from '@components/admin/requests/processing/AssignNumberModal'; // AssignNumber Modal component
import ProcessingTaskStep from '@components/admin/requests/processing/TaskStep'; // Processing Task Step
import {
  AssignAppNumberRequest,
  AssignAppNumberResponse,
  // AssignInvoiceNumberRequest,
  // AssignInvoiceNumberResponse,
  ASSIGN_APP_NUMBER_MUTATION,
  // ASSIGN_INVOICE_NUMBER_MUTATION,
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
  // UploadDocumentsRequest,
  // UploadDocumentsResponse,
  // UPLOAD_DOCUMENTS_MUTATION,
} from '@tools/admin/requests/processing-tasks-card';

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

  // const [assignInvoiceNumber] = useMutation<
  //   AssignInvoiceNumberResponse,
  //   AssignInvoiceNumberRequest
  // >(ASSIGN_INVOICE_NUMBER_MUTATION);
  // const handleAssignInvoiceNumber = async (invoiceNumber: number) => {
  //   await assignInvoiceNumber({ variables: { input: { applicationId, invoiceNumber } } });
  //   refetch();
  // };

  // const [uploadDocuments] =
  //   useMutation<UploadDocumentsResponse, UploadDocumentsRequest>(UPLOAD_DOCUMENTS_MUTATION);
  // const handleUploadDocuments = async (documentsUrl: string) => {
  //   await uploadDocuments({ variables: { input: { applicationId, documentsUrl } } });
  //   refetch();
  // };

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
        // invoiceNumber,
        // documentsUrl,
        appMailed,
      },
    },
  } = data;

  const [reviewRequestTask, setReviewRequestTask] = useState(false);
  const [documentUploadTask, setDocumentUploadTask] = useState(false);
  const [generateInvoiceTask, setGenerateInvoiceTask] = useState(false);
  // const [preliminaryTasks, setPreliminaryTasks] = useState(false);
  // useEffect(() => {
  //   appNumber !== null && appHolepunched && walletCardCreated
  //     ? setPreliminaryTasks(true)
  //     : setPreliminaryTasks(false);
  // }, [appNumber, appHolepunched, walletCardCreated]);

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
            {appNumber === null && !reviewRequestTask ? (
              <Button
                marginLeft="auto"
                height="35px"
                bg="background.gray"
                _hover={{ bg: 'background.grayHover' }}
                color="black"
              >
                <Text textStyle="xsmall-medium">Assign number</Text>
              </Button>
            ) : appNumber !== null && !reviewRequestTask ? (
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
          {appHolepunched && !reviewRequestTask ? (
            <Button
              variant="ghost"
              textDecoration="underline black"
              onClick={() => handleHolepunchParkingPermit(false)}
            >
              <Text textStyle="caption" color="black">
                Undo
              </Text>
            </Button>
          ) : !appHolepunched && !reviewRequestTask ? (
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
          {walletCardCreated && !reviewRequestTask ? (
            <Button
              variant="ghost"
              textDecoration="underline black"
              onClick={() => handleCreateWalletCard(false)}
            >
              <Text textStyle="caption" color="black">
                Undo
              </Text>
            </Button>
          ) : !walletCardCreated && !reviewRequestTask ? (
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
        {/* Task 4: Assign invoice number: Assign number (MODAL) */}
        <ProcessingTaskStep
          id={4}
          label={'Review request information'}
          description="Editing will be disabled upon completion of this step"
          isCompleted={reviewRequestTask}
        >
          {/* TODO: Change to review information modal */}
          {/* <AssignNumberModal
            modalTitle="Review Information"
            fieldName="Invoice number"
            onAssign={handleAssignInvoiceNumber}
          > */}
          {!reviewRequestTask ? (
            <Button
              marginLeft="auto"
              height="35px"
              bg="background.gray"
              _hover={{ bg: 'background.grayHover' }}
              color="black"
              disabled={!appNumber || !appHolepunched || !walletCardCreated}
              onClick={() => setReviewRequestTask(true)}
            >
              <Text textStyle="xsmall-medium">Review information</Text>
            </Button>
          ) : (
            <Button
              variant="ghost"
              textDecoration="underline black"
              onClick={() => {
                // if (documentUploadTask) {

                // }
                // if (generateInvoiceTask) {

                // }
                setDocumentUploadTask(false);
                setGenerateInvoiceTask(false);
                handleMailOut(false);
                setReviewRequestTask(false);
              }}
            >
              <Text textStyle="caption" color="black">
                Undo Review
              </Text>
            </Button>
          )}
          {/* </AssignNumberModal> */}
        </ProcessingTaskStep>
        {/* Task 5: Generate Invoice */}
        <ProcessingTaskStep
          id={5}
          label="Generate Invoice"
          description="Invoice number will be automatically assigned"
          isCompleted={generateInvoiceTask && reviewRequestTask}
          // isCompleted={!!documentsUrl}
        >
          {generateInvoiceTask && reviewRequestTask ? (
            <Button
              variant="ghost"
              textDecoration="underline black"
              onClick={() => setGenerateInvoiceTask(false)}
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
              disabled={!reviewRequestTask}
              // TODO: Add document uploading functionality
              onClick={() => setGenerateInvoiceTask(true)}
              // onClick={() => handleUploadDocuments('placeholder url')}
            >
              <Text textStyle="xsmall-medium">Generate document</Text>
            </Button>
          )}
        </ProcessingTaskStep>

        {/* Task 6: Upload document: Choose document (UPLOAD FILE) */}
        <ProcessingTaskStep
          id={6}
          label="Upload document"
          description="Scan all documents and upload as PDF (5MB limit)"
          isCompleted={documentUploadTask && reviewRequestTask}
          // isCompleted={!!documentsUrl}
        >
          {documentUploadTask && reviewRequestTask ? (
            <Button
              variant="ghost"
              textDecoration="underline black"
              onClick={() => setDocumentUploadTask(false)}
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
              disabled={!generateInvoiceTask}
              // TODO: Add document uploading functionality
              onClick={() => setDocumentUploadTask(true)}
              // onClick={() => handleUploadDocuments('placeholder url')}
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
              disabled={!documentUploadTask}
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
