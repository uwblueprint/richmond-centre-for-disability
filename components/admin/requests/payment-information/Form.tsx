import { PaymentInformationFormData } from '@tools/admin/requests/payment-information';
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
import { ChangeEventHandler } from 'react';

type PaymentDetailsFormProps = {
  readonly paymentInformation: PaymentInformationFormData;
  readonly onChange: (updatedData: PaymentInformationFormData) => void;
};

/**
 * PaymentDetailsForm Component for allowing users to edit payment details.
 *
 * @param {PaymentInformationFormData} paymentInformation Data Structure that holds all paymentInformation for a client request.
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
    shippingCountry,
    shippingPostalCode,
    billingAddressSameAsHomeAddress,
    billingFullName,
    billingAddressLine1,
    billingAddressLine2,
    billingCity,
    billingProvince,
    billingCountry,
    billingPostalCode,
  } = paymentInformation;

  const handleChange =
    (field: keyof PaymentInformationFormData): ChangeEventHandler<HTMLInputElement> =>
    event => {
      const updatedFieldValue =
        event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      onChange({
        ...paymentInformation,
        [field]: updatedFieldValue,
      });
    };

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
                  <Radio value={'MASTERCARD' as PaymentType}>{'Mastercard'}</Radio>
                  <Radio value={'VISA' as PaymentType}>{'Visa'}</Radio>
                  <Radio value={'DEBIT' as PaymentType}>{'Debit'}</Radio>
                  <Radio value={'CASH' as PaymentType}>{'Cash'}</Radio>
                  <Radio value={'CHEQUE' as PaymentType}>{'Cheque'}</Radio>
                  <Radio value={'E_TRANSFER' as PaymentType}>{'E-transfer'}</Radio>
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
                <Input value={donationAmount || 0} onChange={handleChange('donationAmount')} />
              </InputGroup>
            </FormControl>
          </GridItem>
        </Grid>
      </Box>

      <Divider />

      <Box paddingY="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Shipping Address'}
        </Text>

        <Checkbox
          paddingBottom="24px"
          isChecked={shippingAddressSameAsHomeAddress}
          onChange={handleChange('shippingAddressSameAsHomeAddress')}
        >
          {'Same as home address'}
        </Checkbox>

        {/* Section is hidden if same as home address checkbox is checked */}
        {!shippingAddressSameAsHomeAddress && (
          <>
            <FormControl isRequired paddingBottom="24px">
              <FormLabel>{'Full name'}</FormLabel>
              <Input value={shippingFullName || ''} onChange={handleChange('shippingFullName')} />
            </FormControl>

            <FormControl isRequired paddingBottom="24px">
              <FormLabel>{'Address line 1'}</FormLabel>
              <Input
                value={shippingAddressLine1 || ''}
                onChange={handleChange('shippingAddressLine1')}
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
                onChange={handleChange('shippingAddressLine2')}
              />
              <FormHelperText color="text.seconday">
                {'Apartment, suite, unit, building, floor, etc'}
              </FormHelperText>
            </FormControl>

            <Stack direction="row" spacing="20px">
              <FormControl isRequired paddingBottom="24px">
                <FormLabel>{'City'}</FormLabel>
                <Input value={shippingCity} onChange={handleChange('shippingCity')} />
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
                  <option value={'ON'}>Ontario</option>
                  <option value={'BC'}>British Columbia</option>
                </Select>
              </FormControl>
            </Stack>

            <Stack direction="row" spacing="20px">
              {/* TODO: Replace with dropdown */}
              <FormControl isRequired>
                <FormLabel>{'Country'}</FormLabel>
                <Input value={shippingCountry} onChange={handleChange('shippingCountry')} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>{'Postal code'}</FormLabel>
                <Input value={shippingPostalCode} onChange={handleChange('shippingPostalCode')} />
                <FormHelperText color="text.seconday">{'Example: X0X 0X0'} </FormHelperText>
              </FormControl>
            </Stack>
          </>
        )}
      </Box>

      <Divider />

      <Box paddingTop="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Billing Address'}
        </Text>

        <Checkbox
          paddingBottom="24px"
          isChecked={billingAddressSameAsHomeAddress}
          onChange={handleChange('billingAddressSameAsHomeAddress')}
        >
          {'Same as home address'}
        </Checkbox>

        {/* Section is hidden if same as home address checkbox is checked */}
        {!billingAddressSameAsHomeAddress && (
          <>
            <FormControl isRequired paddingBottom="24px">
              <FormLabel>{'Full name'}</FormLabel>
              <Input value={billingFullName || ''} onChange={handleChange('billingFullName')} />
            </FormControl>

            <FormControl isRequired paddingBottom="24px">
              <FormLabel>{'Address line 1'}</FormLabel>
              <Input
                value={billingAddressLine1 || ''}
                onChange={handleChange('billingAddressLine1')}
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
                onChange={handleChange('billingAddressLine2')}
              />
              <FormHelperText color="text.seconday">
                {'Apartment, suite, unit, building, floor, etc'}
              </FormHelperText>
            </FormControl>

            <Stack direction="row" spacing="20px" paddingBottom="24px">
              <FormControl isRequired>
                <FormLabel>{'City'}</FormLabel>
                <Input value={billingCity} onChange={handleChange('billingCity')} />
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
                  <option value={'ON'}>Ontario</option>
                  <option value={'BC'}>British Columbia</option>
                </Select>
              </FormControl>
            </Stack>

            <Stack direction="row" spacing="20px">
              {/* TODO: Replace with dropdown */}
              <FormControl isRequired>
                <FormLabel>{'Country'}</FormLabel>
                <Input value={billingCountry} onChange={handleChange('billingCountry')} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>{'Postal code'}</FormLabel>
                <Input
                  value={billingPostalCode || ''}
                  onChange={handleChange('billingPostalCode')}
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
