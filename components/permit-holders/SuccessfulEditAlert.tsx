import { Alert, AlertDescription, AlertIcon } from '@chakra-ui/react'; // Chakra UI
import { ReactNode } from 'react'; // React

type SuccessfulEditAlertProps = {
  children: ReactNode;
};

/**
 * Alert box containing message that user has successfully edited
 */
export default function SuccessfulEditAlert({ children }: SuccessfulEditAlertProps) {
  return (
    <Alert variant="solid" status="success">
      <AlertIcon color="alerticon.success" />
      <AlertDescription textStyle="caption">{children}</AlertDescription>
      {/* TODO: Make alert closeable */}
      {/* <CloseButton /> */}
    </Alert>
  );
}
