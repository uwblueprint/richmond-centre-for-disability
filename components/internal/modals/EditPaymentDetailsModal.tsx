import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Text,
  Stack,
  FormHelperText,
  Radio,
  RadioGroup,
  Box,
  InputGroup,
  InputLeftElement,
  Checkbox,
  Select,
  Grid,
  GridItem,
} from '@chakra-ui/react'; // Chakra UI
import { useState, SyntheticEvent } from 'react'; // React

export default function EditPaymentDetailsModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [paymentMethod, setPaymentMethod] = useState('');
  const [donation, setDonation] = useState('');

  //   Shipping address information state
  const [hideShippingInfo, setHideShippingInfo] = useState(false); // Whether shipping information is visible
  const [shippingFullName, setShippingFullName] = useState('');
  const [shippingAddressLine1, setShippingAddressLine1] = useState('');
  const [shippingAddressLine2, setShippingAddressLine2] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingProvince, setShippingProvince] = useState('');
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingPostalCode, setShippingPostalCode] = useState('');

  //   TODO: Add error states for each field as follows
  // const [shippingFullNameInputError, setShippingFullNameInputError] = useState(''); // Error message displayed under input

  //   Billing address information state
  const [hideBillingInfo, setHideBillingInfo] = useState(false); // Whether billing information is visible
  const [billingFullName, setBillingFullName] = useState('');
  const [billingAddressLine1, setBillingAddressLine1] = useState('');
  const [billingAddressLine2, setBillingAddressLine2] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingProvince, setBillingProvince] = useState('');
  const [billingCountry, setBillingCountry] = useState('');
  const [billingPostalCode, setBillingPostalCode] = useState('');

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    // TODO: Add error handling to each field as follows
    // if (!hideShippingInfo) {
    //   if (!shippingFullName.length) {
    //     setShippingFullNameInputError("Please enter the recipient's full name.");
    //   }
    // }
  };

  return (
    <>
      {/* Button will be removed before merging */}
      <Button mt={3} onClick={onOpen}>
        Open
      </Button>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior="inside"
        size="3xl" // TODO: change to custom size
      >
        <ModalOverlay />
        <form onSubmit={handleSubmit}>
          <ModalContent paddingX="40px">
            <ModalHeader textStyle="display-medium-bold" paddingBottom="12px" paddingTop="24px">
              <Text textStyle="display-medium-bold">
                {'Edit Payment, Shipping and Billing Details'}
              </Text>
            </ModalHeader>
            <ModalBody paddingY="20px">
              <Box paddingBottom="32px">
                <Grid templateColumns="repeat(2, 1fr)" rowGap={'24px'}>
                  <GridItem rowSpan={2} colSpan={1}>
                    <FormControl as="fieldset" isRequired>
                      <FormLabel as="legend">{'Payment method'}</FormLabel>
                      <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
                        <Stack>
                          <Radio value="Mastercard">{'Mastercard'}</Radio>
                          <Radio value="Visa">{'Visa'}</Radio>
                          <Radio value="Debit">{'Debit'}</Radio>
                          <Radio value="Cash">{'Cash'}</Radio>
                          <Radio value="Cheque">{'Cheque'}</Radio>
                          <Radio value="E-transfer">{'E-transfer'}</Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl isRequired isDisabled>
                      <FormLabel>
                        {'Permit fee '}
                        <Box as="span" textStyle="body-regular">
                          {'(fixed cost)'}
                        </Box>
                      </FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none" color="#A3AEBE" fontSize="1.2em">
                          {'$'}
                        </InputLeftElement>
                        <Input placeholder="26" />
                      </InputGroup>
                      {/* TODO: Confirm if the helper text is wanted */}
                      <FormHelperText>{'fixed cost'}</FormHelperText>
                    </FormControl>
                  </GridItem>

                  <GridItem colSpan={1}>
                    <FormControl>
                      <FormLabel>
                        {'Donation '}
                        <Box as="span" textStyle="body-regular">
                          {'(optional)'}
                        </Box>
                      </FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none" color="#A3AEBE" fontSize="1.2em">
                          {'$'}
                        </InputLeftElement>
                        <Input
                          value={donation}
                          onChange={event => setDonation(event.target.value)}
                        />
                      </InputGroup>
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              <Box paddingY="32px">
                <Text textStyle="heading" paddingBottom="24px">
                  {'Shipping Address'}
                </Text>

                <Checkbox
                  paddingBottom="24px"
                  isChecked={hideShippingInfo}
                  onChange={event => setHideShippingInfo(event.target.checked)}
                >
                  {'Same as home address'}
                </Checkbox>

                {/* Section is hidden if same as home address checkbox is checked */}
                {!hideShippingInfo && (
                  <>
                    <FormControl isRequired paddingBottom="24px">
                      <FormLabel>{'Full name'}</FormLabel>
                      <Input
                        value={shippingFullName}
                        onChange={event => setShippingFullName(event.target.value)}
                      />
                    </FormControl>

                    <FormControl paddingBottom="24px">
                      <FormLabel>{'Address Line 1'}</FormLabel>
                      <Input
                        value={shippingAddressLine1}
                        onChange={event => setShippingAddressLine1(event.target.value)}
                      />
                      <FormHelperText color="#323741">
                        {'Street Address, P.O. Box, Company Name, c/o'}
                      </FormHelperText>
                    </FormControl>

                    <FormControl paddingBottom="24px">
                      <FormLabel>
                        {'Address Line 2 '}
                        <Box as="span" textStyle="body-regular">
                          {'(optional)'}
                        </Box>
                      </FormLabel>
                      <Input
                        value={shippingAddressLine2}
                        onChange={event => setShippingAddressLine2(event.target.value)}
                      />
                      <FormHelperText color="#323741">
                        {'Apartment, suite, unit, building, floor, etc'}
                      </FormHelperText>
                    </FormControl>

                    <Stack direction="row" spacing="20px">
                      <FormControl isRequired paddingBottom="24px">
                        <FormLabel>{'City'}</FormLabel>
                        <Input
                          value={shippingCity}
                          onChange={event => setShippingCity(event.target.value)}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>{'Province / Territory'}</FormLabel>
                        <Select
                          placeholder="Select provice / territory"
                          value={shippingProvince}
                          onChange={event => setShippingProvince(event.target.value)}
                        >
                          <option value="Ontario">{'Ontario'}</option>
                          <option value="British Columbia">{'British Columbia'}</option>
                          {/* TODO: Add rest of provinces */}
                        </Select>
                      </FormControl>
                    </Stack>

                    <Stack direction="row" spacing="20px">
                      <FormControl isRequired>
                        <FormLabel>{'Country / region'}</FormLabel>
                        <Select
                          value={shippingCountry}
                          onChange={event => setShippingCountry(event.target.value)}
                        >
                          <option value="Canada">{'Canada'}</option>
                          <option value="United States">{'United States'}</option>
                          {/* TODO: Add rest of countries */}
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>{'Postal code'}</FormLabel>
                        <Input
                          value={shippingPostalCode}
                          onChange={event => setShippingPostalCode(event.target.value)}
                        />
                      </FormControl>
                    </Stack>
                  </>
                )}
              </Box>

              <Box paddingTop="32px">
                <Text textStyle="heading" paddingBottom="24px">
                  {'Billing Address'}
                </Text>

                <Checkbox
                  paddingBottom="24px"
                  isChecked={hideBillingInfo}
                  onChange={event => setHideBillingInfo(event.target.checked)}
                >
                  {'Same as home address'}
                </Checkbox>

                {/* Section is hidden if same as home address checkbox is checked */}
                {!hideBillingInfo && (
                  <>
                    <FormControl isRequired paddingBottom="24px">
                      <FormLabel>{'Full name'}</FormLabel>
                      <Input
                        value={billingFullName}
                        onChange={event => setBillingFullName(event.target.value)}
                      />
                    </FormControl>

                    <FormControl isRequired paddingBottom="24px">
                      <FormLabel>{'Address Line 1'}</FormLabel>
                      <Input
                        value={billingAddressLine1}
                        onChange={event => setBillingAddressLine1(event.target.value)}
                      />
                      <FormHelperText color="#323741">
                        {'Street Address, P.O. Box, Company Name, c/o'}
                      </FormHelperText>
                    </FormControl>

                    <FormControl paddingBottom="24px">
                      <FormLabel>
                        {'Address Line 2 '}
                        <Box as="span" textStyle="body-regular">
                          {'(optional)'}
                        </Box>
                      </FormLabel>
                      <Input
                        value={billingAddressLine2}
                        onChange={event => setBillingAddressLine2(event.target.value)}
                      />
                      <FormHelperText color="#323741">
                        {'Apartment, suite, unit, building, floor, etc'}
                      </FormHelperText>
                    </FormControl>

                    <Stack direction="row" spacing="20px" paddingBottom="24px">
                      <FormControl isRequired>
                        <FormLabel>{'City'}</FormLabel>
                        <Input
                          value={billingCity}
                          onChange={event => setBillingCity(event.target.value)}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>{'Province / Territory'}</FormLabel>
                        <Select
                          placeholder="Select provice / territory"
                          value={billingProvince}
                          onChange={event => setBillingProvince(event.target.value)}
                        >
                          <option value="Ontario">{'Ontario'}</option>
                          <option value="British Columbia">{'British Columbia'}</option>
                          {/* TODO: Add rest of provinces */}
                        </Select>
                      </FormControl>
                    </Stack>

                    <Stack direction="row" spacing="20px">
                      <FormControl isRequired>
                        <FormLabel>{'Country / region'}</FormLabel>
                        <Select
                          value={billingCountry}
                          onChange={event => setBillingCountry(event.target.value)}
                        >
                          <option value="Canada">{'Canada'}</option>
                          <option value="United States">{'United States'}</option>
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>{'Postal code'}</FormLabel>
                        <Input
                          value={billingPostalCode}
                          onChange={event => setBillingPostalCode(event.target.value)}
                        />
                      </FormControl>
                    </Stack>
                  </>
                )}
              </Box>
            </ModalBody>
            <ModalFooter paddingBottom="24px">
              <Button colorScheme="gray" variant="solid" onClick={onClose}>
                {'Cancel'}
              </Button>
              <Button variant="solid" type="submit" ml={'12px'}>
                {'Save'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}
