import { Text, Stack, FormHelperText, Box, Divider, VStack } from '@chakra-ui/react'; // Chakra UI
import { DoctorFormData } from '@tools/admin/requests/doctor-information';
import TextField from '@components/form/TextField';

type DoctorInformationFormProps = {
  readonly doctorInformation: DoctorFormData;
};

/**
 * Form component for editing doctor information of request.
 * @param props - Props
 * @returns doctor information form.
 */
export default function DoctorInformationForm({ doctorInformation }: DoctorInformationFormProps) {
  return (
    <>
      {/* Personal Information Section */}
      <VStack spacing="24px" align="left" paddingBottom="32px">
        <Stack direction="row" spacing="20px">
          <TextField name="doctorInformation.firstName" label="First name" isRequired />
          <TextField name="doctorInformation.lastName" label="Last name" isRequired />
        </Stack>
        <Stack direction="row" spacing="20px">
          <TextField
            name="doctorInformation.mspNumber"
            label="Medical services plan number"
            isRequired
          />
          <TextField name="doctorInformation.phoneNumber" label="Phone number" isRequired>
            <FormHelperText color="text.secondary">{'Example: 000-000-0000'}</FormHelperText>
          </TextField>
        </Stack>
      </VStack>

      {doctorInformation && <Divider />}

      {/* Address Section */}

      <Box paddingY="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Address'}
          <Box as="span" textStyle="caption">
            {' (must be in British Columbia)'}
          </Box>
        </Text>

        <TextField name="doctorInformation.addressLine1" label="Address line 1" isRequired>
          <FormHelperText color="text.secondary">
            {'Street Address, P.O. Box, Company Name, c/o'}
          </FormHelperText>
        </TextField>

        <TextField name="doctorInformation.addressLine2" label="Address line 2">
          <Box as="span" textStyle="caption">
            {'(optional)'}
          </Box>
          <FormHelperText color="text.secondary">
            {'Apartment, suite, unit, building, floor, etc'}
          </FormHelperText>
        </TextField>

        <Stack direction="row" spacing="20px">
          <TextField name="doctorInformation.city" label="City" isRequired />
          <TextField name="doctorInformation.postalCode" label="Postal code" isRequired>
            <FormHelperText color="text.secondary">{'Example: X0X 0X0'} </FormHelperText>
          </TextField>
        </Stack>
      </Box>
    </>
  );
}
