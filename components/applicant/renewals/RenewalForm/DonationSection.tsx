import { Box, Button, Radio, Stack, Text, VStack } from '@chakra-ui/react';
import RadioGroupField from '@components/form/RadioGroupField';
import RenewalFlow from '@containers/RenewalFlow';
import RenewalForm from '@containers/RenewalForm';
import { applicantFacingRenewalDonationSchema } from '@lib/applications/validation';
import { DonationAmount } from '@tools/applicant/renewal-form';
import { Form, Formik } from 'formik';
import { FC, useCallback } from 'react';
import IncompleteSectionAlert from '@components/applicant/renewals/RenewalForm/IncompleteSectionAlert';

/**
 * Donation section of renewal form
 */
const DonationSection: FC = () => {
  const { isReviewing, nextStep, prevStep, goToReview } = RenewalFlow.useContainer();
  const { donationAmount, setDonationAmount } = RenewalForm.useContainer();

  const handleSubmit = useCallback(
    (values: { donationAmount: DonationAmount }) => {
      setDonationAmount(Number(values.donationAmount) as DonationAmount);

      if (isReviewing) {
        goToReview();
      } else {
        nextStep();
      }
    },
    [setDonationAmount, isReviewing, goToReview, nextStep]
  );

  return (
    <Formik
      initialValues={{
        donationAmount,
      }}
      validationSchema={applicantFacingRenewalDonationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isValid }) => (
        <Form noValidate>
          <Box marginLeft="8px">
            <VStack spacing="32px" marginY="16px">
              <VStack spacing="8px" align="flex-start">
                <Text as="p" textStyle="body-bold" textAlign="left">
                  Would you like to add an optional donation to RCD?
                </Text>
                <Text as="p" textStyle="caption" textAlign="left">
                  Donations contribute significantly towards providing services, skills and
                  information to persons with disabilities. We thank you for any donation you may
                  contribute.
                </Text>
              </VStack>
              <RadioGroupField name="donationAmount" required value={Number(values.donationAmount)}>
                <VStack align="flex-start">
                  <Radio value={5}>$5</Radio>
                  <Radio value={10}>$10</Radio>
                  <Radio value={25}>$25</Radio>
                  <Radio value={50}>$50</Radio>
                  <Radio value={75}>$75</Radio>
                  <Radio value={100}>$100</Radio>
                  <Radio value={0}>No Donation</Radio>
                </VStack>
              </RadioGroupField>
            </VStack>
            {!isValid && <IncompleteSectionAlert />}
            <Stack
              width="100%"
              direction={{ sm: 'column-reverse', md: 'row' }}
              spacing={{ sm: '12px', md: '32px' }}
              justifyContent="flex-end"
              mt="40px"
            >
              <Button variant="outline" onClick={prevStep}>{`Previous`}</Button>
              <Button variant="solid" type="submit">
                {isReviewing ? `Review request` : `Next`}
              </Button>
            </Stack>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default DonationSection;
