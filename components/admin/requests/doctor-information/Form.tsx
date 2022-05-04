import { Text, Stack, FormHelperText, Box, Divider, VStack } from '@chakra-ui/react'; // Chakra UI
import TextField from '@components/form/TextField';
import NumberField from '@components/form/NumberField';
import { DoctorFormData } from '@tools/admin/requests/doctor-information';

type DoctorInformationFormProps = {
  readonly doctorInformation: DoctorFormData;
};

/**
 * Form component for editing doctor information of request.
 * @param props - Props
 * @returns doctor information form.
 * @param onChange Function that uses the updated values from form.
 */
export default function DoctorInformationForm(props: DoctorInformationFormProps) {
  return (
    <>
      {/* Personal Information Section */}
      <VStack spacing="24px" align="left" paddingBottom="32px">
        <Stack direction="row" spacing="20px">
          <TextField name="doctor.firstName" label="First name" required />
          <TextField name="doctor.lastName" label="Last name" required />
        </Stack>
        <Stack direction="row" spacing="20px">
          <NumberField name="doctor.mspNumber" label="Medical services plan number" isRequired />
          <TextField name="doctor.phoneNumber" label="Phone number" isRequired>
            <FormHelperText color="text.secondary">{'Example: 000-000-0000'}</FormHelperText>
          </TextField>
        </Stack>
      </VStack>

      {props.doctorInformation && <Divider />}
      {/* TODO: DELETE ^^ LATER */}

      {/* Address Section */}

      <Box paddingY="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Address'}
          <Box as="span" textStyle="caption">
            {' (must be in British Columbia)'}
          </Box>
        </Text>

        <TextField name="doctor.addressLine1" label="Address line 1" required>
          <FormHelperText color="text.secondary">
            {'Street Address, P.O. Box, Company Name, c/o'}
          </FormHelperText>
        </TextField>

        <TextField name="doctor.addressLine2" label="Address line 2">
          <Box as="span" textStyle="caption">
            {'(optional)'}
          </Box>
          <FormHelperText color="text.secondary">
            {'Apartment, suite, unit, building, floor, etc'}
          </FormHelperText>
        </TextField>

        <Stack direction="row" spacing="20px">
          <TextField name="doctor.city" label="City" required />
          <TextField name="doctor.postalCode" label="Postal code" required>
            <FormHelperText color="text.secondary">{'Example: X0X 0X0'} </FormHelperText>
          </TextField>
        </Stack>
      </Box>
    </>
  );
}
