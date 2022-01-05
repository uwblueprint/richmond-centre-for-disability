import {
  FormControl,
  FormLabel,
  Input,
  Text,
  Stack,
  FormHelperText,
  Box,
  Divider,
  Button,
} from '@chakra-ui/react'; // Chakra UI
import { AttachmentIcon } from '@chakra-ui/icons';
import { GuardianInformation } from '@tools/components/admin/requests/guardian-information';
import { ChangeEventHandler } from 'react';

type GuardianInformationFormProps = {
  readonly guardianInformation: GuardianInformation;
  readonly onChange: (updatedData: GuardianInformation) => void;
  readonly fileList: FileList;
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
}: GuardianInformationFormProps) {
  const handleChange =
    (field: keyof GuardianInformation): ChangeEventHandler<HTMLInputElement> =>
    event => {
      onChange({
        ...guardianInformation,
        [field]: event.target.value,
      });
    };

  return (
    <>
      {/* Personal Information Section */}
      <Box paddingBottom="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Guardian/POA Information'}
        </Text>
        <Stack direction="row" spacing="20px">
          <FormControl isRequired>
            <FormLabel>{'First name'}</FormLabel>
            <Input value={guardianInformation.firstName} onChange={handleChange('firstName')} />
          </FormControl>

          <FormControl>
            <FormLabel>{'Middle name'}</FormLabel>
            <Input value={guardianInformation.middleName} onChange={handleChange('middleName')} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{'Last name'}</FormLabel>
            <Input value={guardianInformation.lastName} onChange={handleChange('lastName')} />
          </FormControl>
        </Stack>

        <Stack direction="row" spacing="20px" paddingTop="20px">
          <FormControl isRequired>
            <FormLabel>{'Phone number'}</FormLabel>
            <Input value={guardianInformation.phone} type="tel" onChange={handleChange('phone')} />
            <FormHelperText color="text.seconday">{'Example: 000-000-0000'}</FormHelperText>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{'Relationship to applicant'}</FormLabel>
            <Input
              value={guardianInformation.guardianRelationship || ''}
              onChange={handleChange('guardianRelationship')}
            />
          </FormControl>
        </Stack>
      </Box>

      <Divider />

      {/* Address Section */}

      <Box paddingTop="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Address '}
        </Text>

        <FormControl isRequired paddingBottom="24px">
          <FormLabel>{'Address line 1'}</FormLabel>
          <Input value={guardianInformation.addressLine1} onChange={handleChange('addressLine1')} />
          <FormHelperText color="text.seconday">
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
          <FormHelperText color="text.seconday">
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
            <Input value={guardianInformation.postalCode} onChange={handleChange('postalCode')} />
            <FormHelperText color="text.seconday">{'Example: X0X 0X0'} </FormHelperText>
          </FormControl>
        </Stack>

        <Text as="h3" textStyle="heading" paddingBottom="20px">
          {'Upload POA File'}
        </Text>
        {/* TODO: Implement the file upload functionality using the fileList prop */}
        <Text color="text.seconday">
          {'Only ONE file can be added. Files must be .pdf and can be a maximum of 5MB in size.'}{' '}
        </Text>
        <Button variant="solid" marginTop="15px" leftIcon={<AttachmentIcon />}>
          {'Click to add attachement'}
        </Button>
      </Box>
    </>
  );
}
