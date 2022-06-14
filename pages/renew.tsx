import { useState, useEffect } from 'react'; // React
import Link from 'next/link'; // Next Link
import { useMutation } from '@apollo/client'; // Apollo Client
import Client from 'shopify-buy';
import {
  Flex,
  Box,
  Stack,
  GridItem,
  Text,
  Button,
  Radio,
  FormHelperText,
  Checkbox,
  Divider,
  useToast,
  HStack,
} from '@chakra-ui/react'; // Chakra UI
import { Step, Steps } from 'chakra-ui-steps'; // Chakra UI Steps
import Layout from '@components/applicant/Layout'; // Layout component
import ReviewRequestField from '@components/applicant/renewals/ReviewRequestField'; // Field in Review Request section
import IncompleteSectionAlert from '@components/applicant/renewals/IncompleteSectionAlert'; // Alert box for incomplete form section
import {
  CREATE_EXTERNAL_RENEWAL_APPLICATION_MUTATION,
  CreateExternalRenewalApplicationRequest,
  CreateExternalRenewalApplicationResponse,
} from '@tools/applicant/renew'; // Page tools
import useSteps from '@tools/hooks/useSteps'; // Custom hook for managing steps state
import Request from '@containers/Request'; // Request state
import { Form, Formik } from 'formik';
import TextField from '@components/form/TextField';
import CheckboxField from '@components/form/CheckboxField';
import {
  applicantFacingRenewalContactSchema,
  applicantFacingRenewalDoctorSchema,
  applicantFacingRenewalPersonalAddressSchema,
} from '@lib/applications/validation';
import RadioGroupField from '@components/form/RadioGroupField';
import ValidationErrorAlert from '@components/form/ValidationErrorAlert';

