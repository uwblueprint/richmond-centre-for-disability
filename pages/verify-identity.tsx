import Link from 'next/link'; // Link
import Image from 'next/image'; // Next Image
import { useRouter } from 'next/router'; // Router
import { useMutation } from '@apollo/client'; // Apollo Client
import {
  GridItem,
  Flex,
  Text,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  Box,
  FormHelperText,
  AlertIcon,
  Alert,
  AlertDescription,
} from '@chakra-ui/react'; // Chakra UI
import { InfoOutlineIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import Layout from '@components/applicant/Layout'; // Layout component
import TOSModal from '@components/applicant/renewals/TOSModal'; // TOS Modal
import {
  VERIFY_IDENTITY_MUTATION,
  VerifyIdentityRequest,
  VerifyIdentityResponse,
  getErrorMessage,
} from '@tools/applicant/verify-identity'; // Tools
import Request from '@containers/Request'; // Request state
import DateField from '@components/form/DateField';
import TextField from '@components/form/TextField';
import { Form, Formik } from 'formik';
import NumberField from '@components/form/NumberField';
import { verifyIdentitySchema } from '@lib/applicants/verify-identity/validation';
import { useState } from 'react';

export default function IdentityVerificationForm() {
  // Router
  const router = useRouter();

  // Request state
  const { acceptedTOSTimestamp, setApplicantId } = Request.useContainer();
  const [alertError, setAlertError] = useState(''); // Error message displayed in alert

  // Verify identity query
  const [verifyIdentity, { loading }] = useMutation<VerifyIdentityResponse, VerifyIdentityRequest>(
    VERIFY_IDENTITY_MUTATION,
    {
      onCompleted: data => {
        if (data.verifyIdentity.ok && data.verifyIdentity.applicantId) {
          setApplicantId(data.verifyIdentity.applicantId);
          router.push('/renew');
        } else if (data.verifyIdentity.failureReason) {
          setAlertError(getErrorMessage(data.verifyIdentity.failureReason));
        }
      },
      onError: error => {
        setAlertError(error.message);
      },
    }
  );

  /**
   * Handle identity verification submit
   */
  const handleSubmit = (values: {
    userId: number;
    phoneNumberSuffix: string;
    dateOfBirth: string;
  }) => {
    verifyIdentity({
      variables: {
        input: {
          userId: Number(values.userId),
          phoneNumberSuffix: values.phoneNumberSuffix,
          dateOfBirth: values.dateOfBirth,
          acceptedTos: acceptedTOSTimestamp,
        },
      },
    });

    return;
  };

  return (
    <Layout footer={false}>
      <GridItem colSpan={8} colStart={3}>
        <Flex width="100%" justifyContent="flex-start">
          <Flex width="100%" flexFlow="column" alignItems="flex-start">
            <Text as="h1" textStyle="display-xlarge" mb="20px">{`Verify your Identity`}</Text>
            <Text as="p" textStyle="body-bold" textAlign="left" marginBottom="20px">
              {`You must have a record with Richmond Centre for Disability before proceeding. Please fill
                out the information below so we may validate your identity:`}
            </Text>
            <Formik
              initialValues={{
                userId: 0,
                phoneNumberSuffix: '',
                dateOfBirth: '',
              }}
              validationSchema={verifyIdentitySchema}
              onSubmit={handleSubmit}
            >
              {({ values }) => (
                <Form style={{ width: '100%' }} noValidate>
                  <Box marginBottom="48px" textAlign={'left'}>
                    <NumberField
                      name="userId"
                      label="User ID number"
                      required={true}
                      width="184px"
                      min={1}
                    >
                      <Flex alignItems="center">
                        <Popover placement="left" trigger="hover" gutter={24}>
                          <PopoverTrigger>
                            <InfoOutlineIcon marginRight="8px" cursor="pointer" />
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverBody>
                              <Image
                                src="/assets/wallet-card-example.png"
                                height={200}
                                width={320}
                              />
                            </PopoverBody>
                            <PopoverFooter backgroundColor="background.grayHover">
                              <Text textStyle="caption">
                                {`Locate your User ID on the Wallet Card that came with your Permit.`}
                              </Text>
                            </PopoverFooter>
                          </PopoverContent>
                        </Popover>
                        <FormHelperText>
                          {`You can find your user ID on the back of your wallet card. If you cannot find your
                        wallet card, please call RCD at 604-232-2404.`}
                        </FormHelperText>
                      </Flex>
                    </NumberField>
                  </Box>

                  <Box marginBottom="48px" textAlign={'left'}>
                    <TextField
                      name="phoneNumberSuffix"
                      label="Last 4 digits of your phone number"
                      required={true}
                      width="184px"
                      maxLength={4}
                    />
                  </Box>

                  <Box marginBottom="20px" textAlign={'left'}>
                    <DateField name="dateOfBirth" label="Date of Birth" width="184px">
                      <FormHelperText>
                        {`Please enter your date of birth in YYYY-MM-DD format. For example, if you were born on
                      20th August 1950, you would enter 1950-08-20`}
                      </FormHelperText>
                    </DateField>
                  </Box>

                  {alertError && (
                    <Box marginY="20px" textAlign={'left'}>
                      <Alert status="error" marginY="12px">
                        <AlertIcon />
                        <AlertDescription>{alertError}</AlertDescription>
                        {/* TODO: Make alert closable */}
                        {/* <CloseButton position="absolute" right="8px" top="8px" /> */}
                      </Alert>
                    </Box>
                  )}

                  <Flex width="100%" justifyContent="flex-end">
                    <Link href="/">
                      <Button variant="outline" marginRight="12px">{`Go back to home page`}</Button>
                    </Link>
                    <Button
                      type="submit"
                      variant="solid"
                      isLoading={loading}
                      disabled={
                        loading ||
                        !values.userId ||
                        !values.phoneNumberSuffix ||
                        !values.dateOfBirth
                      }
                    >{`Continue`}</Button>
                  </Flex>
                </Form>
              )}
            </Formik>
          </Flex>
        </Flex>
        <TOSModal />
      </GridItem>
    </Layout>
  );
}
