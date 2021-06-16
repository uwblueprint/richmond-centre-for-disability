import { useState, KeyboardEvent } from 'react'; // React
import { GetServerSideProps } from 'next'; // Get server side props
import { getSession, signIn } from 'next-auth/client'; // Session management
import { FormControl, FormLabel, Input, Button, Container, FormHelperText } from '@chakra-ui/react'; // Chakra UI

import Layout from '@components/Layout'; // Layout wrapper
import useLocalStorage from '@tools/hooks/useLocalStorage'; // Local storage

export default function Login() {
  const [email, setEmail] = useState(''); // Email input

  // Store email in local storage
  const [, setLocalStorageEmail] = useLocalStorage('rcd-email-redirect', '');

  /**
   * Process login using email input
   */
  const signInWithEmail = () => {
    setLocalStorageEmail(email);
    signIn('email', { email });
  };

  /**
   * Log in with email when the 'Enter' key is pressed
   */
  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      signInWithEmail();
    }
  };

  return (
    <Layout>
      <Container>
        <FormControl>
          <FormLabel>Login</FormLabel>
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            onKeyUp={handleKeyUp}
          />
          <FormHelperText>Please enter an RCD email</FormHelperText>
        </FormControl>
        <Button onClick={signInWithEmail}>Log in</Button>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  // If user is authenticated, redirect to homepage
  // TODO: Redirect to internal management page
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // Otherwise, return the login page
  return {
    props: {},
  };
};
