import { Text, Stack, FormHelperText, Box, Divider } from '@chakra-ui/react'; // Chakra UI
import CheckboxField from '@components/form/CheckboxField';
import DateField from '@components/form/DateField';
import SelectField from '@components/form/SelectField';
import TextField from '@components/form/TextField';
import { PermitHolderFormData } from '@tools/admin/requests/permit-holder-information';

/**
 * PermitHolderInformationFormProps props for allowing users to edit permit holder information.
 */
type PermitHolderInformationFormProps = {
  readonly permitHolderInformation: PermitHolderFormData;
};

/**
 * PermitHolderInformationForm Component for allowing users to edit permit holder information.
 *
 * @param type indicates whether the form is being used for a replacement, new, or renewal request
 * @param {PermitHolderInformation} permitHolderInformation Data Structure that holds all permit holder information for a client request.
 * @param onChange Function that uses the updated values from form.
 */
export default function PermitHolderInformationForm(props: PermitHolderInformationFormProps) {
  return (
    <>
      {/* Personal Information Section */}
      <Box paddingBottom="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Personal Information'}
        </Text>
        <Stack direction="row" spacing="20px" paddingBottom="24px">
          <TextField name="permitHolder.firstName" label="First name" required />
          <TextField name="permitHolder.middleName" label="Middle name" />
          <TextField name="permitHolder.lastName" label="Last name" required />
        </Stack>

        {props.permitHolderInformation.type === 'NEW' && (
          <Stack direction="row" spacing="20px">
            <DateField name="permitHolder.dateOfBirth" label="Date of birth" required />

            {/* TODO: set otherGender if selected option is OTHER */}
            <SelectField
              name="permitHolder.gender"
              label="Gender"
              required
              placeholder="Select gender"
            >
              <option value={'MALE'}>{'Male'}</option>
              <option value={'FEMALE'}>{'Female'}</option>
              <option value={'OTHER'}>{'Other'}</option>
            </SelectField>
          </Stack>
        )}
      </Box>

      <Divider />

      {/* Contact Information Section */}

      <Box paddingY="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Contact Information'}
        </Text>

        <Stack direction="row" spacing="20px">
          <TextField name="permitHolder.phone" label="Phone number" required type="tel">
            <FormHelperText color="text.secondary">{'Example: 000-000-0000'}</FormHelperText>
          </TextField>
          <TextField name="permitHolder.email" label="Email address" labelHelperText="(optional)" />
        </Stack>

        {props.permitHolderInformation.type !== 'REPLACEMENT' && (
          <Box paddingTop="24px">
            <CheckboxField
              name="permitHolder.receiveEmailUpdates"
              isDisabled={!props.permitHolderInformation.email}
            >
              {'Permit holder would like to receive renewal updates through email'}
            </CheckboxField>
          </Box>
        )}
      </Box>

      <Divider />

      {/* Home Address Section */}

      <Box paddingTop="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Home Address '}
          <Box as="span" textStyle="caption">
            {'(must be in British Columbia)'}
          </Box>
        </Text>

        <Box paddingBottom="24px">
          <TextField name="permitHolder.addressLine1" label="Address line 1" required>
            <FormHelperText color="text.secondary">
              {'Street Address, P.O. Box, Company Name, c/o'}
            </FormHelperText>
          </TextField>
        </Box>

        <Box paddingBottom="24px">
          <TextField
            name="permitHolder.addressLine2"
            label="Address line 2"
            labelHelperText="(optional)"
          >
            <FormHelperText color="text.secondary">
              {'Apartment, suite, unit, building, floor, etc'}
            </FormHelperText>
          </TextField>
        </Box>
        <Stack direction="row" spacing="20px">
          <TextField name="permitHolder.city" label="City" required />
          <TextField name="permitHolder.postalCode" label="Postal code" required>
            <FormHelperText color="text.secondary">{'Example: X0X 0X0'} </FormHelperText>
          </TextField>
        </Stack>
      </Box>
    </>
  );
}
