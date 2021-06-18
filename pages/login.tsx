import { useState, SyntheticEvent } from 'react'; // React
import { GetServerSideProps } from 'next'; // Get server side props
import Image from 'next/image';
import { getSession, signIn } from 'next-auth/client'; // Session management
import {
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Container,
  Box,
  Center,
  Flex,
  VStack,
} from '@chakra-ui/react'; // Chakra UI

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
    <Center minHeight="100vh" bg="background.grey">
      <Box
        borderWidth="1px"
        borderRadius="12px"
        bg="background.white"
        height="60%"
        width="37.5%"
        paddingBottom="3%"
        overflow="hidden"
      >
        <Container maxWidth="82.5%">
          <VStack width="100%" spacing={12} marginTop="5%">
            <Flex direction="column" style={{ gap: '10px' }}>
              <Image src="/assets/rcd_logo.svg" height={120} width={120} />
              <Text as="h1" textStyle="display-medium" align="center">
                Richmond Centre for Disability <br />
                Employee Login
              </Text>
            </Flex>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  isDisabled={isSigningIn}
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  height="51px"
                />
              </FormControl>
              <Button
                onClick={signInWithEmail}
                isLoading={isSigningIn}
                loadingText="Continue with Email"
                width="100%"
                height="46px"
                marginTop="7.5%"
              >
                <Text textStyle="button-semibold">Continue with Email</Text>
              </Button>
            </form>

            <Text as="p" textStyle="body-regular">
              <b>Don&apos;t have an account?</b> Please contact your administrator for access.
            </Text>
          </VStack>
        </Container>
      </Box>
    </Center>
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
