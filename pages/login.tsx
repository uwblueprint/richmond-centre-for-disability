import { useState, SyntheticEvent } from 'react'; // React
import { GetServerSideProps } from 'next'; // Get server side props
import Image from 'next/image';
import { getSession, signIn, SignInResponse } from 'next-auth/client'; // Session management
import {
  Text,
  Link,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  GridItem,
  Box,
  Center,
  VStack,
  useToast,
} from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/internal/Layout'; // Layout component

import useLocalStorage from '@tools/hooks/useLocalStorage'; // Local storage

export default function Login() {
  const [email, setEmail] = useState(''); // Email input
  const [emailInputError, setEmailInputError] = useState(''); // Error message displayed under input

  // Store email in local storage
  const [, setLocalStorageEmail] = useLocalStorage('rcd-email-redirect', '');

  // Loading state for log in button
  const [isSigningIn, setIsSigningIn] = useState(false);
  // NextAuth signIn() resolved promise
  const [authState, setAuthState] = useState<SignInResponse>();

  /**
   * Process login using email input
   */
  const signInWithEmail = async () => {
    setIsSigningIn(true);
    setLocalStorageEmail(email);
    const signInResponse = await signIn('email', { email, redirect: false });
    // Store NextAuth promise response
    setAuthState(signInResponse);
    setIsSigningIn(false);

    if (signInResponse?.error) {
      setEmailInputError('This email has not been registered by the admin.');
    }
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    if (email.length) {
      signInWithEmail();
    } else {
      setEmailInputError('Please enter an email address.');
    }
  };

  const resendEmailToast = useToast();

  return (
    <Layout header={false} footer={false}>
      <GridItem colSpan={6} colStart={4}>
        <Center height="100%" width="100%">
          <Box
            width="100%"
            borderWidth="1px"
            borderRadius="12px"
            bg="background.white"
            overflow="hidden"
          >
            <Box width="100%" padding={14}>
              <VStack width="100%" spacing={12}>
                <VStack spacing={2}>
                  <Image src="/assets/logo.svg" height={120} width={120} />
                  <Text as="h1" textStyle="display-medium" align="center">
                    Richmond Centre for Disability Employee Login
                  </Text>
                </VStack>

                {/* If NextAuth's callback doesn't contain a URL, auth (sending email) wasn't successful. */}
                {!authState?.url ? (
                  <>
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                      <FormControl isInvalid={!!emailInputError}>
                        <FormLabel>Email</FormLabel>
                        <Input
                          height="51px"
                          type="email"
                          value={email}
                          onChange={event => setEmail(event.target.value)}
                          isDisabled={isSigningIn}
                        />
                        <FormErrorMessage>
                          <Text as="span" textStyle="body-regular">
                            {emailInputError}
                          </Text>
                        </FormErrorMessage>
                      </FormControl>
                      <Button
                        onClick={handleSubmit}
                        isLoading={isSigningIn}
                        loadingText="Continue with Email"
                        width="100%"
                        height="46px"
                        marginTop="7.5%"
                      >
                        <Text as="span" textStyle="button-semibold">
                          Continue with Email
                        </Text>
                      </Button>
                    </form>
                    <Text as="p" textStyle="caption" width="100%" textAlign="left">
                      <b>Don&apos;t have an account?</b> Please contact your administrator for
                      access.
                    </Text>
                  </>
                ) : (
                  <>
                    <Text as="p" textStyle="body-regular" align="center">
                      We just sent an email to {email}. <br />
                      There should be a link in your inbox to log in.
                    </Text>
                    <Text as="p" textStyle="caption" textAlign="left">
                      <b>Didn&apos;t get an email?</b> Check your spam or trash folder or{' '}
                      <Link
                        onClick={() => {
                          signIn('email', { email, redirect: false });
                          resendEmailToast({
                            status: 'success',
                            title: 'Login Email Resent',
                            description: 'We just sent another email to your inbox.',
                            variant: 'solid',
                          });
                        }}
                        color="primary"
                      >
                        click here to resend an email.
                      </Link>
                    </Text>
                  </>
                )}
              </VStack>
            </Box>
          </Box>
        </Center>
      </GridItem>
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
