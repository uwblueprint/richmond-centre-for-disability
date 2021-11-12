import { PaymentDetails } from '@tools/components/admin/requests/forms/types';
import {
  FormControl,
  FormLabel,
  Input,
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
import { PaymentType, Province } from '@lib/graphql/types';

type PaymentDetailsFormProps = {
  readonly paymentInformation: PaymentDetails;
  readonly onChange: (updatedData: PaymentDetails) => void;
};

/**
 * PaymentDetailsForm Component for allowing users to edit payment details.
 *
 * @param {PaymentDetails} paymentInformation Data Structure that holds all paymentInformation for a client request.
 * @param {onChangeCallback} onChange Function that uses the updated values from form.
 */
export default function PaymentDetailsForm({
  paymentInformation,
  onChange,
}: PaymentDetailsFormProps) {
  const {
    paymentMethod,
    donationAmount,
    shippingAddressSameAsHomeAddress,
    shippingFullName,
    shippingAddressLine1,
    shippingAddressLine2,
    shippingCity,
    shippingProvince,
    shippingPostalCode,
    billingAddressSameAsHomeAddress,
    billingFullName,
    billingAddressLine1,
    billingAddressLine2,
    billingCity,
    billingProvince,
    billingPostalCode,
  } = paymentInformation;
  return (
    <>
      <Box paddingBottom="32px">
        <Grid templateColumns="repeat(2, 1fr)" rowGap={'24px'}>
          <GridItem rowSpan={2} colSpan={1}>
            <FormControl as="fieldset" isRequired>
              <FormLabel as="legend">{'Payment method'}</FormLabel>
              <RadioGroup
                onChange={value =>
                  onChange({
                    ...paymentInformation,
                    paymentMethod: value as PaymentType,
                  })
                }
                value={paymentMethod}
              >
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
                <InputLeftElement pointerEvents="none" color="texticon.filler" fontSize="1.2em">
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
                <Box as="span" textStyle="body-regular" fontSize="sm">
                  {'(optional)'}
                </Box>
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none" color="texticon.filler" fontSize="1.2em">
                  {'$'}
                </InputLeftElement>
                <Input
                  value={donationAmount || 0}
                  onChange={event =>
                    onChange({
                      ...paymentInformation,
                      donationAmount: parseInt(event.target.value),
                    })
                  }
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
          onChange={event =>
            onChange({
              ...paymentInformation,
              shippingAddressSameAsHomeAddress: event.target.checked,
            })
          }
        >
          {'Same as home address'}
        </Checkbox>

        {/* Section is hidden if same as home address checkbox is checked */}
        {!shippingAddressSameAsHomeAddress && (
          <>
            <FormControl isRequired paddingBottom="24px">
              <FormLabel>{'Full name'}</FormLabel>
              <Input
                value={shippingFullName || ''}
                onChange={event =>
                  onChange({
                    ...paymentInformation,
                    shippingFullName: event.target.value,
                  })
                }
              />
            </FormControl>

            <FormControl isRequired paddingBottom="24px">
              <FormLabel>{'Address line 1'}</FormLabel>
              <Input
                value={shippingAddressLine1 || ''}
                onChange={event =>
                  onChange({
                    ...paymentInformation,
                    shippingAddressLine1: event.target.value,
                  })
                }
              />
              <FormHelperText color="text.seconday">
                {'Street Address, P.O. Box, Company Name, c/o'}
              </FormHelperText>
            </FormControl>

            <FormControl paddingBottom="24px">
              <FormLabel>
                {'Address line 2 '}
                <Box as="span" textStyle="body-regular" fontSize="sm">
                  {'(optional)'}
                </Box>
              </FormLabel>
              <Input
                value={shippingAddressLine2 || ''}
                onChange={event =>
                  onChange({
                    ...paymentInformation,
                    shippingAddressLine2: event.target.value,
                  })
                }
              />
              <FormHelperText color="text.seconday">
                {'Apartment, suite, unit, building, floor, etc'}
              </FormHelperText>
            </FormControl>

            <Stack direction="row" spacing="20px">
              <FormControl isRequired paddingBottom="24px">
                <FormLabel>{'City'}</FormLabel>
                <Input
                  value={shippingCity || ''}
                  onChange={event =>
                    onChange({
                      ...paymentInformation,
                      shippingCity: event.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>{'Province / Territory'}</FormLabel>
                <Select
                  placeholder="Select province / territory"
                  value={shippingProvince || undefined}
                  onChange={event =>
                    onChange({
                      ...paymentInformation,
                      shippingProvince: event.target.value as Province,
                    })
                  }
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
                  value={shippingPostalCode || ''}
                  onChange={event =>
                    onChange({
                      ...paymentInformation,
                      shippingPostalCode: event.target.value,
                    })
                  }
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
          onChange={event =>
            onChange({
              ...paymentInformation,
              billingAddressSameAsHomeAddress: event.target.checked,
            })
          }
        >
          {'Same as home address'}
        </Checkbox>

        {/* Section is hidden if same as home address checkbox is checked */}
        {!billingAddressSameAsHomeAddress && (
          <>
            <FormControl isRequired paddingBottom="24px">
              <FormLabel>{'Full name'}</FormLabel>
              <Input
                value={billingFullName || ''}
                onChange={event =>
                  onChange({
                    ...paymentInformation,
                    billingFullName: event.target.value,
                  })
                }
              />
            </FormControl>

            <FormControl isRequired paddingBottom="24px">
              <FormLabel>{'Address line 1'}</FormLabel>
              <Input
                value={billingAddressLine1 || ''}
                onChange={event =>
                  onChange({
                    ...paymentInformation,
                    billingAddressLine1: event.target.value,
                  })
                }
              />
              <FormHelperText color="text.seconday">
                {'Street Address, P.O. Box, Company Name, c/o'}
              </FormHelperText>
            </FormControl>

            <FormControl paddingBottom="24px">
              <FormLabel>
                {'Address line 2 '}
                <Box as="span" textStyle="body-regular" fontSize="sm">
                  {'(optional)'}
                </Box>
              </FormLabel>
              <Input
                value={billingAddressLine2 || ''}
                onChange={event =>
                  onChange({
                    ...paymentInformation,
                    billingAddressLine2: event.target.value,
                  })
                }
              />
              <FormHelperText color="text.seconday">
                {'Apartment, suite, unit, building, floor, etc'}
              </FormHelperText>
            </FormControl>

            <Stack direction="row" spacing="20px" paddingBottom="24px">
              <FormControl isRequired>
                <FormLabel>{'City'}</FormLabel>
                <Input
                  value={billingCity || ''}
                  onChange={event =>
                    onChange({
                      ...paymentInformation,
                      billingCity: event.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>{'Province / Territory'}</FormLabel>
                <Select
                  placeholder="Select province / territory"
                  value={billingProvince || undefined}
                  onChange={event =>
                    onChange({
                      ...paymentInformation,
                      billingProvince: event.target.value as Province,
                    })
                  }
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
                  value={billingPostalCode || ''}
                  onChange={event =>
                    onChange({
                      ...paymentInformation,
                      billingPostalCode: event.target.value,
                    })
                  }
                />
                <FormHelperText color="text.seconday">{'Example: X0X 0X0'} </FormHelperText>
              </FormControl>
            </Stack>
          </>
        )}
      </Box>
    </>
  );
}
