import { Box, FormHelperText, Stack } from '@chakra-ui/react';
import CheckboxField from '@components/form/CheckboxField';
import SelectField from '@components/form/SelectField';
import TextField from '@components/form/TextField';
import { BillingInformationFormData } from '@tools/admin/requests/payment-information';

type Props = {
  readonly billingInformation: BillingInformationFormData;
};

export default function BillingInformationForm({ billingInformation }: Props) {
  return (
    <Box>
      <CheckboxField name="billingInformation.billingAddressSameAsHomeAddress" paddingBottom="24px">
        Same as home address
      </CheckboxField>

      {!billingInformation.billingAddressSameAsHomeAddress && (
        <>
          <Box paddingBottom="24px">
            <TextField name="billingInformation.billingFullName" label="Full name" required />
          </Box>

          <Box paddingBottom="24px">
            <TextField
              name="billingInformation.billingAddressLine1"
              label="Address line 1"
              required
            >
              <FormHelperText color="text.secondary">
                Street Address, P.O. Box, Company Name, c/o
              </FormHelperText>
            </TextField>
          </Box>

          <Box paddingBottom="24px">
            <TextField name="billingInformation.billingAddressLine2" label="Address line 2">
              <FormHelperText color="text.secondary">
                Apartment, suite, unit, building, floor, etc.
              </FormHelperText>
            </TextField>
          </Box>

          <Stack direction="row" spacing="20px" paddingBottom="24px">
            <TextField name="billingInformation.billingCity" label="City" required />
            <SelectField
              name="billingInformation.billingProvince"
              label="Province / Territory"
              placeholder="Select province / territory"
              required
            >
              <option value="ON">Ontario</option>
              <option value="BC">British Columbia</option>
            </SelectField>
          </Stack>

          <Stack direction="row" spacing="20px">
            <TextField
              name="billingInformation.billingCountry"
              label="Country"
              required
              isDisabled
            />
            <TextField name="billingInformation.billingPostalCode" label="Postal code" required>
              <FormHelperText color="text.secondary">Example: X0X 0X0</FormHelperText>
            </TextField>
          </Stack>
        </>
      )}
    </Box>
  );
}
