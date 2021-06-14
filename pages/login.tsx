import { useState } from 'react'; // State
import { GetServerSideProps } from 'next'; // Get server side props
import { getSession, signIn } from 'next-auth/client'; // Session management
import { Input, Heading, Button, Container } from '@chakra-ui/react'; // Chakra UI

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

  return (
    <Layout>
      <Container>
        <Heading>Login</Heading>
        <Input value={email} onChange={event => setEmail(event.target.value)} />
        <Button onClick={signInWithEmail}>Log in</Button>{' '}
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
