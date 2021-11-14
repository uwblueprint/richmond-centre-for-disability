import { Divider, VStack, Button, Text } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/PermitHolderInfoCard'; // Custom Card Component
import AssignNumberModal from '@components/admin/requests/modals/AssignNumberModal'; // AssignNumber Modal component
import ProcessingTaskStep from '@components/admin/requests/ProcessingTaskStep'; // Processing Task Step
import { ApplicationProcessing } from '@lib/graphql/types'; // Types

type ProcessingTasksCardProps = {
  readonly applicationProcessing: Pick<
    ApplicationProcessing,
    | 'appNumber'
    | 'appHolepunched'
    | 'walletCardCreated'
    | 'invoiceNumber'
    | 'documentUrls'
    | 'appMailed'
  >;
  readonly onTaskUpdate: (args: Record<string, any>) => void;
};

/**
 * Card containing task processing in View Request page (after approval)
 * @param applicationProcessing Application processing data
 * @param onTaskUpdate Callback function for handling task update
 */
export default function ProcessingTasksCard({
  applicationProcessing,
  onTaskUpdate,
}: ProcessingTasksCardProps) {
  const { appNumber, appHolepunched, walletCardCreated, invoiceNumber, documentUrls, appMailed } =
    applicationProcessing;

  return (
    <PermitHolderInfoCard colSpan={7} header={`Processing Tasks`}>
      <Divider pt="20px" />
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
            onAssign={updatedAppNumber => onTaskUpdate({ appNumber: updatedAppNumber })}
          >
            {appNumber === null ? (
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
        </ProcessingTaskStep>
        {/* Task 2: Hole punch parking permit: Mark as complete (CHECK) */}
        <ProcessingTaskStep
          id={2}
          label="Hole punch parking permit"
          description="Gender, Year and Month"
          isCompleted={appHolepunched}
        >
          {appHolepunched ? (
            <Button
              variant="ghost"
              textDecoration="underline black"
              onClick={() => onTaskUpdate({ appHolepunched: false })}
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
              onClick={() => onTaskUpdate({ appHolepunched: true })}
            >
              <Text textStyle="xsmall-medium">Mark as complete</Text>
            </Button>
          )}
        </ProcessingTaskStep>
        {/* Task 3: Create a new wallet card: Mark as complete (CHECK) */}
        <ProcessingTaskStep
          id={3}
          label="Create a new wallet card"
          description="Include permit number, expiry date, full name, and birth month"
          isCompleted={walletCardCreated}
        >
          {walletCardCreated ? (
            <Button
              variant="ghost"
              textDecoration="underline black"
              onClick={() => onTaskUpdate({ walletCardCreated: false })}
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
              onClick={() => onTaskUpdate({ walletCardCreated: true })}
            >
              <Text textStyle="xsmall-medium">Mark as complete</Text>
            </Button>
          )}
        </ProcessingTaskStep>
        {/* Task 4: Assign invoice number: Assign number (MODAL) */}
        <ProcessingTaskStep
          id={4}
          label={`Assign invoice number${invoiceNumber === null ? '' : `: ${invoiceNumber}`}`}
          description="Include permit number, expiry date, full name, and birth month"
          isCompleted={invoiceNumber !== null}
        >
          <AssignNumberModal
            modalTitle="Assign Invoice Number"
            fieldName="Invoice number"
            onAssign={updatedInvoiceNumber => onTaskUpdate({ invoiceNumber: updatedInvoiceNumber })}
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
        </ProcessingTaskStep>
        {/* Task 5: Upload document: Choose document (UPLOAD FILE) */}
        <ProcessingTaskStep
          id={5}
          label="Upload document"
          description="Scan all documents and upload as PDF (5MB limit)"
          isCompleted={!!documentUrls && documentUrls.length > 0}
        >
          <Button
            marginLeft="auto"
            height="35px"
            bg="background.gray"
            _hover={{ bg: 'background.grayHover' }}
            color="black"
            // TODO: Add document uploading functionality
            onClick={() => onTaskUpdate({ documentUrl: 'documentUrl' })}
          >
            <Text textStyle="xsmall-medium">Choose document</Text>
          </Button>
        </ProcessingTaskStep>
        {/* Task 6: Mail out: Mark as complete (CHECK) */}
        <ProcessingTaskStep
          id={6}
          label="Mail out"
          description="Include returning envelope and previous permit number"
          isCompleted={appMailed}
        >
          {appMailed ? (
            <Button
              variant="ghost"
              textDecoration="underline black"
              onClick={() => onTaskUpdate({ appMailed: false })}
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
              onClick={() => onTaskUpdate({ appMailed: true })}
            >
              <Text textStyle="xsmall-medium">Mark as complete</Text>
            </Button>
          )}
        </ProcessingTaskStep>
      </VStack>
    </PermitHolderInfoCard>
  );
}
