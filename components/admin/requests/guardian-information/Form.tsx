import { Text, Stack, FormHelperText, Box, Divider, Checkbox } from '@chakra-ui/react'; // Chakra UI
import { GuardianInformation } from '@tools/admin/requests/guardian-information';
import { ChangeEventHandler } from 'react';
import PoaFormUploadField from '@components/admin/requests/guardian-information/PoaFormUploadField';
import TextField from '@components/form/TextField';

type GuardianInformationFormProps = {
  readonly guardianInformation: GuardianInformation;
  readonly onChange: (updatedData: GuardianInformation) => void;
  readonly file: File | null;
  onUploadFile: (selectedFile: File) => void;
};

/**
 * GuardianInformationForm Component for allowing users to edit guardian information.
 *
 * @param {GuardianInformation} guardianInformation Object that holds all guardian information for a client request.
 * @param onChange Function that uses the updated values from form.
 */
export default function GuardianInformationForm({
  guardianInformation,
  onChange,
  file,
  onUploadFile,
}: GuardianInformationFormProps) {
  const handleChange =
    (field: keyof GuardianInformation): ChangeEventHandler<HTMLInputElement> =>
    event => {
      onChange({
        ...guardianInformation,
        [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
      });
    };

  return (
    <>
      {/* Personal Information Section */}
      <Box paddingBottom="32px">
        <Stack direction="row" spacing="20px">
          <Checkbox
            isChecked={guardianInformation.omitGuardianPoa}
            onChange={handleChange('omitGuardianPoa')}
          >
            {'No Guardian/POA'}
          </Checkbox>
        </Stack>
        {!guardianInformation.omitGuardianPoa && (
          <>
            <Stack direction="row" spacing="20px" paddingTop="24px">
              <TextField name="firstName" label="First Name" required={true} />
              <TextField name="middleName" label="Middle Name" />
              <TextField name="lastName" label="Last Name" required={true} />
            </Stack>

            <Stack direction="row" spacing="20px" paddingTop="20px">
              <TextField name="phoneNumber" label="Phone Number" required={true}>
                <FormHelperText color="text.secondary">{'Example: 000-000-0000'}</FormHelperText>
              </TextField>

              <TextField
                name="relationshipToApplicant"
                label="Relationship to Applicant"
                required={true}
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
            <TextField name="addressLine1" label="Address Line 1" required={true}>
              <FormHelperText color="text.secondary">
                {'Street Address, P.O. Box, Company Name, c/o'}
              </FormHelperText>
            </TextField>
            <TextField name="addressLine2" label="Address Line 2">
              {/* TODO: add optional prop for (optional) in header */}
              <FormHelperText color="text.secondary">
                {'Apartment, suite, unit, building, floor, etc'}
              </FormHelperText>
            </TextField>

            <Stack direction="row" spacing="20px">
              <TextField name="city" label="City" required={true} />
              <TextField name="postalCode" label="Postal Code" required={true}>
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
