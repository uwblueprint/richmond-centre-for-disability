import { ChangeEventHandler } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Text,
  Stack,
  FormHelperText,
  Box,
  Divider,
  VStack,
} from '@chakra-ui/react'; // Chakra UI
import { DoctorFormData } from '@tools/admin/requests/doctor-information';

type DoctorInformationFormProps = {
  readonly doctorInformation: DoctorFormData;
  readonly onChange: (updatedData: DoctorFormData) => void;
};

/**
 * Form component for editing doctor information of request.
 * @param props - Props
 * @returns doctor information form.
 */
export default function DoctorInformationForm({
  doctorInformation,
  onChange,
}: DoctorInformationFormProps) {
  const { firstName, lastName, mspNumber, phone, addressLine1, addressLine2, city, postalCode } =
    doctorInformation;

  const handleChange =
    (field: keyof DoctorFormData): ChangeEventHandler<HTMLInputElement> =>
    event => {
      onChange({
        ...doctorInformation,
        [field]: event.target.value,
      });
    };

  return (
    <>
      {/* Personal Information Section */}
      <VStack spacing="24px" align="left" paddingBottom="32px">
        <Stack direction="row" spacing="20px">
          <FormControl isRequired>
            <FormLabel>{'First name'}</FormLabel>
            <Input value={firstName} onChange={handleChange('firstName')} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{'Last name'}</FormLabel>
            <Input value={lastName} onChange={handleChange('lastName')} />
          </FormControl>
        </Stack>
        <Stack direction="row" spacing="20px">
          <FormControl isRequired>
            <FormLabel>{'Medical services plan number'}</FormLabel>
            <Input
              value={mspNumber || ''}
              onChange={event =>
                onChange({
                  ...doctorInformation,
                  mspNumber: parseInt(event.target.value),
                })
              }
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{'Phone number'}</FormLabel>
            <Input value={phone} onChange={handleChange('phone')} />
            <FormHelperText color="text.seconday">{'Example: 000-000-0000'}</FormHelperText>
          </FormControl>
        </Stack>
      </VStack>

      <Divider />

      {/* Address Section */}

      <Box paddingY="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Address'}
          <Box as="span" textStyle="caption">
            {' (must be in British Columbia)'}
          </Box>
        </Text>

        <FormControl isRequired paddingBottom="24px">
          <FormLabel>{'Address line 1'}</FormLabel>
          <Input value={addressLine1} onChange={handleChange('addressLine1')} />
          <FormHelperText color="text.seconday">
            {'Street Address, P.O. Box, Company Name, c/o'}
          </FormHelperText>
        </FormControl>

        <FormControl paddingBottom="24px">
          <FormLabel>
            {'Address line 2 '}
            <Box as="span" textStyle="caption">
              {'(optional)'}
            </Box>
          </FormLabel>
          <Input value={addressLine2 || ''} onChange={handleChange('addressLine2')} />
          <FormHelperText color="text.seconday">
            {'Apartment, suite, unit, building, floor, etc'}
          </FormHelperText>
        </FormControl>

        <Stack direction="row" spacing="20px">
          <FormControl isRequired>
            <FormLabel>{'City'}</FormLabel>
            <Input
              value={city}
              onChange={event =>
                onChange({
                  ...doctorInformation,
                  city: event.target.value,
                })
              }
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{'Postal code'}</FormLabel>
            <Input value={postalCode} onChange={handleChange('postalCode')} />
            <FormHelperText color="text.seconday">{'Example: X0X 0X0'} </FormHelperText>
          </FormControl>
        </Stack>
      </Box>
    </>
  );
}
