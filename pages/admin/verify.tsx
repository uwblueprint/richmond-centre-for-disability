import { Center, Text } from '@chakra-ui/react'; // Chakra UI
import useLocalStorage from '@tools/hooks/useLocalStorage'; // Local storage hook

export default function Verify() {
  const [localStorageEmail] = useLocalStorage('rcd-email-redirect', '');

  return (
    <Center height="100vh" width="100vw">
      <Text textStyle="heading">
        {`Confirmation email has been sent to ${localStorageEmail}!
            Please click the link in your inbox to log in.`}
      </Text>
    </Center>
  );
}
