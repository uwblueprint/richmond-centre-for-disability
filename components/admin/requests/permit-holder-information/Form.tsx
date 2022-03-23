import { Text, Stack, FormHelperText, Box, Divider } from '@chakra-ui/react'; // Chakra UI
import CheckboxField from '@components/form/CheckboxField';
import DateField from '@components/form/DateField';
import SelectField from '@components/form/SelectField';
import TextField from '@components/form/TextField';
// import { Gender } from '@lib/graphql/types';
// import { formatDateYYYYMMDD } from '@lib/utils/format';
import { PermitHolderFormData } from '@tools/admin/requests/permit-holder-information';
// import { ChangeEventHandler } from 'react';

/**
 * PermitHolderInformationFormProps props for allowing users to edit permit holder information.
 */
type PermitHolderInformationFormProps = {
  readonly permitHolderInformation: PermitHolderFormData;
  readonly onChange: (updatedData: PermitHolderFormData) => void;
};

/**
 * PermitHolderInformationForm Component for allowing users to edit permit holder information.
 *
 * @param type indicates whether the form is being used for a replacement, new, or renewal request
 * @param {PermitHolderInformation} permitHolderInformation Data Structure that holds all permit holder information for a client request.
 * @param onChange Function that uses the updated values from form.
 */
export default function PermitHolderInformationForm(props: PermitHolderInformationFormProps) {
  // const handleChange =
  //   (field: keyof PermitHolderFormData): ChangeEventHandler<HTMLInputElement> =>
  //   event => {
  //     const updatedFieldValue =
  //       event.target.type === 'checkbox' ? event.target.checked : event.target.value;
  //     props.onChange({
  //       ...props.permitHolderInformation,
  //       [field]: updatedFieldValue,
  //     });
  //   };

  return (
    <>
      {/* Personal Information Section */}
      <Box paddingBottom="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Personal Information'}
        </Text>
        <Stack direction="row" spacing="20px" paddingBottom="24px">
          <TextField name="firstName" label="First name" required />
          <TextField name="middleName" label="Middle name" />
          <TextField name="lastName" label="Last name" required />
        </Stack>

        {props.permitHolderInformation.type === 'NEW' && (
          <Stack direction="row" spacing="20px">
            <DateField name="dateOfBirth" label="Date of birth" required />
            {/* TODO: custom onchange */}
            {/* <FormControl isRequired>
              <FormLabel>{`Date of birth`}</FormLabel>
              <Input
                type="date"
                value={
                  props.permitHolderInformation.dateOfBirth
                    ? formatDateYYYYMMDD(props.permitHolderInformation.dateOfBirth)
                    : undefined
                }
                onChange={event => {
                  if (props.permitHolderInformation.type === 'NEW') {
                    props.onChange({
                      ...props.permitHolderInformation,
                      dateOfBirth: event.target.value,
                    });
                  }
                }}
              />
            </FormControl> */}

            {/* TODO: set otherGender if selected option is OTHER */}
            {/* TODO: custom onchange */}
            <SelectField name="gender" label="Gender" required placeholder="Select gender">
              <option value={'MALE'}>{'Male'}</option>
              <option value={'FEMALE'}>{'Female'}</option>
              <option value={'OTHER'}>{'Other'}</option>
            </SelectField>

            {/* <FormControl isRequired>
              <FormLabel>{`Gender`}</FormLabel>
              <Select
                placeholder="Select gender"
                value={props.permitHolderInformation.gender || undefined}
                onChange={event => {
                  if (props.permitHolderInformation.type === 'NEW') {
                    props.onChange({
                      ...props.permitHolderInformation,
                      gender: event.target.value as Gender,
                    });
                  }
                }}
              >
                <option value={'MALE'}>Male</option>
                <option value={'FEMALE'}>Female</option>
                <option value={'OTHER'}>Other</option>
              </Select>
            </FormControl> */}
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
          <TextField name="phone" label="Phone number" required type="tel">
            <FormHelperText color="text.secondary">{'Example: 000-000-0000'}</FormHelperText>
          </TextField>

          {/* TODO: (optional)  text beside label*/}
          <TextField name="email" label="Email address" labelHelperText="(optional)" />

          {/* <FormControl>
            <FormLabel>
              {'Email address '}
              <Box as="span" textStyle="body-regular" fontSize="sm">
                {'(optional)'}
              </Box>
            </FormLabel>
            <Input
              value={props.permitHolderInformation.email || ''}
              onChange={handleChange('email')}
            />
          </FormControl> */}
        </Stack>

        {/* TODO: fix condition */}
        {props.permitHolderInformation.type !== 'REPLACEMENT' && (
          <Box paddingTop="24px">
            <CheckboxField
              name="receiveEmailUpdates"
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
          <TextField name="addressLine1" label="Address line 1" required>
            <FormHelperText color="text.secondary">
              {'Street Address, P.O. Box, Company Name, c/o'}
            </FormHelperText>
          </TextField>
        </Box>

        <Box paddingBottom="24px">
          <TextField name="addressLine2" label="Address line 2" labelHelperText="(optional)">
            <FormHelperText color="text.secondary">
              {'Apartment, suite, unit, building, floor, etc'}
            </FormHelperText>
          </TextField>
        </Box>

        {/* <FormControl paddingBottom="24px">
          <FormLabel>
            {'Address line 2 '}
            <Box as="span" textStyle="caption" fontSize="sm">
              {'(optional)'}
            </Box>
          </FormLabel>
          <Input
            value={props.permitHolderInformation.addressLine2 || ''}
            onChange={handleChange('addressLine2')}
          />
          <FormHelperText color="text.secondary">
            {'Apartment, suite, unit, building, floor, etc'}
          </FormHelperText>
        </FormControl> */}

        <Stack direction="row" spacing="20px">
          <TextField name="city" label="City" required />

          <TextField name="postalCode" label="Postal code" required>
            <FormHelperText color="text.secondary">{'Example: X0X 0X0'} </FormHelperText>
          </TextField>
        </Stack>
      </Box>
    </>
  );
}
