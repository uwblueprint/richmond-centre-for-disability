import {
  FormControl,
  FormLabel,
  Input,
  Text,
  Stack,
  FormHelperText,
  Box,
  Divider,
  Checkbox,
} from '@chakra-ui/react'; // Chakra UI
import { GuardianInformation } from '@tools/admin/requests/guardian-information';
import { ChangeEventHandler } from 'react';
import PoaFormUploadField from '@components/admin/requests/guardian-information/PoaFormUploadField';

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
              <FormControl isRequired>
                <FormLabel>{'First name'}</FormLabel>
                <Input value={guardianInformation.firstName} onChange={handleChange('firstName')} />
              </FormControl>

              <FormControl>
                <FormLabel>{'Middle name'}</FormLabel>
                <Input
                  value={guardianInformation.middleName || ''}
                  onChange={handleChange('middleName')}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>{'Last name'}</FormLabel>
                <Input value={guardianInformation.lastName} onChange={handleChange('lastName')} />
              </FormControl>
            </Stack>

            <Stack direction="row" spacing="20px" paddingTop="20px">
              <FormControl isRequired>
                <FormLabel>{'Phone number'}</FormLabel>
                <Input
                  value={guardianInformation.phone}
                  type="tel"
                  onChange={handleChange('phone')}
                />
                <FormHelperText color="text.secondary">{'Example: 000-000-0000'}</FormHelperText>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>{'Relationship to applicant'}</FormLabel>
                <Input
                  value={guardianInformation.relationship}
                  onChange={handleChange('relationship')}
                />
              </FormControl>
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

            <FormControl isRequired paddingBottom="24px">
              <FormLabel>{'Address line 1'}</FormLabel>
              <Input
                value={guardianInformation.addressLine1}
                onChange={handleChange('addressLine1')}
              />
              <FormHelperText color="text.secondary">
                {'Street Address, P.O. Box, Company Name, c/o'}
              </FormHelperText>
            </FormControl>

            <FormControl paddingBottom="24px">
              <FormLabel>
                {'Address line 2 '}
                <Box as="span" textStyle="caption" fontSize="sm">
                  {'(optional)'}
                </Box>
              </FormLabel>
              <Input
                value={guardianInformation.addressLine2 || ''}
                onChange={handleChange('addressLine2')}
              />
              <FormHelperText color="text.secondary">
                {'Apartment, suite, unit, building, floor, etc'}
              </FormHelperText>
            </FormControl>

            <Stack direction="row" spacing="20px">
              <FormControl isRequired>
                <FormLabel>{'City'}</FormLabel>
                <Input value={guardianInformation.city} onChange={handleChange('city')} />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>{'Postal code'}</FormLabel>
                <Input
                  value={guardianInformation.postalCode}
                  onChange={handleChange('postalCode')}
                />
                <FormHelperText color="text.secondary">{'Example: X0X 0X0'} </FormHelperText>
              </FormControl>
            </Stack>

            <PoaFormUploadField file={file} onUploadFile={onUploadFile} />
          </Box>
        </>
      )}
    </>
  );
}
