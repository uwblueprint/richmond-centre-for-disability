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
import { useState, useEffect, SyntheticEvent, ReactNode } from 'react'; // React
import { PaymentType, Province } from '@lib/graphql/types'; // PaymentType Enum
import { PaymentInformation } from '@tools/components/internal/requests/payment-information-card'; // Applicant type

type EditPaymentDetailsModalProps = {
  readonly children: ReactNode;
  readonly paymentInformation: PaymentInformation;
  readonly handleSave: (applicationData: any) => void;
};

export default function EditPaymentDetailsModal({
  children,
  paymentInformation,
  handleSave,
}: EditPaymentDetailsModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [paymentMethod, setPaymentMethod] = useState<PaymentType>();
  const [donationAmount, setDonationAmount] = useState<number | undefined>();

  //   Shipping address information state
  const [shippingAddressSameAsHomeAddress, setShippingAddressSameAsHomeAddress] = useState(false);
  const [shippingFullName, setShippingFullName] = useState('');
  const [shippingAddressLine1, setShippingAddressLine1] = useState('');
  const [shippingAddressLine2, setShippingAddressLine2] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingProvince, setShippingProvince] = useState();
  // const [shippingCountry, setShippingCountry] = useState('');
  const [shippingPostalCode, setShippingPostalCode] = useState('');

  //   TODO: Add error states for each field as follows (post-mvp)
  // const [shippingFullNameInputError, setShippingFullNameInputError] = useState(''); // Error message displayed under input

  //   Billing address information state
  const [billingAddressSameAsHomeAddress, setBillingAddressSameAsHomeAddress] = useState(false);
  const [billingFullName, setBillingFullName] = useState('');
  const [billingAddressLine1, setBillingAddressLine1] = useState('');
  const [billingAddressLine2, setBillingAddressLine2] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingProvince, setBillingProvince] = useState();
  // const [billingCountry, setBillingCountry] = useState('');
  const [billingPostalCode, setBillingPostalCode] = useState('');

  useEffect(() => {
    setPaymentMethod(paymentInformation.paymentMethod);
    setDonationAmount(paymentInformation.donationAmount);

    setShippingAddressSameAsHomeAddress(paymentInformation.shippingAddressSameAsHomeAddress);
    setShippingFullName(paymentInformation.shippingFullName);
    setShippingAddressLine1(paymentInformation.shippingAddressLine1);
    setShippingAddressLine2(paymentInformation.shippingAddressLine2);
    setShippingCity(paymentInformation.shippingCity);
    setShippingProvince(paymentInformation.shippingProvince);
    // setShippingCountry(paymentInformation.shippingCountry);
    setShippingPostalCode(paymentInformation.shippingPostalCode);

    setBillingAddressSameAsHomeAddress(paymentInformation.billingAddressSameAsHomeAddress);
    setBillingFullName(paymentInformation.billingFullName);
    setBillingAddressLine1(paymentInformation.billingAddressLine1);
    setBillingAddressLine2(paymentInformation.billingAddressLine2);
    setBillingCity(paymentInformation.billingCity);
    setBillingProvince(paymentInformation.billingProvince);
    // setBillingCountry(paymentInformation.billingCountry);
    setBillingPostalCode(paymentInformation.billingPostalCode);
  }, [paymentInformation]);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    // TODO: Add error handling to each field as follows (post-mvp)
    // if (!hideShippingInfo) {
    //   if (!shippingFullName.length) {
    //     setShippingFullNameInputError("Please enter the recipient's full name.");
    //   }
    // }
    handleSave({
      ...(paymentMethod && { paymentMethod }),
      ...(donationAmount !== undefined && { donationAmount }),
      shippingAddressSameAsHomeAddress,
      shippingFullName,
      shippingAddressLine1,
      shippingAddressLine2,
      shippingCity,
      shippingProvince,
      // shippingCountry,
      shippingPostalCode,
      billingAddressSameAsHomeAddress,
      billingFullName,
      billingAddressLine1,
      billingAddressLine2,
      billingCity,
      billingProvince,
      // billingCountry,
      billingPostalCode,
    });
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
              <Text as="h2" textStyle="display-medium-bold">
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
                          value={donationAmount}
                          onChange={event => setDonationAmount(Number(event.target.value))}
                        />
                      </InputGroup>
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>

              <Divider borderColor="border.secondary" />

              <Box paddingY="32px">
                <Text as="h3" textStyle="heading" paddingBottom="24px">
                  {'Shipping Address'}
                </Text>

                <Checkbox
                  paddingBottom="24px"
                  isChecked={shippingAddressSameAsHomeAddress}
                  onChange={event => setShippingAddressSameAsHomeAddress(event.target.checked)}
                >
                  {'Same as home address'}
                </Checkbox>

                {/* Section is hidden if same as home address checkbox is checked */}
                {!shippingAddressSameAsHomeAddress && (
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
                          <option value={Province.On}>Ontario</option>
                          <option value={Province.Bc}>British Columbia</option>
                        </Select>
                      </FormControl>
                    </Stack>

                    <Stack direction="row" spacing="20px">
                      <FormControl isRequired>
                        <FormLabel>{'Postal code'}</FormLabel>
                        <Input
                          value={shippingPostalCode}
                          onChange={event => setShippingPostalCode(event.target.value)}
                        />
                        <FormHelperText color="text.seconday">{'Example: X0X 0X0'} </FormHelperText>
                      </FormControl>
                    </Stack>
                  </>
                )}
              </Box>

              <Divider borderColor="border.secondary" />

              <Box paddingTop="32px">
                <Text as="h3" textStyle="heading" paddingBottom="24px">
                  {'Billing Address'}
                </Text>

                <Checkbox
                  paddingBottom="24px"
                  isChecked={billingAddressSameAsHomeAddress}
                  onChange={event => setBillingAddressSameAsHomeAddress(event.target.checked)}
                >
                  {'Same as home address'}
                </Checkbox>

                {/* Section is hidden if same as home address checkbox is checked */}
                {!billingAddressSameAsHomeAddress && (
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
                          <option value={Province.On}>Ontario</option>
                          <option value={Province.Bc}>British Columbia</option>
                        </Select>
                      </FormControl>
                    </Stack>

                    <Stack direction="row" spacing="20px">
                      <FormControl isRequired>
                        <FormLabel>{'Postal code'}</FormLabel>
                        <Input
                          value={billingPostalCode}
                          onChange={event => setBillingPostalCode(event.target.value)}
                        />
                        <FormHelperText color="text.seconday">{'Example: X0X 0X0'} </FormHelperText>
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
