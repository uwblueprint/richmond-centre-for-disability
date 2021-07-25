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
  Divider,
} from '@chakra-ui/react'; // Chakra UI
import { useState, SyntheticEvent, ReactNode } from 'react'; // React
import { PaymentType } from '@lib/graphql/types'; // PaymentType Enum

type EditPaymentDetailsModalProps = {
  children: ReactNode;
};

export default function EditPaymentDetailsModal({ children }: EditPaymentDetailsModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [paymentMethod, setPaymentMethod] = useState<PaymentType | string>('');
  const [donation, setDonation] = useState('');

  //   Shipping address information state
  const [sameShippingAndHomeAddresses, setSameShippingAndHomeAddresses] = useState(false); // Whether shipping information is visible
  const [shippingFullName, setShippingFullName] = useState('');
  const [shippingAddressLine1, setShippingAddressLine1] = useState('');
  const [shippingAddressLine2, setShippingAddressLine2] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingProvince, setShippingProvince] = useState('');
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingPostalCode, setShippingPostalCode] = useState('');

  //   TODO: Add error states for each field as follows (post-mvp)
  // const [shippingFullNameInputError, setShippingFullNameInputError] = useState(''); // Error message displayed under input

  //   Billing address information state
  const [sameBillingAndHomeAddresses, setSameBillingAndHomeAddresses] = useState(false); // Whether billing information is visible
  const [billingFullName, setBillingFullName] = useState('');
  const [billingAddressLine1, setBillingAddressLine1] = useState('');
  const [billingAddressLine2, setBillingAddressLine2] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingProvince, setBillingProvince] = useState('');
  const [billingCountry, setBillingCountry] = useState('');
  const [billingPostalCode, setBillingPostalCode] = useState('');

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    // TODO: Will be addressed in API hookup
    // TODO: Add error handling to each field as follows (post-mvp)
    // if (!hideShippingInfo) {
    //   if (!shippingFullName.length) {
    //     setShippingFullNameInputError("Please enter the recipient's full name.");
    //   }
    // }
    onClose();
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior="inside"
        size="3xl" // TODO: change to custom size
      >
        <ModalOverlay />
        <form onSubmit={handleSubmit}>
          <ModalContent paddingX="36px">
            <ModalHeader
              textStyle="display-medium-bold"
              paddingBottom="12px"
              paddingTop="24px"
              paddingX="4px"
            >
              <Text textStyle="display-medium-bold">
                {'Edit Payment, Shipping and Billing Details'}
              </Text>
            </ModalHeader>
            <ModalBody paddingY="20px" paddingX="4px">
              <Box paddingBottom="32px">
                <Grid templateColumns="repeat(2, 1fr)" rowGap={'24px'}>
                  <GridItem rowSpan={2} colSpan={1}>
                    <FormControl as="fieldset" isRequired>
                      <FormLabel as="legend">{'Payment method'}</FormLabel>
                      <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
                        <Stack>
                          <Radio value={PaymentType.Mastercard}>{'Mastercard'}</Radio>
                          <Radio value={PaymentType.Visa}>{'Visa'}</Radio>
                          <Radio value={PaymentType.Debit}>{'Debit'}</Radio>
                          <Radio value={PaymentType.Cash}>{'Cash'}</Radio>
                          <Radio value={PaymentType.Cheque}>{'Cheque'}</Radio>
                          <Radio value={PaymentType.Etransfer}>{'E-transfer'}</Radio>
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
                        <InputLeftElement
                          pointerEvents="none"
                          color="texticon.filler"
                          fontSize="1.2em"
                        >
                          {'$'}
                        </InputLeftElement>
                        <Input placeholder="26" />
                      </InputGroup>
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
                        <InputLeftElement
                          pointerEvents="none"
                          color="texticon.filler"
                          fontSize="1.2em"
                        >
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

              {/* TODO: Customize Divider to change color  */}
              <Divider />

              <Box paddingY="32px">
                <Text textStyle="heading" paddingBottom="24px">
                  {'Shipping Address'}
                </Text>

                <Checkbox
                  paddingBottom="24px"
                  isChecked={sameShippingAndHomeAddresses}
                  onChange={event => setSameShippingAndHomeAddresses(event.target.checked)}
                >
                  {'Same as home address'}
                </Checkbox>

                {/* Section is hidden if same as home address checkbox is checked */}
                {!sameShippingAndHomeAddresses && (
                  <>
                    <FormControl isRequired paddingBottom="24px">
                      <FormLabel>{'Full name'}</FormLabel>
                      <Input
                        value={shippingFullName}
                        onChange={event => setShippingFullName(event.target.value)}
                      />
                    </FormControl>

                    <FormControl isRequired paddingBottom="24px">
                      <FormLabel>{'Address line 1'}</FormLabel>
                      <Input
                        value={shippingAddressLine1}
                        onChange={event => setShippingAddressLine1(event.target.value)}
                      />
                      <FormHelperText color="text.seconday">
                        {'Street Address, P.O. Box, Company Name, c/o'}
                      </FormHelperText>
                    </FormControl>

                    <FormControl paddingBottom="24px">
                      <FormLabel>
                        {'Address line 2 '}
                        <Box as="span" textStyle="body-regular">
                          {'(optional)'}
                        </Box>
                      </FormLabel>
                      <Input
                        value={shippingAddressLine2}
                        onChange={event => setShippingAddressLine2(event.target.value)}
                      />
                      <FormHelperText color="text.seconday">
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
                        <FormLabel>{'Province / territory'}</FormLabel>
                        <Select
                          placeholder="Select province / territory"
                          value={shippingProvince}
                          onChange={event => setShippingProvince(event.target.value)}
                        >
                          <option value="Ontario">{'Ontario'}</option>
                          <option value="British Columbia">{'British Columbia'}</option>
                          {/* TODO: when we add the rest of the provinces, use the Province enum in lib/graphql/types.ts */}
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

              {/* TODO: Customize Divider to change color  */}
              <Divider />

              <Box paddingTop="32px">
                <Text textStyle="heading" paddingBottom="24px">
                  {'Billing Address'}
                </Text>

                <Checkbox
                  paddingBottom="24px"
                  isChecked={sameBillingAndHomeAddresses}
                  onChange={event => setSameBillingAndHomeAddresses(event.target.checked)}
                >
                  {'Same as home address'}
                </Checkbox>

                {/* Section is hidden if same as home address checkbox is checked */}
                {!sameBillingAndHomeAddresses && (
                  <>
                    <FormControl isRequired paddingBottom="24px">
                      <FormLabel>{'Full name'}</FormLabel>
                      <Input
                        value={billingFullName}
                        onChange={event => setBillingFullName(event.target.value)}
                      />
                    </FormControl>

                    <FormControl isRequired paddingBottom="24px">
                      <FormLabel>{'Address line 1'}</FormLabel>
                      <Input
                        value={billingAddressLine1}
                        onChange={event => setBillingAddressLine1(event.target.value)}
                      />
                      <FormHelperText color="text.seconday">
                        {'Street Address, P.O. Box, Company Name, c/o'}
                      </FormHelperText>
                    </FormControl>

                    <FormControl paddingBottom="24px">
                      <FormLabel>
                        {'Address line 2 '}
                        <Box as="span" textStyle="body-regular">
                          {'(optional)'}
                        </Box>
                      </FormLabel>
                      <Input
                        value={billingAddressLine2}
                        onChange={event => setBillingAddressLine2(event.target.value)}
                      />
                      <FormHelperText color="text.seconday">
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
                        <FormLabel>{'Province / territory'}</FormLabel>
                        <Select
                          placeholder="Select province / territory"
                          value={billingProvince}
                          onChange={event => setBillingProvince(event.target.value)}
                        >
                          <option value="Ontario">{'Ontario'}</option>
                          <option value="British Columbia">{'British Columbia'}</option>
                          {/* TODO: when we add the rest of the provinces, use the Province enum in lib/graphql/types.ts */}
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
            <ModalFooter paddingBottom="24px" paddingX="4px">
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
