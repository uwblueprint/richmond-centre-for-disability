import { Box, Button, FormHelperText, Radio, Stack, Text, VStack } from '@chakra-ui/react';
import CheckboxField from '@components/form/CheckboxField';
import RadioGroupField from '@components/form/RadioGroupField';
import TextField from '@components/form/TextField';
import RenewalFlow from '@containers/RenewalFlow';
import RenewalForm from '@containers/RenewalForm';
import { applicantFacingRenewalContactSchema } from '@lib/applications/validation';
import { Form, Formik } from 'formik';
import { FC, useCallback } from 'react';
import IncompleteSectionAlert from '@components/applicant/renewals/RenewalForm/IncompleteSectionAlert';

/**
 * Contact information section of renewal form
 */
const ContactInformationSection: FC = () => {
  const { isReviewing, nextStep, prevStep, goToReview } = RenewalFlow.useContainer();
  const { setUpdatedContactInfo, contactInformation, setContactInformation } =
    RenewalForm.useContainer();

  const handleSubmit = useCallback(
    (values: {
      updatedContactInfo: boolean;
      contactPhoneNumber: string;
      contactEmailAddress: string;
      receiveEmailUpdates: boolean;
    }) => {
      setUpdatedContactInfo(!!Number(values.updatedContactInfo));
      if (values.updatedContactInfo) {
        const { contactPhoneNumber, contactEmailAddress, receiveEmailUpdates } = values;
        setContactInformation({
          phone: contactPhoneNumber,
          email: contactEmailAddress,
          receiveEmailUpdates: contactEmailAddress ? receiveEmailUpdates : false,
        });
      } else {
        setContactInformation({
          phone: '',
          email: '',
          receiveEmailUpdates: false,
        });
      }

      if (isReviewing) {
        goToReview();
      } else {
        nextStep();
      }
    },
    [setUpdatedContactInfo, setContactInformation, isReviewing, goToReview, nextStep]
  );

  return (
    <Formik
      initialValues={{
        updatedContactInfo: false,
        contactPhoneNumber: contactInformation.phone,
        contactEmailAddress: contactInformation.email,
        receiveEmailUpdates: contactInformation.receiveEmailUpdates,
      }}
      validationSchema={applicantFacingRenewalContactSchema}
      onSubmit={handleSubmit}
      validateOnMount
    >
      {({ values, isValid }) => (
        <Form noValidate>
          <Box marginLeft="8px">
            {/* Check whether applicant has updated contact info */}
            <RadioGroupField
              name="updatedContactInfo"
              label="Have you changed your contact information since you received or renewed your last parking permit?"
              required
              value={
                values.updatedContactInfo === null ? undefined : Number(values.updatedContactInfo)
              }
            >
              <Stack direction={{ sm: 'column', md: 'row' }} spacing={{ md: '32px' }}>
                <Radio value={1}>{`Yes, I have`}</Radio>
                <Radio value={0}>{'No, I have not'}</Radio>
              </Stack>
            </RadioGroupField>
            {/* Conditionally render form based on whether contact info was updated */}
            {!!Number(values.updatedContactInfo) && (
              <Box marginY="16px">
                <Text
                  as="p"
                  textAlign="left"
                  textStyle="body-bold"
                  marginBottom="24px"
                >{`Please fill out at least one of the following:`}</Text>
                <VStack align="flex-start" spacing="24px">
                  <TextField name="contactPhoneNumber" label="Phone Number">
                    <FormHelperText>{`e.g. 555-555-5555`}</FormHelperText>
                  </TextField>
                  <TextField name="contactEmailAddress" label="Email Address">
                    <FormHelperText>{`e.g. example@gmail.com`}</FormHelperText>
                  </TextField>
                  <Box textAlign="left">
                    <CheckboxField
                      name="receiveEmailUpdates"
                      isDisabled={!values.contactEmailAddress}
                    >
                      {`Please tick here if you would like to recieve notifications to renew your permit through email`}
                    </CheckboxField>
                  </Box>
                </VStack>
              </Box>
            )}
            {!isValid && <IncompleteSectionAlert />}
            <Stack
              width="100%"
              direction={{ sm: 'column-reverse', md: 'row' }}
              justifyContent="flex-end"
              spacing={{ sm: '12px', md: '32px' }}
              mt="40px"
            >
              <Button variant="outline" onClick={prevStep}>{`Previous`}</Button>
              <Button variant="solid" isDisabled={!isValid} type="submit">
                {isReviewing ? `Review request` : `Next`}
              </Button>
            </Stack>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ContactInformationSection;
