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
import { PermitHolderInformation } from '@tools/components/admin/requests/forms/types'; // Permit Holder Information Type

type PermitHolderInformationFormProps = {
  readonly permitHolderInformation: PermitHolderInformation;
  readonly onChange: (updatedData: PermitHolderInformation) => void;
};

/**
 * PermitHolderInformationForm Component for allowing users to edit permit holder information.
 *
 * @param {PermitHolderInformation} permitHolderInformation Data Structure that holds all permit holder information for a client request.
 * @param onChange Function that uses the updated values from form.
 */
export default function PermitHolderInformationForm({
  permitHolderInformation,
  onChange,
}: PermitHolderInformationFormProps) {
  return (
    <>
      {/* Personal Information Section */}
      <Box paddingBottom="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Personal Information'}
        </Text>
        <Stack direction="row" spacing="20px">
          <FormControl isRequired>
            <FormLabel>{'First name'}</FormLabel>
            <Input
              value={permitHolderInformation.firstName}
              onChange={event =>
                onChange({
                  ...permitHolderInformation,
                  firstName: event.target.value,
                })
              }
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{'Last name'}</FormLabel>
            <Input
              value={permitHolderInformation.lastName}
              onChange={event =>
                onChange({
                  ...permitHolderInformation,
                  lastName: event.target.value,
                })
              }
            />
          </FormControl>
        </Stack>
      </Box>

      <Divider borderColor="border.secondary" />

      {/* Contact Information Section */}

      <Box paddingY="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Contact Information'}
        </Text>

        <Stack direction="row" spacing="20px">
          <FormControl isRequired>
            <FormLabel>{'Phone number'}</FormLabel>
            <Input
              value={permitHolderInformation.phone}
              type="tel"
              onChange={event =>
                onChange({
                  ...permitHolderInformation,
                  phone: event.target.value,
                })
              }
            />
            <FormHelperText color="text.seconday">{'Example: 000-000-0000'}</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>
              {'Email address '}
              <Box as="span" textStyle="body-regular">
                {'(optional)'}
              </Box>
            </FormLabel>
            <Input
              value={permitHolderInformation.email || ''}
              onChange={event =>
                onChange({
                  ...permitHolderInformation,
                  email: event.target.value,
                })
              }
            />
          </FormControl>
        </Stack>
      </Box>

      <Divider borderColor="border.secondary" />

      {/* Home Address Section */}

      <Box paddingTop="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Home Address '}
          <Box as="span" textStyle="caption">
            {'(must be in British Columbia)'}
          </Box>
        </Text>

        <FormControl isRequired paddingBottom="24px">
          <FormLabel>{'Address line 1'}</FormLabel>
          <Input
            value={permitHolderInformation.addressLine1}
            onChange={event =>
              onChange({
                ...permitHolderInformation,
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
            value={permitHolderInformation.addressLine2 || ''}
            onChange={event =>
              onChange({
                ...permitHolderInformation,
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
              value={permitHolderInformation.city}
              onChange={event =>
                onChange({
                  ...permitHolderInformation,
                  city: event.target.value,
                })
              }
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{'Postal code'}</FormLabel>
            <Input
              value={permitHolderInformation.postalCode}
              onChange={event =>
                onChange({
                  ...permitHolderInformation,
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
