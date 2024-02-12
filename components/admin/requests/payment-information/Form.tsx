import { PaymentInformationFormData } from '@tools/admin/requests/payment-information';
import { Text, Stack, FormHelperText, Radio, Box, Grid, GridItem, Divider } from '@chakra-ui/react'; // Chakra UI
import { PaymentType } from '@lib/graphql/types';
import TextField from '@components/form/TextField';
import RadioGroupField from '@components/form/RadioGroupField';
import SelectField from '@components/form/SelectField';
import CheckboxField from '@components/form/CheckboxField';

type PaymentDetailsFormProps = {
  readonly paymentInformation: PaymentInformationFormData;
};

/**
 * PaymentDetailsForm Component for allowing users to edit payment details.
 *
 * @param {PaymentInformationFormData} paymentInformation Data Structure that holds all paymentInformation for a client request.
 */
export default function PaymentDetailsForm({ paymentInformation }: PaymentDetailsFormProps) {
  return (
    <>
      <Box paddingBottom="32px">
        <Grid templateColumns="repeat(2, 1fr)" rowGap={'24px'}>
          <GridItem rowSpan={2} colSpan={1}>
            <RadioGroupField
              name="paymentInformation.paymentMethod"
              label="Payment method"
              required
            >
              <Stack>
                <Radio value={'MASTERCARD' as PaymentType}>{'Mastercard'}</Radio>
                <Radio value={'VISA' as PaymentType}>{'Visa'}</Radio>
                <Radio value={'DEBIT' as PaymentType}>{'Debit'}</Radio>
                <Radio value={'CASH' as PaymentType}>{'Cash'}</Radio>
                <Radio value={'CHEQUE' as PaymentType}>{'Cheque'}</Radio>
                <Radio value={'ETRANSFER' as PaymentType}>{'E-transfer'}</Radio>
              </Stack>
            </RadioGroupField>
          </GridItem>

          <GridItem>
            <TextField name="paymentInformation.processingFee" label="Permit fee" monetaryInput />
          </GridItem>

          <GridItem colSpan={1}>
            <TextField
              name="paymentInformation.donationAmount"
              label={
                <>
                  {'Donation '}
                  <Box as="span" textStyle="body-regular" fontSize="sm">
                    {'(optional)'}
                  </Box>
                </>
              }
              monetaryInput
            />
          </GridItem>
        </Grid>

        <CheckboxField
          name="paymentInformation.hasSecondPaymentMethod"
          paddingTop="24px"
          paddingBottom="24px"
        >
          {'Add a second payment method'}
        </CheckboxField>

        {paymentInformation.hasSecondPaymentMethod && (
          <Grid templateColumns="repeat(2, 1fr)" rowGap={'24px'}>
            <GridItem rowSpan={2} colSpan={1}>
              <RadioGroupField
                name="paymentInformation.secondPaymentMethod"
                label="Second payment method"
              >
                <Stack>
                  <Radio value={'MASTERCARD' as PaymentType}>{'Mastercard'}</Radio>
                  <Radio value={'VISA' as PaymentType}>{'Visa'}</Radio>
                  <Radio value={'DEBIT' as PaymentType}>{'Debit'}</Radio>
                  <Radio value={'CASH' as PaymentType}>{'Cash'}</Radio>
                  <Radio value={'CHEQUE' as PaymentType}>{'Cheque'}</Radio>
                  <Radio value={'ETRANSFER' as PaymentType}>{'E-transfer'}</Radio>
                </Stack>
              </RadioGroupField>
            </GridItem>

            <GridItem>
              <TextField
                name="paymentInformation.secondProcessingFee"
                label="Permit fee"
                monetaryInput
              />
            </GridItem>

            <GridItem colSpan={1}>
              <TextField
                name="paymentInformation.secondDonationAmount"
                label={
                  <>
                    {'Donation '}
                    <Box as="span" textStyle="body-regular" fontSize="sm">
                      {'(optional)'}
                    </Box>
                  </>
                }
                monetaryInput
              />
            </GridItem>
          </Grid>
        )}
      </Box>

      <Divider />

      <Box paddingY="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Shipping Address'}
        </Text>

        <CheckboxField
          name="paymentInformation.shippingAddressSameAsHomeAddress"
          paddingBottom="24px"
        >
          {'Same as home address'}
        </CheckboxField>

        {/* Section is hidden if same as home address checkbox is checked */}
        {!paymentInformation.shippingAddressSameAsHomeAddress && (
          <>
            <Box paddingBottom="24px">
              <TextField name="paymentInformation.shippingFullName" label="Full name" required />
            </Box>

            <Box paddingBottom="24px">
              <TextField
                name="paymentInformation.shippingAddressLine1"
                label="Address line 1"
                required
              >
                <FormHelperText color="text.secondary">
                  {'Street Address, P.O. Box, Company Name, c/o'}
                </FormHelperText>
              </TextField>
            </Box>

            <Box paddingBottom="24px">
              <TextField name="paymentInformation.shippingAddressLine2" label="Address line 2">
                <FormHelperText color="text.secondary">
                  {'Apartment, suite, unit, building, floor, etc'}
                </FormHelperText>
              </TextField>
            </Box>

            <Stack direction="row" spacing="20px" paddingBottom="24px">
              <TextField name="paymentInformation.shippingCity" label="City" required />

              <SelectField
                name="paymentInformation.shippingProvince"
                label="Province / Territory"
                required
                placeholder="Select province / territory"
              >
                <option value={'ON'}>Ontario</option>
                <option value={'BC'}>British Columbia</option>
              </SelectField>
            </Stack>

            <Stack direction="row" spacing="20px">
              <TextField
                name="paymentInformation.shippingCountry"
                label="Country"
                required
                isDisabled
              />

              <TextField name="paymentInformation.shippingPostalCode" label="Postal code" required>
                <FormHelperText color="text.secondary">{'Example: X0X 0X0'} </FormHelperText>
              </TextField>
            </Stack>
          </>
        )}
      </Box>

      <Divider />

      <Box paddingTop="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Billing Address'}
        </Text>

        <CheckboxField
          name="paymentInformation.billingAddressSameAsHomeAddress"
          paddingBottom="24px"
        >
          {'Same as home address'}
        </CheckboxField>

        {/* Section is hidden if same as home address checkbox is checked */}
        {!paymentInformation.billingAddressSameAsHomeAddress && (
          <>
            <Box paddingBottom="24px">
              <TextField name="paymentInformation.billingFullName" label="Full name" required />
            </Box>

            <Box paddingBottom="24px">
              <TextField
                name="paymentInformation.billingAddressLine1"
                label="Address line 1"
                required
              >
                <FormHelperText color="text.secondary">
                  {'Street Address, P.O. Box, Company Name, c/o'}
                </FormHelperText>
              </TextField>
            </Box>

            <Box paddingBottom="24px">
              <TextField name="paymentInformation.billingAddressLine2" label="Address line 2">
                <FormHelperText color="text.secondary">
                  {'Apartment, suite, unit, building, floor, etc'}
                </FormHelperText>
              </TextField>
            </Box>

            <Stack direction="row" spacing="20px" paddingBottom="24px">
              <TextField name="paymentInformation.billingCity" label="City" required />

              <SelectField
                name="paymentInformation.billingProvince"
                label="Province / Territory"
                placeholder="Select province / territory"
                required
              >
                <option value={'ON'}>Ontario</option>
                <option value={'BC'}>British Columbia</option>
              </SelectField>
            </Stack>

            <Stack direction="row" spacing="20px">
              <TextField
                name="paymentInformation.billingCountry"
                label="Country"
                required
                isDisabled
              />

              <TextField name="paymentInformation.billingPostalCode" label="Postal code" required>
                <FormHelperText color="text.secondary">{'Example: X0X 0X0'} </FormHelperText>
              </TextField>
            </Stack>
          </>
        )}
      </Box>
    </>
  );
}
