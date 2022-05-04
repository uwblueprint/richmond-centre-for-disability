import { Text, Stack, FormHelperText, Box, Divider, VStack } from '@chakra-ui/react'; // Chakra UI
import TextField from '@components/form/TextField';

/**
 * Form component for editing doctor information of request.
 * @param props - Props
 * @returns doctor information form.
 */
export default function DoctorInformationForm() {
  return (
    <>
      {/* Personal Information Section */}
      <VStack spacing="24px" align="left" paddingBottom="32px">
        <Stack direction="row" spacing="20px">
          <TextField name="doctorInformation.firstName" label="First name" required />
          <TextField name="doctorInformation.lastName" label="Last name" required />
        </Stack>
        <Stack direction="row" spacing="20px">
          <TextField
            name="doctorInformation.mspNumber"
            label="Medical services plan number"
            required
          />
          <TextField name="doctorInformation.phone" label="Phone number" required>
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
        <Box paddingBottom="24px">
          <TextField name="doctorInformation.addressLine1" label="Address line 1" required>
            <FormHelperText color="text.secondary">
              {'Street Address, P.O. Box, Company Name, c/o'}
            </FormHelperText>
          </TextField>
        </Box>

        <Box paddingBottom="24px">
          <TextField
            name="doctorInformation.addressLine2"
            label={
              <>
                {'Address line 2 '}
                <Box as="span" textStyle="body-regular" fontSize="sm">
                  {'(optional)'}
                </Box>
              </>
            }
          >
            <FormHelperText color="text.secondary">
              {'Apartment, suite, unit, building, floor, etc'}
            </FormHelperText>
          </TextField>
        </Box>

        <Stack direction="row" spacing="20px">
          <TextField name="doctorInformation.city" label="City" required />
          <TextField name="doctorInformation.postalCode" label="Postal code" required>
            <FormHelperText color="text.secondary">{'Example: X0X 0X0'} </FormHelperText>
          </TextField>
        </Stack>
      </Box>
    </>
  );
}
