import { useState, useEffect } from 'react'; // React
import Link from 'next/link'; // Next Link
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
} from '@chakra-ui/react'; // Chakra UI
import { Step, Steps } from 'chakra-ui-steps'; // Chakra UI Steps
import Layout from '@components/applicant/Layout'; // Layout component
import ReviewRequestField from '@components/applicant/renewals/ReviewRequestField'; // Field in Review Request section
import useSteps from '@tools/components/Steps/useSteps'; // Custom hook for managing steps state

export default function Renew() {
  // Steps state
  const { nextStep, prevStep, activeStep, goToStep } = useSteps({ initialStep: 0 });

  // Whether each section was updated
  const [updatedAddress, setUpdatedAddress] = useState(false); // Whether address was updated
  const [updatedContact, setUpdatedContact] = useState(false); // Whether contact info was updated
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
  const invalidContact = updatedContact && (!contactPhoneNumber || !contactEmailAddress);
  const invalidDoctor =
    updatedDoctor &&
    (!doctorFirstName ||
      !doctorLastName ||
      !doctorMspNumber ||
      !doctorAddressLine1 ||
      !doctorCity ||
      !doctorPostalCode ||
      !doctorPhoneNumber);

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
                  value={updatedContact ? '0' : '1'}
                  onChange={value => setUpdatedContact(value === '0' ? true : false)}
                >
                  <Stack direction="row">
                    <Radio value="0">{`Yes, I have`}</Radio>
                    <Radio value="1">{`No, I have not`}</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
              {/* Conditionally render form based on whether contact info was updated */}
              {updatedContact && (
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
                  <Flex marginBottom="24px">
                    <FormControl isRequired marginRight="48px">
                      <FormLabel>{`First Name`}</FormLabel>
                      <Input
                        value={doctorFirstName}
                        onChange={event => setDoctorFirstName(event.target.value)}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>{`Last Name`}</FormLabel>
                      <Input
                        value={doctorLastName}
                        onChange={event => setDoctorLastName(event.target.value)}
                      />
                    </FormControl>
                  </Flex>
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
                  <FormControl marginBottom="24px">
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
              {updatedContact ? (
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
                  <ReviewRequestField name={`First Name`} value={doctorFirstName} />
                  <ReviewRequestField name={`Last Name`} value={doctorLastName} />
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
                onClick={nextStep}
                disabled={!certified || invalidPersonalAddress || invalidContact || invalidDoctor}
              >{`Proceed to payment`}</Button>
            </Flex>
          </Step>
        </Steps>
      </GridItem>
    </Layout>
  );
}
