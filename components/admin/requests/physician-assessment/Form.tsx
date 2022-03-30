import { Text, Stack, FormHelperText, Box, Divider, Radio } from '@chakra-ui/react'; // Chakra UI
import DateField from '@components/form/DateField';
import RadioGroupField from '@components/form/RadioGroupField';
import TextArea from '@components/form/TextAreaField';
import TextField from '@components/form/TextField';
import { PhysicianAssessment } from '@tools/admin/requests/physician-assessment';

type PhysicianAssessmentFormProps = {
  readonly physicianAssessment: PhysicianAssessment;
  readonly onChange?: (updatedData: PhysicianAssessment) => void;
};

/**
 * PhysicianAssessmentForm Component for allowing users to edit physician assessment information.
 *
 * @param {PhysicianAssessment} physicianAssessment Object that holds all physician assessment information for a client request.
 * @param onChange Function that uses the updated values from form.
 */
export default function PhysicianAssessmentForm({
  physicianAssessment,
}: PhysicianAssessmentFormProps) {
  return (
    <>
      <Box paddingBottom="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {`Physician’s Assessment`}
        </Text>
        <Stack spacing="20px">
          <TextField
            name="physicianAssessment.disability"
            label="Medical name of disabling condition(s)"
            required
          />
          <DateField
            name="physicianAssessment.disabilityCertificationDate"
            label="Physician’s certification date"
            required
          >
            <FormHelperText color="text.secondary">{'Format: YYYY-MM-DD'}</FormHelperText>
          </DateField>
        </Stack>
      </Box>

      <Divider />

      {/* Patient Eligibility Section */}

      <Box paddingY="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Patient Eligibility'}
        </Text>

        <Stack spacing="20px">
          <RadioGroupField
            name="physicianAssessment.patientCondition"
            label="Please select the condition"
            required
          >
            <Stack>
              <Radio value={'AFFECTS_MOBILITY'}>
                {
                  'Applicant has a disability that affects mobility and the ability to walk specifically'
                }
              </Radio>
              <Radio value={'CANNOT_WALK_100M'}>
                {'Applicant can NOT walk 100 meters without risk to health'}
              </Radio>
              <Radio value={'MOBILITY_AID_REQUIRED'}>
                {'Applicant requires the use of a mobiliy aid in order to travel any distance'}
              </Radio>
              <Radio value={'OTHER'}>{'Other'}</Radio>
            </Stack>
          </RadioGroupField>

          {physicianAssessment.patientCondition === 'OTHER' && (
            <TextArea
              name="physicianAssessment.otherPatientCondition"
              label="Description"
              required
            />
          )}
        </Stack>
      </Box>

      <Divider borderColor="border.secondary" />

      {/*  Prognosis Section */}

      <Box paddingTop="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Prognosis'}
        </Text>

        <Box paddingBottom="24px">
          <RadioGroupField
            name="physicianAssessment.permitType"
            label="This patient is experiencing a mobility impairment which is"
            required
          >
            <Stack>
              <Radio value={'PERMANENT'}>{'Permanent'}</Radio>
              <Radio value={'TEMPORARY'}>{'Temporary'}</Radio>
            </Stack>
          </RadioGroupField>
        </Box>

        {physicianAssessment.permitType === 'TEMPORARY' && (
          <DateField
            name="physicianAssessment.temporaryPermitExpiry"
            label="Temporary permit will expire on"
            required
          >
            <FormHelperText color="text.secondary">{'Format: YYYY-MM-DD'}</FormHelperText>
          </DateField>
        )}
      </Box>
    </>
  );
}
