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
import { PermitHolderInformation } from '@tools/admin/requests/permit-holder-information';
import { ChangeEventHandler } from 'react';

/**
 * PermitHolderInformationFormProps props for allowing users to edit permit holder information.
 */
type PermitHolderInformationFormProps = {
  readonly type: 'new' | 'renewal' | 'replacement';
  readonly permitHolderInformation: PermitHolderInformation;
  readonly onChange: (updatedData: PermitHolderInformation) => void;
};

/**
 * PermitHolderInformationForm Component for allowing users to edit permit holder information.
 *
 * @param type indicates whether the form is being used for a replacement, new, or renewal request
 * @param {PermitHolderInformation} permitHolderInformation Data Structure that holds all permit holder information for a client request.
 * @param onChange Function that uses the updated values from form.
 */
export default function PermitHolderInformationForm(props: PermitHolderInformationFormProps) {
  const handleChange =
    (field: keyof PermitHolderInformation): ChangeEventHandler<HTMLInputElement> =>
    event => {
      const updatedFieldValue =
        event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      props.onChange({
        ...props.permitHolderInformation,
        [field]: updatedFieldValue,
      });
    };

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
              value={props.permitHolderInformation.firstName}
              onChange={handleChange('firstName')}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{'Last name'}</FormLabel>
            <Input
              value={props.permitHolderInformation.lastName}
              onChange={handleChange('lastName')}
            />
          </FormControl>
        </Stack>
      </Box>

      <Divider />

      {/* Contact Information Section */}

      <Box paddingY="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Contact Information'}
        </Text>

        <Stack direction="row" spacing="20px">
          <FormControl isRequired>
            <FormLabel>{'Phone number'}</FormLabel>
            <Input
              value={props.permitHolderInformation.phone}
              type="tel"
              onChange={handleChange('phone')}
            />
            <FormHelperText color="text.seconday">{'Example: 000-000-0000'}</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>
              {'Email address '}
              <Box as="span" textStyle="body-regular" fontSize="sm">
                {'(optional)'}
              </Box>
            </FormLabel>
            <Input
              value={props.permitHolderInformation.email || ''}
              onChange={handleChange('email')}
            />
          </FormControl>
        </Stack>

        {props.type !== 'replacement' && (
          <FormControl>
            <Checkbox
              paddingTop="24px"
              isChecked={props.permitHolderInformation.receiveEmailUpdates}
              isDisabled={!props.permitHolderInformation.email}
              onChange={handleChange('receiveEmailUpdates')}
            >
              {'Permit holder would like to receive renewal updates through email'}
            </Checkbox>
          </FormControl>
        )}
      </Box>

      <Divider />

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
            value={props.permitHolderInformation.addressLine1}
            onChange={handleChange('addressLine1')}
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
            value={props.permitHolderInformation.addressLine2 || ''}
            onChange={handleChange('addressLine2')}
          />
          <FormHelperText color="text.seconday">
            {'Apartment, suite, unit, building, floor, etc'}
          </FormHelperText>
        </FormControl>

        <Stack direction="row" spacing="20px">
          <FormControl isRequired>
            <FormLabel>{'City'}</FormLabel>
            <Input value={props.permitHolderInformation.city} onChange={handleChange('city')} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{'Postal code'}</FormLabel>
            <Input
              value={props.permitHolderInformation.postalCode}
              onChange={handleChange('postalCode')}
            />
            <FormHelperText color="text.seconday">{'Example: X0X 0X0'} </FormHelperText>
          </FormControl>
        </Stack>
      </Box>
    </>
  );
}