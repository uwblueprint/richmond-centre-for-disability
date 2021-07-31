import { Divider, VStack, Button, Text } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/internal/PermitHolderInfoCard'; // Custom Card Component
import AssignNumberModal from '@components/requests/modals/AssignNumberModal'; // AssignNumber Modal component
import ProcessingTaskStep from '@components/requests/ProcessingTaskStep'; // Processing Task Step
import { ApplicationStatus } from '@lib/types'; // Types

interface ApplicationProcessingData {
  id: number;
  status: ApplicationStatus;
  appNumber: number;
  appHolepunched: boolean;
  walletCardCreated: boolean;
  invoiceNumber: number;
  documentUrls: string[];
  appMailed: boolean;
  updatedAt: Date;
}

type ProcessingTasksCardProps = {
  readonly applicationProcessingData: ApplicationProcessingData;
  readonly onTaskComplete: (taskId: number, taskArgs?: number | string) => void;
  readonly APPNumber?: number;
  readonly invoiceNumber?: number;
};

export default function ProcessingTasksCard({
  applicationProcessingData,
  onTaskComplete,
  APPNumber,
  invoiceNumber,
}: ProcessingTasksCardProps) {
  const assignAPPNumber = (APPNumber: number) => {
    onTaskComplete(1, APPNumber);
  };

  const assignInvoiceNumber = (invoiceNumber: number) => {
    onTaskComplete(4, invoiceNumber);
  };

  /**
   * Returns a boolean indicating whether the current task is completed, using applicationProcessingData props
   * @param taskId - Step number (1-indexed)
   * @returns Boolean
   */
  const isTaskCompleted = (taskId: number) => {
    switch (taskId) {
      case 1:
        if (!isNaN(applicationProcessingData.appNumber)) {
          return true;
        }
        break;
      case 2:
        if (applicationProcessingData.appHolepunched) {
          return true;
        }
        break;
      case 3:
        if (applicationProcessingData.walletCardCreated) {
          return true;
        }
        break;
      case 4:
        if (!isNaN(applicationProcessingData.invoiceNumber)) {
          return true;
        }
        break;
      case 5:
        if (applicationProcessingData.documentUrls?.length) {
          return true;
        }
        break;
      case 6:
        if (applicationProcessingData.appMailed) {
          return true;
        }
        break;
    }
    return false;
  };

  const steps = [
    // Task 1: Assign new APP number: Assign number (MODAL)
    {
      label: 'Assign new APP number' + (APPNumber === undefined ? '' : `: ${APPNumber}`),
    },
    // Task 2: Hole punch parking permit: Mark as complete (CHECK)
    {
      label: 'Hole punch parking permit',
      description: 'Gender, Year and Month',
    },
    // Task 3: Create a new wallet card: Mark as complete (CHECK)
    {
      label: 'Create a new wallet card',
      description: 'Include permit number, expiry date, full name, and birth month',
    },
    // Task 4: Assign invoice number: Assign number (MODAL)
    {
      label: 'Assign invoice number' + (invoiceNumber === undefined ? '' : `: ${invoiceNumber}`),
    },
    // Task 5: Upload document: Choose document (UPLOAD FILE)
    {
      label: 'Upload document',
      description: 'Scan all documents and upload as PDF (5MB limit)',
    },
    // Task 6: Mail out: Mark as complete (CHECK)
    {
      label: 'Mail out',
      description: 'Include returning envelope and previous permit number',
    },
  ];

  /**
   * Returns a button that undos the action taken to complete the step with ID == taskID
   * @param taskId - Step number (1-indexed)
   * @returns Undo button.
   */
  const _renderUndoButton = (taskId: number) => {
    return (
      <Button
        variant="ghost"
        textDecoration="underline black"
        onClick={() => onTaskComplete(taskId)}
      >
        <Text textStyle="caption" color="black">
          Undo
        </Text>
      </Button>
    );
  };

  /**
   * Returns the appropriate button to be displayed depending on the current step
   * @param taskId - Step number (1-indexed)
   * @param isCompleted - Whether the task has been completed or not
   * @returns Edit/Undo/Action button.
   */
  const _renderTaskAction = (taskId: number, isCompleted: boolean) => {
    switch (taskId) {
      case 1:
        return (
          <AssignNumberModal
            modalTitle="Assign New APP Number"
            fieldName="New APP number"
            onAssign={assignAPPNumber}
          >
            {APPNumber === undefined ? (
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
        );
      case 4:
        return (
          <AssignNumberModal
            modalTitle="Assign Invoice Number"
            fieldName="Invoice number"
            onAssign={assignInvoiceNumber}
          >
            {invoiceNumber === undefined ? (
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
        );
      case 5: // TODO: Add file upload
        return (
          <Button
            marginLeft="auto"
            height="35px"
            bg="background.gray"
            _hover={{ bg: 'background.grayHover' }}
            color="black"
            onClick={() => onTaskComplete(taskId)}
          >
            <Text textStyle="xsmall-medium">Choose document</Text>
          </Button>
        );

      case 2:
      case 3:
      case 6:
        return isCompleted ? (
          _renderUndoButton(taskId)
        ) : (
          <Button
            marginLeft="auto"
            height="35px"
            bg="background.gray"
            _hover={{ bg: 'background.grayHover' }}
            color="black"
            onClick={() => onTaskComplete(taskId)}
          >
            <Text textStyle="xsmall-medium">Mark as complete</Text>
          </Button>
        );
    }
  };

  return (
    <PermitHolderInfoCard colSpan={7} header={`Processing Tasks`}>
      <Divider pt="20px" />
      <VStack marginTop={5} spacing={10} alignItems="left" width="100%">
        {steps.map(({ label, description }, idx) => {
          const isCompleted = isTaskCompleted(idx + 1);
          return (
            <ProcessingTaskStep
              label={label}
              description={description}
              isCompleted={isCompleted}
              key={idx}
              id={idx + 1}
            >
              {_renderTaskAction(idx + 1, isCompleted)}
            </ProcessingTaskStep>
          );
        })}
      </VStack>
    </PermitHolderInfoCard>
  );
}
