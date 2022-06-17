import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/react'; // Chakra UI

/**
 * Alert box containing message that user has not fully completed a section of the renewal form
 */
export default function IncompleteSectionAlert() {
  return (
    <Alert status="error" marginBottom="24px">
      <AlertIcon />
      <AlertTitle textAlign="left">
        {`Please fill this section of the form before continuing to the next section.`}
      </AlertTitle>
    </Alert>
  );
}
