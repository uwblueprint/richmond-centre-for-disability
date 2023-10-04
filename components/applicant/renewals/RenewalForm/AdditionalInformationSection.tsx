import { Box, Button, Radio, Stack, VStack } from '@chakra-ui/react';
import RadioGroupField from '@components/form/RadioGroupField';
import TextArea from '@components/form/TextAreaField';
import RenewalFlow from '@containers/RenewalFlow';
import RenewalForm from '@containers/RenewalForm';
import { additionalQuestionsSchema } from '@lib/applications/validation';
import {
  AccessibleConvertedVanLoadingMethod,
  RequiresWiderParkingSpaceReason,
} from '@lib/graphql/types';
import { Form, Formik } from 'formik';
import { FC, useCallback } from 'react';
import IncompleteSectionAlert from '@components/applicant/renewals/RenewalForm/IncompleteSectionAlert';

/**
 * Additional information section of renewal form
 */
const AdditionalInformationSection: FC = () => {
  const { isReviewing, nextStep, prevStep, goToReview } = RenewalFlow.useContainer();
  const { additionalInformation, setAdditionalInformation } = RenewalForm.useContainer();

  const handleSubmit = useCallback(
    (values: {
      usesAccessibleConvertedVan: boolean;
      accessibleConvertedVanLoadingMethod: AccessibleConvertedVanLoadingMethod | null;
      requiresWiderParkingSpace: boolean;
      requiresWiderParkingSpaceReason: RequiresWiderParkingSpaceReason | null;
      otherRequiresWiderParkingSpaceReason: string | null;
    }) => {
      const { usesAccessibleConvertedVan, requiresWiderParkingSpace, ...rest } = values;
      setAdditionalInformation({
        usesAccessibleConvertedVan: !!Number(usesAccessibleConvertedVan),
        requiresWiderParkingSpace: !!Number(requiresWiderParkingSpace),
        ...rest,
      });

      if (isReviewing) {
        goToReview();
      } else {
        nextStep();
      }
    },
    [setAdditionalInformation, isReviewing, goToReview, nextStep]
  );

  return (
    <Formik
      initialValues={{ ...additionalInformation }}
      validationSchema={additionalQuestionsSchema}
      onSubmit={handleSubmit}
      validateOnMount
    >
      {({ values, isValid }) => (
        <Form noValidate>
          <Box marginLeft="8px">
            <VStack spacing="32px" marginY="16px">
              <RadioGroupField
                name="usesAccessibleConvertedVan"
                label="Are you using an accessible converted van?"
                required
                value={Number(values.usesAccessibleConvertedVan)}
              >
                <Stack direction={{ sm: 'column', md: 'row' }} spacing={{ md: '32px' }}>
                  <Radio value={1}>{'Yes, I am'}</Radio>
                  <Radio value={0}>{'No, I am not'}</Radio>
                </Stack>
              </RadioGroupField>
              {Number(values.usesAccessibleConvertedVan) === 1 && (
                <RadioGroupField
                  name="accessibleConvertedVanLoadingMethod"
                  label="Which loading type do you require?"
                  required
                  value={values.accessibleConvertedVanLoadingMethod || undefined}
                >
                  <Stack direction={{ sm: 'column', md: 'row' }} spacing={{ md: '32px' }}>
                    <Radio value="SIDE_LOADING">Side loading</Radio>
                    <Radio value="END_LOADING">End loading</Radio>
                  </Stack>
                </RadioGroupField>
              )}
              <RadioGroupField
                name="requiresWiderParkingSpace"
                label="Do you require a wider accessible parking space?"
                required
                value={Number(values.requiresWiderParkingSpace)}
              >
                <Stack direction={{ sm: 'column', md: 'row' }} spacing={{ md: '32px' }}>
                  <Radio value={1}>{'Yes, I do'}</Radio>
                  <Radio value={0}>{'No, I do not'}</Radio>
                </Stack>
              </RadioGroupField>
              {Number(values.requiresWiderParkingSpace) === 1 && (
                <RadioGroupField
                  name="requiresWiderParkingSpaceReason"
                  label="Please specify your reason for requiring a wider accessible parking space."
                  required
                  value={values.requiresWiderParkingSpaceReason || undefined}
                >
                  <Stack
                    align="flex-start"
                    direction={{ sm: 'column', md: 'row' }}
                    spacing={{ md: '32px' }}
                  >
                    <Radio value="HAS_ACCESSIBLE_VAN">I have an accessible van</Radio>
                    <Radio value="MEDICAL_REASONS">For medical reasons</Radio>
                    <Radio value="OTHER">Other</Radio>
                  </Stack>
                </RadioGroupField>
              )}
              {Number(values.requiresWiderParkingSpace) === 1 &&
                values.requiresWiderParkingSpaceReason === 'OTHER' && (
                  <TextArea name="otherRequiresWiderParkingSpaceReason" label="" />
                )}
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
              <Button variant="solid" type="submit" isDisabled={!isValid}>
                {isReviewing ? `Review request` : `Next`}
              </Button>
            </Stack>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AdditionalInformationSection;
