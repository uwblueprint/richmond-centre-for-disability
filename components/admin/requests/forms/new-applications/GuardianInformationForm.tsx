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
import { GuardianInformation } from '@tools/components/admin/requests/forms/types'; // Guardian Information Type

type GuardianInformationFormProps = {
  readonly guardianInformation: GuardianInformation;
  readonly onChange: (updatedData: GuardianInformation) => void;
  readonly onFileUpload: (args: Record<string, any>) => void;
};

/**
 * GuardianInformationForm Component for allowing users to edit guardian information.
 *
 * @param {GuardianInformation} permitHolderInformation Data Structure that holds all guardian information for a client request.
 * @param onChange Function that uses the updated values from form.
 */
export default function GuardianInformationForm({
  guardianInformation,
  onChange,
  onFileUpload,
}: GuardianInformationFormProps) {
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
            <Input
              value={guardianInformation.firstName}
              onChange={event =>
                onChange({
                  ...guardianInformation,
                  firstName: event.target.value,
                })
              }
            />
          </FormControl>

          <FormControl>
            <FormLabel>{'Middle name'}</FormLabel>
            <Input
              value={guardianInformation.middleName}
              onChange={event =>
                onChange({
                  ...guardianInformation,
                  lastName: event.target.value,
                })
              }
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{'Last name'}</FormLabel>
            <Input
              value={guardianInformation.lastName}
              onChange={event =>
                onChange({
                  ...guardianInformation,
                  lastName: event.target.value,
                })
              }
            />
          </FormControl>
        </Stack>

        <Stack direction="row" spacing="20px" paddingTop="20px">
          <FormControl isRequired>
            <FormLabel>{'Phone number'}</FormLabel>
            <Input
              value={guardianInformation.phone}
              type="tel"
              onChange={event =>
                onChange({
                  ...guardianInformation,
                  phone: event.target.value,
                })
              }
            />
            <FormHelperText color="text.seconday">{'Example: 000-000-0000'}</FormHelperText>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{'Relationship to applicant'}</FormLabel>
            <Input
              value={guardianInformation.guardianRelationship || ''}
              onChange={event =>
                onChange({
                  ...guardianInformation,
                  guardianRelationship: event.target.value,
                })
              }
            />
          </FormControl>
        </Stack>
      </Box>

      <Divider borderColor="border.secondary" />

      {/* Address Section */}

      <Box paddingTop="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Address '}
        </Text>

        <FormControl isRequired paddingBottom="24px">
          <FormLabel>{'Address line 1'}</FormLabel>
          <Input
            value={guardianInformation.addressLine1}
            onChange={event =>
              onChange({
                ...guardianInformation,
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
            <Box as="span" textStyle="caption" fontSize="sm">
              {'(optional)'}
            </Box>
          </FormLabel>
          <Input
            value={guardianInformation.addressLine2 || ''}
            onChange={event =>
              onChange({
                ...guardianInformation,
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
              value={guardianInformation.city}
              onChange={event =>
                onChange({
                  ...guardianInformation,
                  city: event.target.value,
                })
              }
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{'Postal code'}</FormLabel>
            <Input
              value={guardianInformation.postalCode}
              onChange={event =>
                onChange({
                  ...guardianInformation,
                  postalCode: event.target.value,
                })
              }
            />
            <FormHelperText color="text.seconday">{'Example: X0X 0X0'} </FormHelperText>
          </FormControl>
        </Stack>

        <Text as="h3" textStyle="heading" paddingBottom="20px">
          {'Upload POA File'}
        </Text>
        <Text color="text.seconday">
          {'Only ONE file can be added. Files must be .pdf and can be a maximum of 5MB in size.'}{' '}
        </Text>
        <Button
          variant="solid"
          marginTop="15px"
          leftIcon={<AttachmentIcon />}
          onClick={() => onFileUpload({ documentUrl: 'documentUrl' })}
        >
          {'Click to add attachement'}
        </Button>
      </Box>
    </>
  );
}
