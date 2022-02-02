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
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Radio,
  FormHelperText,
  Checkbox,
  NumberInput,
  NumberInputField,
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

export default function Renew() {
  // Request state
  const { applicantId } = Request.useContainer();

  // Steps state
  const { nextStep, prevStep, activeStep, goToStep } = useSteps({ initialStep: 0 });

  // Toast message
  const toast = useToast();

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

  // Whether each section has invalid inputs
  const invalidPersonalAddress =
    updatedAddress && (!personalAddressLine1 || !personalCity || !personalPostalCode);
  const invalidContact = updatedContactInfo && !contactPhoneNumber && !contactEmailAddress;
  const invalidDoctor =
    updatedDoctor &&
    (!doctorFirstName ||
      !doctorLastName ||
      !doctorMspNumber ||
      !doctorAddressLine1 ||
      !doctorCity ||
      !doctorPostalCode ||
      !doctorPhoneNumber);

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
    const lineItemsToAdd = [
      {
        variantId: product.variants[0].id,
        quantity: 1,
        customAttributes: [{ key: 'applicationId', value: applicationId.toString() }],
      },
    ];
    await client.checkout.addLineItems(cart.id, lineItemsToAdd);

    // Open checkout window.
    window.location.href = cart.webUrl;
  };

  // Submit application mutation
  const [submitApplication, { loading }] = useMutation<
    CreateExternalRenewalApplicationResponse,
    CreateExternalRenewalApplicationRequest
  >(CREATE_EXTERNAL_RENEWAL_APPLICATION_MUTATION, {
    onCompleted: data => {
      if (
        data.createExternalRenewalApplication.ok &&
        data.createExternalRenewalApplication.applicationId
      ) {
        toast({
          status: 'success',
          description: 'Redirecting to payment page...',
          isClosable: true,
        });

        shopifyCheckout(data.createExternalRenewalApplication.applicationId);
      }
    },
    onError: error => {
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
          physicianMspNumber: updatedDoctor ? parseInt(doctorMspNumber) : null,
          physicianAddressLine1: updatedDoctor ? doctorAddressLine1 : null,
          physicianAddressLine2: updatedDoctor ? doctorAddressLine2 : null,
          physicianCity: updatedDoctor ? doctorCity : null,
          physicianPostalCode: updatedDoctor ? doctorPostalCode : null,
          physicianPhone: updatedDoctor ? doctorPhoneNumber : null,
          //TODO: Replace with dynamic values
          receiveEmailUpdates: false,
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
            <Box marginLeft="8px">
              {/* Check whether applicant has updated address */}
              <FormControl isRequired textAlign="left">
                <FormLabel>{`Has your address changed since you received your last parking pass?`}</FormLabel>
                <RadioGroup
                  value={updatedAddress ? '0' : '1'}
                  onChange={value => setUpdatedAddress(value === '0' ? true : false)}
                >
                  <Stack direction="row">
                    <Radio value="0">{`Yes, it has`}</Radio>
                    <Radio value="1">{`No, it has not`}</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
              {/* Conditionally render form based on whether address was updated */}
              {updatedAddress && (
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
                  <FormControl isRequired marginBottom="24px">
                    <FormLabel>{`Address Line 1`}</FormLabel>
                    <Input
                      value={personalAddressLine1}
                      onChange={event => setPersonalAddressLine1(event.target.value)}
                    />
                    <FormHelperText>{`Street Address, P. O. Box, Company Name, c/o`}</FormHelperText>
                  </FormControl>
                  <FormControl marginBottom="24px">
                    <FormLabel>{`Address Line 2 (optional)`}</FormLabel>
                    <Input
                      value={personalAddressLine2}
                      onChange={event => setPersonalAddressLine2(event.target.value)}
                    />
                    <FormHelperText>{`Apartment, suite, unit, building, floor, etc`}</FormHelperText>
                  </FormControl>
                  <FormControl isRequired marginBottom="24px">
                    <FormLabel>{`City`}</FormLabel>
                    <Input
                      value={personalCity}
                      onChange={event => setPersonalCity(event.target.value)}
                    />
                  </FormControl>
                  <FormControl isRequired marginBottom="24px">
                    <FormLabel>{`Postal Code`}</FormLabel>
                    <Input
                      value={personalPostalCode}
                      onChange={event => setPersonalPostalCode(event.target.value)}
                    />
                    <FormHelperText>{`e.g. X0X 0X0`}</FormHelperText>
                  </FormControl>
                </Box>
              )}
              {invalidPersonalAddress && <IncompleteSectionAlert />}
              <Flex width="100%" justifyContent="flex-end">
                <Link href="/">
                  <Button variant="outline" marginRight="32px">{`Go back to home page`}</Button>
                </Link>
                <Button
                  variant="solid"
                  onClick={isReviewing ? goToReview : nextStep}
                  disabled={invalidPersonalAddress}
                >
                  {isReviewing ? `Review request` : `Next`}
                </Button>
              </Flex>
            </Box>
          </Step>
          <Step label={`Personal Contact Information`}>
            <Box marginLeft="8px">
              {/* Check whether applicant has updated contact info */}
              <FormControl isRequired textAlign="left">
                <FormLabel>
                  {`Have you changed your contact information since you received or renewed your last
                  parking pass?`}
                </FormLabel>
                <RadioGroup
                  value={updatedContactInfo ? '0' : '1'}
                  onChange={value => setUpdatedContactInfo(value === '0' ? true : false)}
                >
                  <Stack direction="row">
                    <Radio value="0">{`Yes, I have`}</Radio>
                    <Radio value="1">{`No, I have not`}</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
              {/* Conditionally render form based on whether contact info was updated */}
              {updatedContactInfo && (
                <Box marginY="16px">
                  <Text
                    as="p"
                    textAlign="left"
                    textStyle="body-bold"
                    marginBottom="24px"
                  >{`Please fill out at least one of the following:`}</Text>
                  <FormControl marginBottom="24px">
                    <FormLabel>{`Phone Number`}</FormLabel>
                    <Input
                      type="tel"
                      value={contactPhoneNumber}
                      onChange={event => setContactPhoneNumber(event.target.value)}
                    />
                    <FormHelperText>{`e.g. 555-555-5555`}</FormHelperText>
                  </FormControl>
                  <FormControl marginBottom="24px">
                    <FormLabel>{`Email Address`}</FormLabel>
                    <Input
                      value={contactEmailAddress}
                      onChange={event => setContactEmailAddress(event.target.value)}
                    />
                    <FormHelperText>{`e.g. example@gmail.com`}</FormHelperText>
                  </FormControl>
                  <FormControl textAlign="left">
                    <Checkbox>
                      {`I would like to receive notifications to renew my permit through email`}
                    </Checkbox>
                  </FormControl>
                </Box>
              )}
              {invalidContact && <IncompleteSectionAlert />}
              <Flex width="100%" justifyContent="flex-end">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  marginRight="32px"
                >{`Previous`}</Button>
                <Button
                  variant="solid"
                  onClick={isReviewing ? goToReview : nextStep}
                  disabled={invalidContact}
                >
                  {isReviewing ? `Review request` : `Next`}
                </Button>
              </Flex>
            </Box>
          </Step>
          <Step label={`Doctor's Information`}>
            <Box marginLeft="8px">
              {/* Check whether applicant has updated doctor info */}
              <FormControl isRequired textAlign="left">
                <FormLabel>
                  {`Have you changed your doctor since you last received or renewed your parking
                  permit?`}
                </FormLabel>
                <RadioGroup
                  value={updatedDoctor ? '0' : '1'}
                  onChange={value => setUpdatedDoctor(value === '0' ? true : false)}
                >
                  <Stack direction="row">
                    <Radio value="0">{`Yes, I have`}</Radio>
                    <Radio value="1">{`No, I have not`}</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
              {/* Conditionally render form based on whether doctor info was updated */}
              {updatedDoctor && (
                <Box marginY="16px">
                  <Text
                    as="p"
                    textAlign="left"
                    textStyle="body-bold"
                    marginBottom="24px"
                  >{`Please fill out your doctor's information:`}</Text>
                  <HStack spacing="48px" marginBottom="24px">
                    <FormControl isRequired>
                      <FormLabel>{`First name`}</FormLabel>
                      <Input
                        value={doctorFirstName}
                        onChange={event => setDoctorFirstName(event.target.value)}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>{`Last name`}</FormLabel>
                      <Input
                        value={doctorLastName}
                        onChange={event => setDoctorLastName(event.target.value)}
                      />
                    </FormControl>
                  </HStack>
                  <FormControl isRequired marginBottom="24px">
                    <FormLabel>{`Your Doctor's Medical Services Plan (MSP) Number`}</FormLabel>
                    <NumberInput width="184px">
                      <NumberInputField
                        value={doctorMspNumber}
                        onChange={event => setDoctorMspNumber(event.target.value)}
                      />
                    </NumberInput>
                    <FormHelperText>
                      {`Your Doctor has a unique Medical Services Plan Number. If you do not know
                      where to find it, please contact your doctor.`}
                    </FormHelperText>
                  </FormControl>
                  <FormControl isRequired marginBottom="24px">
                    <FormLabel>{`Address Line 1`}</FormLabel>
                    <Input
                      value={doctorAddressLine1}
                      onChange={event => setDoctorAddressLine1(event.target.value)}
                    />
                    <FormHelperText>{`Street Address, P. O. Box, Company Name, c/o`}</FormHelperText>
                  </FormControl>
                  <FormControl marginBottom="24px">
                    <FormLabel>{`Address Line 2 (optional)`}</FormLabel>
                    <Input
                      value={doctorAddressLine2}
                      onChange={event => setDoctorAddressLine2(event.target.value)}
                    />
                    <FormHelperText>{`Apartment, suite, unit, building, floor, etc`}</FormHelperText>
                  </FormControl>
                  <FormControl isRequired marginBottom="24px">
                    <FormLabel>{`City`}</FormLabel>
                    <Input
                      value={doctorCity}
                      onChange={event => setDoctorCity(event.target.value)}
                    />
                    <FormHelperText>{`e.g. Vancouver`}</FormHelperText>
                  </FormControl>
                  <FormControl isRequired marginBottom="24px">
                    <FormLabel>{`Postal Code`}</FormLabel>
                    <Input
                      value={doctorPostalCode}
                      onChange={event => setDoctorPostalCode(event.target.value)}
                    />
                    <FormHelperText>{`e.g. X0X 0X0`}</FormHelperText>
                  </FormControl>
                  <FormControl isRequired marginBottom="24px">
                    <FormLabel>{`Phone Number`}</FormLabel>
                    <Input
                      type="tel"
                      value={doctorPhoneNumber}
                      onChange={event => setDoctorPhoneNumber(event.target.value)}
                    />
                    <FormHelperText>{`e.g. 555-555-5555`}</FormHelperText>
                  </FormControl>
                </Box>
              )}
              {invalidDoctor && <IncompleteSectionAlert />}
              <Flex width="100%" justifyContent="flex-end">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  marginRight="32px"
                >{`Previous`}</Button>
                <Button
                  variant="solid"
                  onClick={isReviewing ? goToReview : nextStep}
                  disabled={invalidDoctor}
                >
                  {isReviewing ? `Review request` : `Next`}
                </Button>
              </Flex>
            </Box>
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
            <Flex width="100%" justifyContent="flex-end">
              <Button variant="outline" onClick={prevStep} marginRight="32px">{`Previous`}</Button>
              <Button
                variant="solid"
                onClick={handleSubmit}
                loading={loading}
                disabled={
                  !applicantId ||
                  !certified ||
                  invalidPersonalAddress ||
                  invalidContact ||
                  invalidDoctor
                }
              >{`Proceed to payment`}</Button>
            </Flex>
          </Step>
        </Steps>
      </GridItem>
    </Layout>
  );
}
