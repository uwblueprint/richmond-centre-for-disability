import { Box, Button, Flex, FormHelperText, HStack, Radio, Text, VStack } from '@chakra-ui/react';
import RadioGroupField from '@components/form/RadioGroupField';
import TextField from '@components/form/TextField';
import RenewalFlow from '@containers/RenewalFlow';
import RenewalForm from '@containers/RenewalForm';
import { applicantFacingRenewalDoctorSchema } from '@lib/applications/validation';
import { Form, Formik } from 'formik';
import { FC, useCallback } from 'react';
import IncompleteSectionAlert from '@components/applicant/renewals/RenewalForm/IncompleteSectionAlert';

/**
 * Doctor information section of renewal form
 */
const DoctorInformationSection: FC = () => {
  const { isReviewing, nextStep, prevStep, goToReview } = RenewalFlow.useContainer();
  const { setUpdatedDoctorInfo, doctorInformation, setDoctorInformation } =
    RenewalForm.useContainer();

  const handleSubmit = useCallback(
    (values: {
      updatedDoctor: boolean;
      doctorFirstName: string;
      doctorLastName: string;
      doctorMspNumber: string;
      doctorAddressLine1: string;
      doctorAddressLine2: string;
      doctorCity: string;
      doctorPostalCode: string;
      doctorPhoneNumber: string;
    }) => {
      setUpdatedDoctorInfo(!!Number(values.updatedDoctor));
      if (values.updatedDoctor) {
        const {
          doctorFirstName,
          doctorLastName,
          doctorMspNumber,
          doctorAddressLine1,
          doctorAddressLine2,
          doctorCity,
          doctorPostalCode,
          doctorPhoneNumber,
        } = values;
        setDoctorInformation({
          firstName: doctorFirstName,
          lastName: doctorLastName,
          mspNumber: doctorMspNumber,
          addressLine1: doctorAddressLine1,
          addressLine2: doctorAddressLine2,
          city: doctorCity,
          postalCode: doctorPostalCode,
          phone: doctorPhoneNumber,
        });
      } else {
        setDoctorInformation({
          firstName: '',
          lastName: '',
          mspNumber: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          postalCode: '',
          phone: '',
        });
      }

      if (isReviewing) {
        goToReview();
      } else {
        nextStep();
      }
    },
    [setUpdatedDoctorInfo, setDoctorInformation, isReviewing, goToReview, nextStep]
  );

  return (
    <Formik
      initialValues={{
        updatedDoctor: false,
        doctorFirstName: doctorInformation.firstName,
        doctorLastName: doctorInformation.lastName,
        doctorMspNumber: doctorInformation.mspNumber,
        doctorAddressLine1: doctorInformation.addressLine1,
        doctorAddressLine2: doctorInformation.addressLine2,
        doctorCity: doctorInformation.city,
        doctorPostalCode: doctorInformation.postalCode,
        doctorPhoneNumber: doctorInformation.phone,
      }}
      validationSchema={applicantFacingRenewalDoctorSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isValid }) => (
        <Form noValidate>
          <Box marginLeft="8px">
            {/* Check whether applicant has updated doctor info */}
            <RadioGroupField
              name="updatedDoctor"
              label="Have you changed your doctor since you last received or renewed your parking permit?"
              required
              value={values.updatedDoctor === null ? undefined : Number(values.updatedDoctor)}
            >
              <HStack spacing="32px">
                <Radio value={1}>{'Yes, I have'}</Radio>
                <Radio value={0}>{'No, I have not'}</Radio>
              </HStack>
            </RadioGroupField>
            {/* Conditionally render form based on whether doctor info was updated */}
            {!!Number(values.updatedDoctor) && (
              <Box marginY="16px">
                <Text
                  as="p"
                  textAlign="left"
                  textStyle="body-bold"
                  marginBottom="24px"
                >{`Please fill out your doctor's information:`}</Text>
                <VStack align="flex-start" spacing="24px">
                  <HStack spacing="48px">
                    <TextField name="doctorFirstName" label="First name" required />
                    <TextField name="doctorLastName" label="Last name" required />
                  </HStack>
                  <TextField
                    name="doctorMspNumber"
                    label="Your Doctor's Medical Services Plan (MSP) Number"
                    required
                  >
                    <FormHelperText>
                      {`Your Doctor has a unique Medical Services Plan Number. If you do not know
                      where to find it, please contact your doctor.`}
                    </FormHelperText>
                  </TextField>
                  <TextField name="doctorAddressLine1" label="Address Line 1" required>
                    <FormHelperText>{`Street Address, P. O. Box, Company Name, c/o`}</FormHelperText>
                  </TextField>
                  <TextField name="doctorAddressLine2" label="Address Line 2 (optional)">
                    <FormHelperText>{`Apartment, suite, unit, building, floor, etc`}</FormHelperText>
                  </TextField>
                  <TextField name="doctorCity" label="City" required>
                    <FormHelperText>{`e.g. Vancouver`}</FormHelperText>
                  </TextField>
                  <TextField name="doctorPostalCode" label="Postal Code" required>
                    <FormHelperText>{`e.g. X0X 0X0`}</FormHelperText>
                  </TextField>
                  <TextField name="doctorPhoneNumber" label="Phone Number" required>
                    <FormHelperText>{`e.g. 555-555-5555`}</FormHelperText>
                  </TextField>
                </VStack>
              </Box>
            )}
            {!isValid && <IncompleteSectionAlert />}
            <Flex width="100%" justifyContent="flex-end" mt="40px">
              <Button variant="outline" onClick={prevStep} marginRight="32px">{`Previous`}</Button>
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

export default DoctorInformationSection;
