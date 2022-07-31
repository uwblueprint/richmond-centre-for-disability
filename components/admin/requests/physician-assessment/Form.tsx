import DateField from '@components/form/DateField';
import RadioGroupField from '@components/form/RadioGroupField';
import TextArea from '@components/form/TextAreaField';
import TextField from '@components/form/TextField';
import { PhysicianAssessment } from '@tools/admin/requests/physician-assessment';
import {
  FormControl,
  FormLabel,
  Text,
  Stack,
  FormHelperText,
  Box,
  Divider,
  RadioGroup,
  Radio,
  Checkbox,
} from '@chakra-ui/react'; // Chakra UI
import { useState } from 'react';
import TextAreaField from '@components/form/TextAreaField';
import CheckboxGroupField from '@components/form/CheckboxGroupField';
import { useFormikContext } from 'formik';
import { formatDate } from '@lib/utils/date';

type PhysicianAssessmentFormProps = {
  readonly physicianAssessment: PhysicianAssessment;
};

/**
 * PhysicianAssessmentForm Component for allowing users to edit physician assessment information.
 *
 * @param {PhysicianAssessment} physicianAssessment Object that holds all physician assessment information for a client request.
 */
export default function PhysicianAssessmentForm({
  physicianAssessment,
}: PhysicianAssessmentFormProps) {
  // State to handle the mobility aid radio button
  const [mobilityAidsRequired, setMobilityAidsRequired] = useState<boolean>(
    !!physicianAssessment?.mobilityAids?.length
  );

  const { setFieldValue } = useFormikContext();

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
            value={
              physicianAssessment.disabilityCertificationDate
                ? formatDate(new Date(physicianAssessment.disabilityCertificationDate), true)
                : ''
            }
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
          <CheckboxGroupField
            name="physicianAssessment.patientCondition"
            label="Please select the condition"
            required
          >
            <Stack>
              <Checkbox value="AFFECTS_MOBILITY">
                Applicant has a disability that affects mobility and the ability to walk
                specifically
              </Checkbox>
              <Checkbox value="CANNOT_WALK_100M">
                Applicant can NOT walk 100 meters without risk to health
              </Checkbox>
              <Checkbox value="MOBILITY_AID_REQUIRED">
                Applicant requires the use of a mobiliy aid in order to travel any distance
              </Checkbox>
              <Checkbox value="OTHER">Other</Checkbox>
            </Stack>
          </CheckboxGroupField>

          {physicianAssessment.patientCondition?.includes('OTHER') && (
            <TextArea
              name="physicianAssessment.otherPatientCondition"
              label="Other condition description"
              required
            />
          )}
        </Stack>
      </Box>

      <Divider borderColor="border.secondary" />

      {/* Mobility Aids Section */}

      <Box paddingY="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Mobility Aids'}
        </Text>

        <Stack spacing="20px">
          <FormControl isRequired paddingBottom="24px">
            <FormLabel>{'Are you currently using any mobility aids?'}</FormLabel>
            <RadioGroup
              value={mobilityAidsRequired ? '1' : '0'}
              onChange={value => {
                setMobilityAidsRequired(value === '1' ? true : false);
                if (value === '0') {
                  setFieldValue('physicianAssessment.mobilityAids', []);
                }
              }}
            >
              <Stack>
                <Radio value={'1'}>{'Yes, I am'}</Radio>
                <Radio value={'0'}>{'No, I am not'}</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          {mobilityAidsRequired && (
            <CheckboxGroupField
              name="physicianAssessment.mobilityAids"
              label="What mobility aids are you currently using?"
              required
            >
              <Stack>
                <Checkbox value={'MANUAL_CHAIR'}>{'Manual Wheelchair'}</Checkbox>
                <Checkbox value={'ELECTRIC_CHAIR'}>{'Power Wheelchair'}</Checkbox>
                <Checkbox value={'SCOOTER'}>{'Scooter'}</Checkbox>
                <Checkbox value={'WALKER'}>{'Walker'}</Checkbox>
                <Checkbox value={'CRUTCHES'}>{'Crutches'}</Checkbox>
                <Checkbox value={'CANE'}>{'Cane'}</Checkbox>
                <Checkbox value={'OTHERS'}>{'Others'}</Checkbox>
              </Stack>
            </CheckboxGroupField>
          )}

          {physicianAssessment.mobilityAids?.includes('OTHERS') && (
            <Box>
              <TextAreaField
                name="physicianAssessment.otherMobilityAids"
                label="Description"
                required
              />
            </Box>
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
            value={
              physicianAssessment.temporaryPermitExpiry
                ? formatDate(new Date(physicianAssessment.temporaryPermitExpiry), true)
                : ''
            }
          >
            <FormHelperText color="text.secondary">{'Format: YYYY-MM-DD'}</FormHelperText>
          </DateField>
        )}
      </Box>
    </>
  );
}
