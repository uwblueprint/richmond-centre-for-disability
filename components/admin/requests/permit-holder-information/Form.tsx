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
  Select,
} from '@chakra-ui/react'; // Chakra UI
import { Gender } from '@lib/graphql/types';
import { formatDateYYYYMMDD } from '@lib/utils/date';
import { PermitHolderFormData } from '@tools/admin/requests/permit-holder-information';
import { ChangeEventHandler } from 'react';

/**
 * PermitHolderInformationFormProps props for allowing users to edit permit holder information.
 */
type PermitHolderInformationFormProps = {
  readonly permitHolderInformation: PermitHolderFormData;
  readonly onChange: (updatedData: PermitHolderFormData) => void;
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
    (field: keyof PermitHolderFormData): ChangeEventHandler<HTMLInputElement> =>
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
        <Stack direction="row" spacing="20px" paddingBottom="24px">
          <FormControl isRequired>
            <FormLabel>{'First name'}</FormLabel>
            <Input
              value={props.permitHolderInformation.firstName}
              onChange={handleChange('firstName')}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{'Middle name'}</FormLabel>
            <Input
              value={props.permitHolderInformation.middleName || ''}
              onChange={handleChange('middleName')}
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

        {props.permitHolderInformation.type === 'NEW' && (
          <Stack direction="row" spacing="20px">
            <FormControl isRequired>
              <FormLabel>{`Date of birth`}</FormLabel>
              <Input
                type="date"
                value={
                  props.permitHolderInformation.dateOfBirth
                    ? formatDateYYYYMMDD(props.permitHolderInformation.dateOfBirth)
                    : undefined
                }
                onChange={event => {
                  if (props.permitHolderInformation.type === 'NEW') {
                    props.onChange({
                      ...props.permitHolderInformation,
                      dateOfBirth: event.target.value,
                    });
                  }
                }}
              />
            </FormControl>

            {/* TODO: set otherGender if selected option is OTHER */}
            <FormControl isRequired>
              <FormLabel>{`Gender`}</FormLabel>
              <Select
                placeholder="Select gender"
                value={props.permitHolderInformation.gender || undefined}
                onChange={event => {
                  if (props.permitHolderInformation.type === 'NEW') {
                    props.onChange({
                      ...props.permitHolderInformation,
                      gender: event.target.value as Gender,
                    });
                  }
                }}
              >
                <option value={'MALE'}>Male</option>
                <option value={'FEMALE'}>Female</option>
                <option value={'OTHER'}>Other</option>
              </Select>
            </FormControl>
          </Stack>
        )}
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
            <FormHelperText color="text.secondary">{'Example: 000-000-0000'}</FormHelperText>
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

        {props.permitHolderInformation.type !== 'REPLACEMENT' && (
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
            value={props.permitHolderInformation.addressLine2 || ''}
            onChange={handleChange('addressLine2')}
          />
          <FormHelperText color="text.secondary">
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
            <FormHelperText color="text.secondary">{'Example: X0X 0X0'} </FormHelperText>
          </FormControl>
        </Stack>
      </Box>
    </>
  );
}
