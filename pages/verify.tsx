import { Container, Heading } from '@chakra-ui/react'; // Chakra UI

import Layout from '@components/Layout'; // Layout component
import useLocalStorage from '@tools/hooks/useLocalStorage'; // Local storage hook

export default function Verify() {
  const [localStorageEmail] = useLocalStorage('rcd-email-redirect', '');

  return (
    <Layout>
      <Container>
        <Heading as="h3">
          {`Confirmation email has been sent to ${localStorageEmail}! 
            Please click the link in your inbox to log in.`}
        </Heading>
      </Container>
    </Layout>
  );
}