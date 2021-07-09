import { useState } from 'react'; // React
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
} from '@chakra-ui/react'; // Chakra UI
import { Step, Steps, useSteps } from 'chakra-ui-steps'; // Chakra UI Steps
import Layout from '@components/applicant/Layout'; // Layout component

export default function Renew() {
  // Steps state
  const { nextStep, prevStep, activeStep } = useSteps({ initialStep: 0 });

  // Form state
  const [updatedAddress, setUpdatedAddress] = useState(false); // Whether address was updated
  const [updatedContact, setUpdatedContact] = useState(false); // Whether contact info was updated
  const [updatedDoctor, setUpdatedDoctor] = useState(false); // Whether doctor info was updated

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
                    <Input />
                    <FormHelperText>{`Street Address, P. O. Box, Company Name, c/o`}</FormHelperText>
                  </FormControl>
                  <FormControl isRequired marginBottom="24px">
                    <FormLabel>{`Address Line 2`}</FormLabel>
                    <Input />
                    <FormHelperText>{`Apartment, suite, unit, building, floor, etc`}</FormHelperText>
                  </FormControl>
                  <FormControl isRequired marginBottom="24px">
                    <FormLabel>{`City`}</FormLabel>
                    <Input />
                  </FormControl>
                  <FormControl isRequired marginBottom="24px">
                    <FormLabel>{`Postal Code`}</FormLabel>
                    <Input />
                    <FormHelperText>{`e.g. X0X 0X0`}</FormHelperText>
                  </FormControl>
                </Box>
              )}
              <Flex width="100%" justifyContent="flex-end">
                <Button variant="solid" onClick={nextStep}>{`Continue`}</Button>
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
                    <Input type="tel" />
                    <FormHelperText>{`e.g. 555-555-5555`}</FormHelperText>
                  </FormControl>
                  <FormControl marginBottom="24px">
                    <FormLabel>{`Email Address`}</FormLabel>
                    <Input />
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
                <Button variant="solid" onClick={nextStep}>{`Next`}</Button>
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
                      <Input />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>{`Last Name`}</FormLabel>
                      <Input />
                    </FormControl>
                  </Flex>
                  <FormControl isRequired marginBottom="24px">
                    <FormLabel>{`Your Doctor's Medical Services Plan (MSP) Number`}</FormLabel>
                    <NumberInput width="184px">
                      <NumberInputField />
                    </NumberInput>
                    <FormHelperText>
                      {`Your Doctor has a unique Medical Services Plan Number. If you do not know
                      where to find it, please contact your doctor.`}
                    </FormHelperText>
                  </FormControl>
                  <FormControl isRequired marginBottom="24px">
                    <FormLabel>{`Address Line 1`}</FormLabel>
                    <Input />
                    <FormHelperText>{`Street Address, P. O. Box, Company Name, c/o`}</FormHelperText>
                  </FormControl>
                  <FormControl isRequired marginBottom="24px">
                    <FormLabel>{`Address Line 2`}</FormLabel>
                    <Input />
                    <FormHelperText>{`Apartment, suite, unit, building, floor, etc`}</FormHelperText>
                  </FormControl>
                  <FormControl isRequired marginBottom="24px">
                    <FormLabel>{`City`}</FormLabel>
                    <Input />
                    <FormHelperText>{`e.g. Vancouver`}</FormHelperText>
                  </FormControl>
                  <FormControl isRequired marginBottom="24px">
                    <FormLabel>{`Postal Code`}</FormLabel>
                    <Input />
                    <FormHelperText>{`e.g. X0X 0X0`}</FormHelperText>
                  </FormControl>
                  <FormControl marginBottom="24px">
                    <FormLabel>{`Phone Number`}</FormLabel>
                    <Input type="tel" />
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
                <Button variant="solid" onClick={nextStep}>{`Continue`}</Button>
              </Flex>
            </Box>
          </Step>
          <Step label={`Review Request`}></Step>
        </Steps>
      </GridItem>
    </Layout>
  );
}
