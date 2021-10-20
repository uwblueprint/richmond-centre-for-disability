import {
  FormControl,
  FormLabel,
  Input,
  Text,
  Stack,
  FormHelperText,
  Box,
  Divider,
} from '@chakra-ui/react'; // Chakra UI
import { DoctorInformation } from '@tools/components/admin/requests/forms/doctor-information-form';

type DoctorInformationFormProps = {
  readonly doctorInformation: DoctorInformation;
  readonly onChange: (updatedData: DoctorInformation) => void;
};
/**
 * Form component for doctor information with styling.
 * @param props - Props
 * @returns doctor information form.
 */
export default function DoctorInformationForm({
  doctorInformation,
  onChange,
}: DoctorInformationFormProps) {
  return (
    <>
      {/* Personal Information Section */}
      <Box paddingBottom="32px">
        <Stack direction="row" spacing="20px" paddingBottom="24px">
          <FormControl isRequired>
            <FormLabel>{'First name'}</FormLabel>
            <Input
              value={doctorInformation.name}
              onChange={event =>
                onChange({
                  ...doctorInformation,
                  name: event.target.value,
                })
              }
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{'Last name'}</FormLabel>
            <Input
              value={doctorInformation.name}
              onChange={event =>
                onChange({
                  ...doctorInformation,
                  name: event.target.value,
                })
              }
            />
          </FormControl>
        </Stack>
        <Stack direction="row" spacing="20px">
          <FormControl isRequired>
            <FormLabel>{'Medical services plan number'}</FormLabel>
            <Input
              value={doctorInformation.mspNumber}
              onChange={event =>
                onChange({
                  ...doctorInformation,
                  mspNumber: event.target.valueAsNumber,
                })
              }
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{'Phone number'}</FormLabel>
            <Input
              value={doctorInformation.phone}
              onChange={event =>
                onChange({
                  ...doctorInformation,
                  phone: event.target.value,
                })
              }
            />
            <FormHelperText color="text.seconday">{'Example: 000-000-0000'}</FormHelperText>
          </FormControl>
        </Stack>
      </Box>

      <Divider borderColor="border.secondary" />

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
          <Input
            value={doctorInformation.addressLine1}
            onChange={event =>
              onChange({
                ...doctorInformation,
                addressLine1: event.target.value,
              })
            }
          />
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
          <Input
            value={doctorInformation.addressLine2 || ''}
            onChange={event =>
              onChange({
                ...doctorInformation,
                addressLine2: event.target.value,
              })
            }
          />
          <FormHelperText color="text.seconday">
            {'Apartment, suite, unit, building, floor, etc'}
          </FormHelperText>
        </FormControl>

        <Stack direction="row" spacing="20px">
          <FormControl isRequired>
            <FormLabel>{'City'}</FormLabel>
            <Input
              value={doctorInformation.city}
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
            <Input
              value={doctorInformation.postalCode}
              onChange={event =>
                onChange({
                  ...doctorInformation,
                  postalCode: event.target.value,
                })
              }
            />
            <FormHelperText color="text.seconday">{'Example: X0X 0X0'} </FormHelperText>
          </FormControl>
        </Stack>
      </Box>
    </>
  );
}
