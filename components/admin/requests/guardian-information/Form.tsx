import { Text, Stack, FormHelperText, Box, Divider } from '@chakra-ui/react'; // Chakra UI
import { GuardianInformation } from '@tools/admin/requests/guardian-information';
import PoaFormUploadField from '@components/admin/requests/guardian-information/PoaFormUploadField';
import TextField from '@components/form/TextField';
import CheckboxField from '@components/form/CheckboxField';

type GuardianInformationFormProps = {
  readonly guardianInformation: GuardianInformation;
  readonly file: File | null;
  onUploadFile: (selectedFile: File) => void;
};

/**
 * GuardianInformationForm Component for allowing users to edit guardian information.
 *
 * @param {GuardianInformation} guardianInformation Object that holds all guardian information for a client request.
 */
export default function GuardianInformationForm({
  guardianInformation,
  file,
  onUploadFile,
}: GuardianInformationFormProps) {
  return (
    <>
      {/* Personal Information Section */}
      <Box paddingBottom="32px">
        <Stack direction="row" spacing="20px">
          <CheckboxField name="guardianInformation.omitGuardianPoa">
            {'No Guardian/POA'}
          </CheckboxField>
        </Stack>
        {!guardianInformation.omitGuardianPoa && (
          <>
            <Stack direction="row" spacing="20px" paddingTop="24px">
              <TextField name="guardianInformation.guardianFirstName" label="First name" required />
              <TextField name="guardianInformation.guardianMiddleName" label="Middle name" />
              <TextField name="guardianInformation.guardianLastName" label="Last name" required />
            </Stack>

            <Stack direction="row" spacing="20px" paddingTop="20px">
              <TextField name="guardianInformation.guardianPhone" label="Phone Number" required>
                <FormHelperText color="text.secondary">{'Example: 000-000-0000'}</FormHelperText>
              </TextField>

              <TextField
                name="guardianInformation.guardianRelationship"
                label="Relationship to applicant"
                required
              />
            </Stack>
          </>
        )}
      </Box>

      {!guardianInformation.omitGuardianPoa && (
        <>
          <Divider />

          {/* Address Section */}

          <Box paddingTop="32px">
            <Text as="h3" textStyle="heading" paddingBottom="24px">
              {'Address '}
            </Text>
            <TextField
              name="guardianInformation.guardianAddressLine1"
              label="Address line 1"
              required
            >
              <FormHelperText color="text.secondary">
                {'Street Address, P.O. Box, Company Name, c/o'}
              </FormHelperText>
            </TextField>
            <TextField name="guardianInformation.guardianAddressLine2" label="Address Line 2">
              <Box as="span" textStyle="caption" fontSize="sm">
                {'(optional)'}
              </Box>
              <FormHelperText color="text.secondary">
                {'Apartment, suite, unit, building, floor, etc'}
              </FormHelperText>
            </TextField>

            <Stack direction="row" spacing="20px">
              <TextField name="guardianInformation.guardianCity" label="City" required />
              <TextField name="guardianInformation.guardianPostalCode" label="Postal Code" required>
                <FormHelperText color="text.secondary">{'Example: X0X 0X0'}</FormHelperText>
              </TextField>
            </Stack>

            <PoaFormUploadField file={file} onUploadFile={onUploadFile} />
          </Box>
        </>
      )}
    </>
  );
}
