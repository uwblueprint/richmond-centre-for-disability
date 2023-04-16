import Link from 'next/link'; // Link
import Image from 'next/image'; // Next Image
import { useMutation } from '@tools/hooks/graphql'; // Apollo Client
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
  VStack,
  AlertTitle,
  Stack,
} from '@chakra-ui/react'; // Chakra UI
import { InfoOutlineIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import TOSModal from '@components/applicant/renewals/TOSModal'; // TOS Modal
import {
  VERIFY_IDENTITY_MUTATION,
  VerifyIdentityRequest,
  VerifyIdentityResponse,
  getErrorMessage,
} from '@tools/applicant/verify-identity'; // Tools
import RenewalFlow from '@containers/RenewalFlow'; // Request state
import DateField from '@components/form/DateField';
import TextField from '@components/form/TextField';
import { Form, Formik } from 'formik';
import NumberField from '@components/form/NumberField';
import { verifyIdentitySchema } from '@lib/applicants/validation';
import { FC, useState } from 'react';

/** Identity verification step of APP renewal flow */
const IdentityVerification: FC = () => {
  // Request state
  const { acceptedTOSTimestamp, setApplicantId, goToRenewalForm } = RenewalFlow.useContainer();
  const [alertError, setAlertError] = useState(''); // Error message displayed in alert

  // Verify identity query
  const [verifyIdentity, { loading }] = useMutation<VerifyIdentityResponse, VerifyIdentityRequest>(
    VERIFY_IDENTITY_MUTATION,
    {
      onCompleted: data => {
        if (data.verifyIdentity.ok && data.verifyIdentity.applicantId) {
          setApplicantId(data.verifyIdentity.applicantId);
          goToRenewalForm();
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
    <GridItem colSpan={{ sm: 12, md: 8 }} colStart={{ sm: 1, md: 3 }}>
      <Flex width="100%" justifyContent="flex-start">
        <Flex width="100%" flexFlow="column" alignItems="flex-start">
          <Text
            as="h2"
            textStyle={{ sm: 'heading', md: 'display-medium-bold' }}
            mb={{ sm: '40px', md: '48px' }}
          >
            Renewal Form
          </Text>
          <Alert status="info" marginBottom="48px">
            <AlertIcon />
            <VStack align="flex-start" spacing="0">
              <AlertTitle>Tip</AlertTitle>
              <AlertDescription textAlign="left">
                If you need assistance with your wallet card or inputting any of the information
                below, please contact RCD via phone at <b>604-232-2404</b> or via email at{' '}
                <a href="mailto:parkingpermit@rcdrichmond.org">
                  <b>parkingpermit@rcdrichmond.org</b>
                </a>
                .
              </AlertDescription>
            </VStack>
          </Alert>
          <Text
            as="h1"
            textStyle={{ sm: 'display-medium-bold', md: 'display-xlarge' }}
            mb="20px"
          >{`Verify your Identity`}</Text>
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
            {({ values, isValid }) => (
              <Form style={{ width: '100%' }} noValidate>
                <Box marginBottom="48px" textAlign={'left'}>
                  <NumberField name="userId" label="User ID number" required width="184px" min={1}>
                    <Flex alignItems="center">
                      <Popover placement="left" trigger="hover" gutter={24}>
                        <PopoverTrigger>
                          <InfoOutlineIcon marginRight="8px" cursor="pointer" />
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverBody>
                            <Image src="/assets/wallet-card-example.png" height={200} width={320} />
                          </PopoverBody>
                          <PopoverFooter backgroundColor="background.grayHover">
                            <Text textStyle="caption">
                              {`Locate your User ID on the Wallet Card that came with your Permit.`}
                            </Text>
                          </PopoverFooter>
                        </PopoverContent>
                      </Popover>
                      <FormHelperText>
                        {`You can find your user ID on the back of your wallet card as well as on the
                        renewal notice.. If you cannot find your
                        wallet card, please call RCD at 604-232-2404.`}
                      </FormHelperText>
                    </Flex>
                  </NumberField>
                </Box>

                <Box marginBottom="48px" textAlign={'left'}>
                  <TextField
                    name="phoneNumberSuffix"
                    label="Last 4 digits of your phone number"
                    required
                    width="184px"
                    maxLength={4}
                  />
                </Box>

                <Box marginBottom={{ sm: '40px', md: '20px' }} textAlign={'left'}>
                  <DateField name="dateOfBirth" label="Date of Birth" width="184px">
                    <FormHelperText>
                      <Text>Please enter your date of birth in YYYY-MM-DD format.</Text>
                      <Text>
                        For example, if you were born on 20th August 1950, you would enter
                        1950-08-20.
                      </Text>
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

                <Stack
                  width="100%"
                  direction={{ sm: 'column-reverse', md: 'row' }}
                  justifyContent="flex-end"
                  spacing={{ sm: '16px', md: '12px' }}
                >
                  <Link href="/">
                    <Button variant="outline">{`Go back to home page`}</Button>
                  </Link>
                  <Button
                    type="submit"
                    variant="solid"
                    isLoading={loading}
                    disabled={
                      loading ||
                      !isValid ||
                      !values.userId ||
                      !values.phoneNumberSuffix ||
                      !values.dateOfBirth
                    }
                  >{`Continue`}</Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Flex>
      </Flex>
      <TOSModal />
    </GridItem>
  );
};

export default IdentityVerification;
