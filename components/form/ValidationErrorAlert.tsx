import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/react';

type ValidationErrorAlertProps = {
  readonly error?: string;
};

export default function ValidationErrorAlert({ error }: ValidationErrorAlertProps) {
  return (
    <>
      {error && (
        <Alert status="error" mt="12px" pt="20px" pb="20px">
          <AlertIcon />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}
    </>
  );
}
