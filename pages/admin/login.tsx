import { useState } from 'react'; // React
import { GetServerSideProps } from 'next'; // Get server side props
import Image from 'next/image';
import { getSession, signIn, SignInResponse } from 'next-auth/client'; // Session management
import {
  Text,
  Link,
  Button,
  Box,
  Center,
  VStack,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
  Checkbox,
  Radio,
  Stack,
} from '@chakra-ui/react'; // Chakra UI
import { loginSchema } from '@lib/auth/validation';

import { Form, Formik } from 'formik';
import useLocalStorage from '@tools/hooks/useLocalStorage'; // Local storage
import TextField from '@components/form/TextField';
import TextArea from '@components/form/TextAreaField';
import DateField from '@components/form/DateField';
import CheckboxGroupField from '@components/form/CheckboxGroupField';
import RadioGroupField from '@components/form/RadioGroupField';
import { PaymentType } from '@lib/graphql/types';
import SelectField from '@components/form/SelectField';

export default function Login() {
  const [emailInputError, setEmailInputError] = useState(''); // Error message displayed under input

  // Store email in local storage
  const [localStorageEmail, setLocalStorageEmail] = useLocalStorage('rcd-email-redirect', '');

  // Loading state for log in button
  const [isSigningIn, setIsSigningIn] = useState(false);
  // NextAuth signIn() resolved promise
  const [authState, setAuthState] = useState<SignInResponse>();

  /**
   * Process login using email input
   */
  const signInWithEmail = async (email: string) => {
    setIsSigningIn(true);
    setLocalStorageEmail(email);
    const signInResponse = await signIn('email', { email, redirect: false });
    // Store NextAuth promise response
    setAuthState(signInResponse);
    setIsSigningIn(false);

    if (signInResponse?.error) {
      if (signInResponse.error.toLowerCase().includes('error:')) {
        // Removes "Error: " from the beginning of error messages
        setEmailInputError(signInResponse.error.substring(signInResponse.error.indexOf(':') + 2));
      } else {
        setEmailInputError(signInResponse.error);
      }
    }
  };

  const handleSubmit = async (values: {
    email: string;
    comments: string;
    date: string;
    checkboxOptions: string[];
    paymentMethod: string;
    gender: string;
  }) => {
    // console.log("submitting");
    // console.log(values);
    signInWithEmail(values.email);
  };

  const resendEmailToast = useToast();

  return (
    <Center height="100vh" width="100vw">
      <Box
        width="640px"
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
                <Formik
                  initialValues={{
                    email: '',
                    comments: '',
                    date: '',
                    checkboxOptions: [],
                    paymentMethod: '',
                    gender: 'MALE',
                  }}
                  validationSchema={loginSchema}
                  onSubmit={handleSubmit}
                >
                  <Form style={{ width: '100%' }}>
                    <TextField name="email" label="Email" height="51px" />
                    <TextArea name="comments" label="Comments" />
                    <DateField name="date" label="Date" />
                    <SelectField name="gender" label="Gender">
                      <option value={'MALE'}>{'Male'}</option>
                      <option value={'FEMALE'}>{'Female'}</option>
                      <option value={'OTHER'}>{'Other'}</option>
                    </SelectField>

                    <CheckboxGroupField name="checkOptions" label="AnotherLabel">
                      <Stack>
                        <Checkbox value={'option1'}>{'option1'}</Checkbox>
                        <Checkbox value={'option2'}>{'option2'}</Checkbox>
                      </Stack>
                    </CheckboxGroupField>
                    <RadioGroupField name="paymentMethod" label="TestLabel">
                      <Stack>
                        <Radio value={'MASTERCARD' as PaymentType}>{'Mastercard'}</Radio>
                        <Radio value={'VISA' as PaymentType}>{'Visa'}</Radio>
                        <Radio value={'DEBIT' as PaymentType}>{'Debit'}</Radio>
                        <Radio value={'CASH' as PaymentType}>{'Cash'}</Radio>
                        <Radio value={'CHEQUE' as PaymentType}>{'Cheque'}</Radio>
                        <Radio value={'E_TRANSFER' as PaymentType}>{'E-transfer'}</Radio>
                      </Stack>
                    </RadioGroupField>
                    {/* TODO: backend error styling */}
                    {emailInputError && (
                      <Alert status="error" mt="2">
                        <AlertIcon />
                        <AlertDescription>{emailInputError}</AlertDescription>
                      </Alert>
                    )}
                    <Button
                      type="submit"
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
                  </Form>
                </Formik>
                <Text as="p" textStyle="caption" width="100%" textAlign="left">
                  <b>Don&apos;t have an account?</b> Please contact your administrator for access.
                </Text>
              </>
            ) : (
              <>
                <Text as="p" textStyle="body-regular" align="center">
                  We just sent an email to {localStorageEmail}. <br />
                  There should be a link in your inbox to log in.
                </Text>
                <Text as="p" textStyle="caption" textAlign="left">
                  <b>Didn&apos;t get an email?</b> Check your spam or trash folder or{' '}
                  <Link
                    onClick={() => {
                      signIn('email', { localStorageEmail, redirect: false });
                      resendEmailToast({
                        status: 'success',
                        title: 'Login Email Resent',
                        description: 'We just sent another email to your inbox.',
                        variant: 'solid',
                        isClosable: true,
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
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  // If user is authenticated, redirect to appropriate page
  if (session) {
    // If user is accounting, redirect to reports
    if (session.role === 'ACCOUNTING') {
      return {
        redirect: {
          destination: '/admin/reports',
          permanent: false,
        },
      };
    }

    // Otherwise, redirect to APP requests
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  // Otherwise, remain on the login page
  return {
    props: {},
  };
};
