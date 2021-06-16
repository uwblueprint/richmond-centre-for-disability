import { useState, SyntheticEvent } from 'react'; // React
import { GetServerSideProps } from 'next'; // Get server side props
import { getSession, signIn } from 'next-auth/client'; // Session management
import { FormControl, FormLabel, Input, Button, Container, FormHelperText } from '@chakra-ui/react'; // Chakra UI

import Layout from '@components/Layout'; // Layout wrapper
import useLocalStorage from '@tools/hooks/useLocalStorage'; // Local storage

export default function Login() {
  const [email, setEmail] = useState(''); // Email input

  // Store email in local storage
  const [, setLocalStorageEmail] = useLocalStorage('rcd-email-redirect', '');

  // Loading state for log in button
  const [isSigningIn, setIsSigningIn] = useState(false);

  /**
   * Process login using email input
   */
  const signInWithEmail = () => {
    setIsSigningIn(true);
    setLocalStorageEmail(email);
    signIn('email', { email });
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    signInWithEmail();
  };

  return (
    <Layout>
      <Container>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Login</FormLabel>
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
            <FormHelperText>Please enter an RCD email</FormHelperText>
          </FormControl>
          <Button onClick={signInWithEmail} isLoading={isSigningIn} loadingText="Logging In">
            Log in
          </Button>
        </form>
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
