import { Box, Button, Flex, FormHelperText, HStack, Radio, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import RadioGroupField from '@components/form/RadioGroupField';
import TextField from '@components/form/TextField';
import RenewalFlow from '@containers/RenewalFlow';
import RenewalForm from '@containers/RenewalForm';
import { applicantFacingRenewalPersonalAddressSchema } from '@lib/applications/validation';
import { Form, Formik } from 'formik';
import { FC, useCallback } from 'react';
import IncompleteSectionAlert from '@components/applicant/renewals/RenewalForm/IncompleteSectionAlert';

/**
 * Personal address section of renewal form
 */
const PersonalAddressSection: FC = () => {
  const { isReviewing, nextStep, goToReview } = RenewalFlow.useContainer();
  const { setUpdatedAddress, personalAddressInformation, setPersonalAddressInformation } =
    RenewalForm.useContainer();

  const handleSubmit = useCallback(
    (values: {
      updatedAddress: boolean;
      personalAddressLine1: string;
      personalAddressLine2: string;
      personalCity: string;
      personalPostalCode: string;
    }) => {
      setUpdatedAddress(!!Number(values.updatedAddress));
      if (values.updatedAddress) {
        const { personalAddressLine1, personalAddressLine2, personalCity, personalPostalCode } =
          values;
        setPersonalAddressInformation({
          addressLine1: personalAddressLine1,
          addressLine2: personalAddressLine2,
          city: personalCity,
          postalCode: personalPostalCode,
        });
      } else {
        setPersonalAddressInformation({
          addressLine1: '',
          addressLine2: '',
          city: '',
          postalCode: '',
        });
      }

      if (isReviewing) {
        goToReview();
      } else {
        nextStep();
      }
    },
    [setUpdatedAddress, setPersonalAddressInformation, isReviewing, goToReview, nextStep]
  );

  return (
    <Formik
      initialValues={{
        updatedAddress: false,
        personalAddressLine1: personalAddressInformation.addressLine1,
        personalAddressLine2: personalAddressInformation.addressLine2,
        personalCity: personalAddressInformation.city,
        personalPostalCode: personalAddressInformation.postalCode,
      }}
      validationSchema={applicantFacingRenewalPersonalAddressSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isValid }) => (
        <Form noValidate>
          <Box marginLeft="8px">
            {/* Check whether applicant has updated address */}
            <RadioGroupField
              name="updatedAddress"
              label="Has your address changed since you received your last parking pass?"
              required
              value={values.updatedAddress === null ? undefined : Number(values.updatedAddress)}
            >
              <HStack spacing="32px">
                <Radio value={1}>{'Yes, it has'}</Radio>
                <Radio value={0}>{'No, it has not'}</Radio>
              </HStack>
            </RadioGroupField>
            {/* Conditionally render form based on whether address was updated */}
            {!!Number(values.updatedAddress) && (
              <Box marginY="16px">
                <Text
                  as="p"
                  textAlign="left"
                  textStyle="body-bold"
                >{`Please fill out the form below:`}</Text>
                <Text
                  as="p"
                  textAlign="left"
                  textStyle="body-bold"
                  marginBottom="24px"
                >{`Note that your address must be in British Columbia, Canada to qualify for a permit.`}</Text>
                <VStack align="flex-start" spacing="24px">
                  <TextField name="personalAddressLine1" label="Address line 1" required>
                    <FormHelperText color="text.secondary">
                      {'Street Address, P.O. Box, Company Name, c/o'}
                    </FormHelperText>
                  </TextField>
                  <TextField
                    name="personalAddressLine2"
                    label={
                      <>
                        {'Address line 2 '}
                        <Box as="span" textStyle="body-regular" fontSize="sm">
                          {'(optional)'}
                        </Box>
                      </>
                    }
                  >
                    <FormHelperText color="text.secondary">
                      {'Apartment, suite, unit, building, floor, etc'}
                    </FormHelperText>
                  </TextField>
                  <TextField name="personalCity" label="City" required />
                  <TextField name="personalPostalCode" label="Postal code" required>
                    <FormHelperText color="text.secondary">{'Example: X0X 0X0'} </FormHelperText>
                  </TextField>
                </VStack>
              </Box>
            )}
            {!isValid && <IncompleteSectionAlert />}
            <Flex width="100%" justifyContent="flex-end" mt="40px">
              <Link href="/">
                <Button
                  variant="outline"
                  marginRight="32px"
                  _hover={{ textDecoration: 'none' }}
                >{`Go back to home page`}</Button>
              </Link>
              <Button variant="solid" type="submit" isDisabled={!isValid}>
                {isReviewing ? `Review request` : `Next`}
              </Button>
            </Flex>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default PersonalAddressSection;