export default function Renew() {
  // Request state
  const { applicantId } = Request.useContainer();

  // Steps state
  const { nextStep, prevStep, activeStep, goToStep } = useSteps({ initialStep: 0 });

  // Toast message
  const toast = useToast();

  // Loading state
  const [loading, setLoading] = useState(false);

  // Whether each section was updated
  const [updatedAddress, setUpdatedAddress] = useState(false); // Whether address was updated
  const [updatedContactInfo, setUpdatedContactInfo] = useState(false); // Whether contact info was updated
  const [updatedDoctor, setUpdatedDoctor] = useState(false); // Whether doctor info was updated

  // Personal address information state
  const [personalAddressLine1, setPersonalAddressLine1] = useState('');
  const [personalAddressLine2, setPersonalAddressLine2] = useState('');
  const [personalCity, setPersonalCity] = useState('');
  const [personalPostalCode, setPersonalPostalCode] = useState('');

  // Contact information state
  const [contactPhoneNumber, setContactPhoneNumber] = useState('');
  const [contactEmailAddress, setContactEmailAddress] = useState('');
  const [receiveEmailUpdates, setReceiveEmailUpdates] = useState(false);

  // Doctor information state
  const [doctorFirstName, setDoctorFirstName] = useState('');
  const [doctorLastName, setDoctorLastName] = useState('');
  const [doctorMspNumber, setDoctorMspNumber] = useState('');
  const [doctorAddressLine1, setDoctorAddressLine1] = useState('');
  const [doctorAddressLine2, setDoctorAddressLine2] = useState('');
  const [doctorCity, setDoctorCity] = useState('');
  const [doctorPostalCode, setDoctorPostalCode] = useState('');
  const [doctorPhoneNumber, setDoctorPhoneNumber] = useState('');

  // Confirmation/certification state
  const [certified, setCertified] = useState(false);

  // Whether user is reviewing the form
  const [isReviewing, setIsReviewing] = useState(false);

  /**  Backend form validation error */
  const [error, setError] = useState<string>('');

  const shopifyCheckout = async (applicationId: number) => {
    /* Setup Shopify Checkout on success. */
    const client = Client.buildClient({
      domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN as string,
      storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
    });

    // Product id can be found when viewing URL in Shopify admin (e.g poppy-hazel.myshopify.com/admin/products/6570386915350).
    // Shopify SDK only accepts encoded product id.
    const productId = `gid://shopify/Product/${process.env.NEXT_PUBLIC_SHOPIFY_PERMIT_PRODUCT_ID}`;
    const encodedId = Buffer.from(productId).toString('base64');

    // Fetching product and creating the cart are independent so both can run in parallel.
    const productPromise = client.product.fetch(encodedId);
    const cartPromise = client.checkout.create();

    // Wait for product and cart.
    const [product, cart] = await Promise.all([productPromise, cartPromise]);

    // Add product to cart.
    // Add custom attributes to be returned by shopify webhook
    // Attributes with leading _ are hidden in the shopify checkout page
    const lineItemsToAdd = [
      {
        variantId: product.variants[0].id,
        quantity: 1,
        customAttributes: [{ key: '_applicationId', value: applicationId.toString() }],
      },
    ];
    await client.checkout.addLineItems(cart.id, lineItemsToAdd);

    // Open checkout window.
    window.location.href = cart.webUrl;
  };

  // Submit application mutation
  const [submitApplication] = useMutation<
    CreateExternalRenewalApplicationResponse,
    CreateExternalRenewalApplicationRequest
  >(CREATE_EXTERNAL_RENEWAL_APPLICATION_MUTATION, {
    onCompleted: data => {
      if (data) {
        const { ok, applicationId, error } = data.createExternalRenewalApplication;

        if (ok && applicationId) {
          toast({
            status: 'success',
            description: 'Redirecting to payment page...',
            isClosable: true,
          });

          shopifyCheckout(applicationId);
        } else {
          setError(error ?? '');
        }
      }
    },
    onError: error => {
      setLoading(false);
      toast({
        status: 'error',
        description: error.message,
        isClosable: true,
      });
    },
  });

  /**
   * Go to the review step (last step)
   * Used when user needs to go to previous step to review information
   */
  const goToReview = () => {
    goToStep(3);
  };

  // When the user arrives on the last step, they are in review mode
  useEffect(() => {
    if (activeStep === 3) {
      setIsReviewing(true);
    }
  }, [activeStep, isReviewing]);

  const handleCompletePersonalInformationStep = (values: {
    updatedAddress: boolean;
    personalAddressLine1: string;
    personalAddressLine2: string;
    personalCity: string;
    personalPostalCode: string;
  }) => {
    setUpdatedAddress(!!Number(values.updatedAddress));
    if (values.updatedAddress) {
      setPersonalAddressLine1(values.personalAddressLine1);
      setPersonalAddressLine2(values.personalAddressLine2);
      setPersonalCity(values.personalCity);
      setPersonalPostalCode(values.personalPostalCode);
    } else {
      setPersonalAddressLine1('');
      setPersonalAddressLine2('');
      setPersonalCity('');
      setPersonalPostalCode('');
    }

    if (isReviewing) {
      goToReview();
    } else {
      nextStep();
    }
  };

  const handleCompleteContactInformationStep = (values: {
    updatedContactInfo: boolean;
    contactPhoneNumber: string;
    contactEmailAddress: string;
    receiveEmailUpdates: boolean;
  }) => {
    setUpdatedContactInfo(!!Number(values.updatedContactInfo));
    if (values.updatedContactInfo) {
      setContactPhoneNumber(values.contactPhoneNumber);
      setContactEmailAddress(values.contactEmailAddress);
      if (values.contactEmailAddress) {
        setReceiveEmailUpdates(values.receiveEmailUpdates);
      } else {
        setReceiveEmailUpdates(false);
      }
    } else {
      setContactPhoneNumber('');
      setContactEmailAddress('');
    }

    if (isReviewing) {
      goToReview();
    } else {
      nextStep();
    }
  };

  const handleCompleteDoctorInformationStep = (values: {
    updatedDoctor: boolean;
    doctorFirstName: string;
    doctorLastName: string;
    doctorMspNumber: string;
    doctorAddressLine1: string;
    doctorAddressLine2: string;
    doctorCity: string;
    doctorPostalCode: string;
    doctorPhoneNumber: string;
  }) => {
    setUpdatedDoctor(!!Number(values.updatedDoctor));
    if (values.updatedDoctor) {
      setDoctorFirstName(values.doctorFirstName);
      setDoctorLastName(values.doctorLastName);
      setDoctorMspNumber(values.doctorMspNumber);
      setDoctorAddressLine1(values.doctorAddressLine1);
      setDoctorAddressLine2(values.doctorAddressLine2);
      setDoctorCity(values.doctorCity);
      setDoctorPostalCode(values.doctorPostalCode);
      setDoctorPhoneNumber(values.doctorPhoneNumber);
    } else {
      setDoctorFirstName('');
      setDoctorLastName('');
      setDoctorMspNumber('');
      setDoctorAddressLine1('');
      setDoctorAddressLine2('');
      setDoctorCity('');
      setDoctorPostalCode('');
      setDoctorPhoneNumber('');
    }

    if (isReviewing) {
      goToReview();
    } else {
      nextStep();
    }
  };

  /**
   * Handle application submission
   */
  const handleSubmit = async () => {
    if (applicantId === null) {
      toast({
        status: 'error',
        title: 'Identity verification failed',
        description: `You have not completed the identity verification step.
          Please complete the identity verification before filling out the renewal application form.`,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    await submitApplication({
      variables: {
        input: {
          applicantId,
          updatedAddress,
          updatedContactInfo,
          updatedPhysician: updatedDoctor,
          addressLine1: updatedAddress ? personalAddressLine1 : null,
          addressLine2: updatedAddress ? personalAddressLine2 : null,
          city: updatedAddress ? personalCity : null,
          postalCode: updatedAddress ? personalPostalCode : null,
          phone: updatedContactInfo ? contactPhoneNumber : null,
          email: updatedContactInfo ? contactEmailAddress : null,
          physicianFirstName: updatedDoctor ? doctorFirstName : null,
          physicianLastName: updatedDoctor ? doctorLastName : null,
          physicianMspNumber: updatedDoctor ? doctorMspNumber : null,
          physicianAddressLine1: updatedDoctor ? doctorAddressLine1 : null,
          physicianAddressLine2: updatedDoctor ? doctorAddressLine2 : null,
          physicianCity: updatedDoctor ? doctorCity : null,
          physicianPostalCode: updatedDoctor ? doctorPostalCode : null,
          physicianPhone: updatedDoctor ? doctorPhoneNumber : null,
          receiveEmailUpdates,
          //TODO: Replace with dynamic values
          usesAccessibleConvertedVan: false,
          accessibleConvertedVanLoadingMethod: null,
          requiresWiderParkingSpace: false,
          requiresWiderParkingSpaceReason: null,
          otherRequiresWiderParkingSpaceReason: null,
        },
      },
    });
  };

  return (
    <Layout>
      <GridItem colSpan={10} colStart={2}>
        <Text as="h1" textStyle="display-xlarge" textAlign="left" marginBottom="48px">
          Renewal Form
        </Text>
        <Steps orientation="vertical" activeStep={activeStep}>
          <Step label={`Personal Address Information`}>
            <Formik
              initialValues={{
                updatedAddress: false,
                personalAddressLine1,
                personalAddressLine2,
                personalCity,
                personalPostalCode,
              }}
              validationSchema={applicantFacingRenewalPersonalAddressSchema}
              onSubmit={handleCompletePersonalInformationStep}
            >
              {({ values, isValid }) => (
                <Form noValidate>
                  <Box marginLeft="8px">
                    {/* Check whether applicant has updated address */}
                    <RadioGroupField
                      name="updatedAddress"
                      label="Has your address changed since you received your last parking pass?"
                      required
                      value={
                        values.updatedAddress === null ? undefined : Number(values.updatedAddress)
                      }
                    >
                      <Stack>
                        <Radio value={1}>{'Yes, it has'}</Radio>
                        <Radio value={0}>{'No, it has not'}</Radio>
                      </Stack>
                    </RadioGroupField>
                    {/* Conditionally render form based on whether address was updated */}
                    {!!Number(values.updatedAddress) && (
                      <Box marginY="16px">
                        <Text
                          as="p"
                          textAlign="left"
                          textStyle="body-bold"
                        >{`Please fill out the form below:`}</Text>
                        <Text
                          as="p"
                          textAlign="left"
                          textStyle="body-bold"
                          marginBottom="24px"
                        >{`Note that your address must be in British Columbia, Canada to qualify for a permit.`}</Text>
                        <Box paddingBottom="24px">
                          <TextField name="personalAddressLine1" label="Address line 1" required>
                            <FormHelperText color="text.secondary">
                              {'Street Address, P.O. Box, Company Name, c/o'}
                            </FormHelperText>
                          </TextField>
                        </Box>
                        <Box paddingBottom="24px">
                          <TextField
                            name="personalAddressLine2"
                            label={
                              <>
                                {'Address line 2 '}
                                <Box as="span" textStyle="body-regular" fontSize="sm">
                                  {'(optional)'}
                                </Box>
                              </>
                            }
                          >
                            <FormHelperText color="text.secondary">
                              {'Apartment, suite, unit, building, floor, etc'}
                            </FormHelperText>
                          </TextField>
                        </Box>
                        <Box marginBottom="24px">
                          <TextField name="personalCity" label="City" required />
                        </Box>
                        <Box marginBottom="24px">
                          <TextField name="personalPostalCode" label="Postal code" required>
                            <FormHelperText color="text.secondary">
                              {'Example: X0X 0X0'}{' '}
                            </FormHelperText>
                          </TextField>
                        </Box>
                      </Box>
                    )}
                    {!isValid && <IncompleteSectionAlert />}
                    <Flex width="100%" justifyContent="flex-end">
                      <Link href="/">
                        <Button
                          variant="outline"
                          marginRight="32px"
                        >{`Go back to home page`}</Button>
                      </Link>
                      <Button variant="solid" type="submit">
                        {isReviewing ? `Review request` : `Next`}
                      </Button>
                    </Flex>
                  </Box>
                </Form>
              )}
            </Formik>
          </Step>
          <Step label={`Personal Contact Information`}>
            <Formik
              initialValues={{
                updatedContactInfo: false,
                contactPhoneNumber,
                contactEmailAddress,
                receiveEmailUpdates,
              }}
              validationSchema={applicantFacingRenewalContactSchema}
              onSubmit={handleCompleteContactInformationStep}
            >
              {({ values, isValid }) => (
                <Form noValidate>
                  <Box marginLeft="8px">
                    {/* Check whether applicant has updated contact info */}
                    <RadioGroupField
                      name="updatedContactInfo"
                      label="Have you changed your contact information since you received or renewed your last parking pass?"
                      required
                      value={
                        values.updatedContactInfo === null
                          ? undefined
                          : Number(values.updatedContactInfo)
                      }
                    >
                      <Stack>
                        <Radio value={1}>{`Yes, I have`}</Radio>
                        <Radio value={0}>{'No, I have not'}</Radio>
                      </Stack>
                    </RadioGroupField>
                    {/* Conditionally render form based on whether contact info was updated */}
                    {!!Number(values.updatedContactInfo) && (
                      <Box marginY="16px">
                        <Text
                          as="p"
                          textAlign="left"
                          textStyle="body-bold"
                          marginBottom="24px"
                        >{`Please fill out at least one of the following:`}</Text>
                        <Box marginBottom="24px">
                          <TextField name="contactPhoneNumber" label="Phone Number">
                            <FormHelperText>{`e.g. 555-555-5555`}</FormHelperText>
                          </TextField>
                        </Box>
                        <Box marginBottom="24px">
                          <TextField name="contactEmailAddress" label="Email Address">
                            <FormHelperText>{`e.g. example@gmail.com`}</FormHelperText>
                          </TextField>
                        </Box>
                        <CheckboxField
                          name="receiveEmailUpdates"
                          textAlign="left"
                          isDisabled={!values.contactEmailAddress}
                        >
                          {`I would like to receive notifications to renew my permit through email`}
                        </CheckboxField>
                      </Box>
                    )}
                    {!isValid && <IncompleteSectionAlert />}
                    <Flex width="100%" justifyContent="flex-end">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        marginRight="32px"
                        isDisabled={!isValid}
                      >{`Previous`}</Button>
                      <Button variant="solid" type="submit">
                        {isReviewing ? `Review request` : `Next`}
                      </Button>
                    </Flex>
                  </Box>
                </Form>
              )}
            </Formik>
          </Step>
          <Step label={`Doctor's Information`}>
            <Formik
              initialValues={{
                updatedDoctor: false,
                doctorFirstName,
                doctorLastName,
                doctorMspNumber,
                doctorAddressLine1,
                doctorAddressLine2,
                doctorCity,
                doctorPostalCode,
                doctorPhoneNumber,
              }}
              validationSchema={applicantFacingRenewalDoctorSchema}
              onSubmit={handleCompleteDoctorInformationStep}
            >
              {({ values, isValid }) => (
                <Form noValidate>
                  <Box marginLeft="8px">
                    {/* Check whether applicant has updated doctor info */}
                    <RadioGroupField
                      name="updatedDoctor"
                      label="Have you changed your doctor since you last received or renewed your parking permit?"
                      required
                      value={
                        values.updatedDoctor === null ? undefined : Number(values.updatedDoctor)
                      }
                    >
                      <Stack>
                        <Radio value={1}>{'Yes, I have'}</Radio>
                        <Radio value={0}>{'No, I have not'}</Radio>
                      </Stack>
                    </RadioGroupField>
                    {/* Conditionally render form based on whether doctor info was updated */}
                    {!!Number(values.updatedDoctor) && (
                      <Box marginY="16px">
                        <Text
                          as="p"
                          textAlign="left"
                          textStyle="body-bold"
                          marginBottom="24px"
                        >{`Please fill out your doctor's information:`}</Text>
                        <HStack spacing="48px" marginBottom="24px">
                          <TextField name="doctorFirstName" label="First name" required />
                          <TextField name="doctorLastName" label="Last name" required />
                        </HStack>
                        <Box marginBottom="24px">
                          <TextField
                            name="doctorMspNumber"
                            label="Your Doctor's Medical Services Plan (MSP) Number"
                            required
                          >
                            <FormHelperText>
                              {`Your Doctor has a unique Medical Services Plan Number. If you do not know
                              where to find it, please contact your doctor.`}
                            </FormHelperText>
                          </TextField>
                        </Box>
                        <Box marginBottom="24px">
                          <TextField name="doctorAddressLine1" label="Address Line 1" required>
                            <FormHelperText>{`Street Address, P. O. Box, Company Name, c/o`}</FormHelperText>
                          </TextField>
                        </Box>
                        <Box marginBottom="24px">
                          <TextField name="doctorAddressLine2" label="Address Line 2 (optional)">
                            <FormHelperText>{`Apartment, suite, unit, building, floor, etc`}</FormHelperText>
                          </TextField>
                        </Box>
                        <Box marginBottom="24px">
                          <TextField name="doctorCity" label="City" required>
                            <FormHelperText>{`e.g. Vancouver`}</FormHelperText>
                          </TextField>
                        </Box>
                        <Box marginBottom="24px">
                          <TextField name="doctorPostalCode" label="Postal Code" required>
                            <FormHelperText>{`e.g. X0X 0X0`}</FormHelperText>
                          </TextField>
                        </Box>
                        <Box marginBottom="24px">
                          <TextField name="doctorPhoneNumber" label="Phone Number" required>
                            <FormHelperText>{`e.g. 555-555-5555`}</FormHelperText>
                          </TextField>
                        </Box>
                      </Box>
                    )}
                    {!isValid && <IncompleteSectionAlert />}
                    <Flex width="100%" justifyContent="flex-end">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        marginRight="32px"
                        isDisabled={!isValid}
                      >{`Previous`}</Button>
                      <Button variant="solid" type="submit">
                        {isReviewing ? `Review request` : `Next`}
                      </Button>
                    </Flex>
                  </Box>
                </Form>
              )}
            </Formik>
          </Step>
          <Step label={`Review Request`}>
            <Box marginTop="24px" marginBottom="40px">
              <Flex minWidth="700px" justifyContent="space-between">
                <Text as="h3" textStyle="heading">{`Address Information`}</Text>
                <Button variant="outline" onClick={() => goToStep(0)}>{`Edit`}</Button>
              </Flex>
              {updatedAddress ? (
                <>
                  <ReviewRequestField
                    name={`Address`}
                    value={`${personalAddressLine1} ${personalAddressLine2}`}
                  />
                  <ReviewRequestField name={`City`} value={personalCity} />
                  <ReviewRequestField name={`Postal Code`} value={personalPostalCode} />
                </>
              ) : (
                <Text
                  as="p"
                  textStyle="body-regular"
                  textAlign="left"
                >{`Has not changed since last renewal.`}</Text>
              )}
            </Box>
            <Divider />
            <Box marginTop="24px" marginBottom="40px">
              <Flex minWidth="700px" justifyContent="space-between">
                <Text as="h3" textStyle="heading">{`Contact Information`}</Text>
                <Button variant="outline" onClick={() => goToStep(1)}>{`Edit`}</Button>
              </Flex>
              {updatedContactInfo ? (
                <>
                  <ReviewRequestField name={`Phone Number`} value={contactPhoneNumber} />
                  <ReviewRequestField name={`Email Address`} value={contactEmailAddress} />
                </>
              ) : (
                <Text
                  as="p"
                  textStyle="body-regular"
                  textAlign="left"
                >{`Has not changed since last renewal.`}</Text>
              )}
            </Box>
            <Divider />
            <Box marginTop="24px" marginBottom="40px">
              <Flex minWidth="700px" justifyContent="space-between">
                <Text as="h3" textStyle="heading">{`Doctor's Information`}</Text>
                <Button variant="outline" onClick={() => goToStep(2)}>{`Edit`}</Button>
              </Flex>
              {updatedDoctor ? (
                <>
                  <ReviewRequestField name={`Name`} value={doctorFirstName} />
                  <ReviewRequestField name={`MSP Number`} value={doctorMspNumber} />
                  <ReviewRequestField
                    name={`Address`}
                    value={`${doctorAddressLine1} ${doctorAddressLine2}`}
                  />
                  <ReviewRequestField name={`City`} value={doctorCity} />
                  <ReviewRequestField name={`Postal Code`} value={doctorPostalCode} />
                  <ReviewRequestField name={`Phone Number`} value={doctorPhoneNumber} />
                </>
              ) : (
                <Text
                  as="p"
                  textStyle="body-regular"
                  textAlign="left"
                >{`Has not changed since last renewal.`}</Text>
              )}
            </Box>
            <Box marginTop="24px" marginBottom="40px">
              <Text
                as="h4"
                textStyle="body-bold"
                textAlign="left"
                marginBottom="12px"
              >{`Please check to confirm the following statements before you proceed:`}</Text>
              <Checkbox
                textAlign="left"
                isChecked={certified}
                onChange={event => setCertified(event.target.checked)}
              >
                {`I certify that I am the holder of the accessible parking pass for which this
          application for renewal is submitted, and that I have personally provided all of the
          information required in this application.`}
              </Checkbox>
            </Box>
            <ValidationErrorAlert error={error} />
            <Flex width="100%" justifyContent="flex-end">
              <Button variant="outline" onClick={prevStep} marginRight="32px">{`Previous`}</Button>
              <Button
                variant="solid"
                onClick={handleSubmit}
                isLoading={loading}
                disabled={!applicantId || !certified}
              >{`Proceed to payment`}</Button>
            </Flex>
          </Step>
        </Steps>
      </GridItem>
    </Layout>
  );
}
