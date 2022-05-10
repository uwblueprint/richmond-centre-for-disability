import { Text, Stack, FormHelperText, Box, Divider, Radio } from '@chakra-ui/react'; // Chakra UI
import DateField from '@components/form/DateField';
import RadioGroupField from '@components/form/RadioGroupField';
import TextArea from '@components/form/TextAreaField';
import TextField from '@components/form/TextField';
import { PhysicianAssessment } from '@tools/admin/requests/physician-assessment';
import {
  FormControl,
  FormLabel,
  Input,
  Text,
  Stack,
  FormHelperText,
  Box,
  Divider,
  RadioGroup,
  Radio,
  Textarea,
  CheckboxGroup,
  Checkbox,
} from '@chakra-ui/react'; // Chakra UI
import { MobilityAid, PatientCondition, PermitType } from '@lib/graphql/types';
import { formatDateYYYYMMDD } from '@lib/utils/format';
import { PhysicianAssessment } from '@tools/admin/requests/physician-assessment';
import { ChangeEventHandler, useState } from 'react';

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
  // State to handle the yes/no mobility aid radio
  const [mobilityAidsRequired, setMobilityAidsRequired] = useState<boolean>(
    !!physicianAssessment?.mobilityAids?.length
  );

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
                  onChange({
                    ...physicianAssessment,
                    mobilityAids: [],
                  });
                }
              }}
            >
              <Stack>
                <Radio value={'1'}>{'Yes, I am'}</Radio>
                <Radio value={'0'}>{'No, I am not'}</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          {mobilityAidsRequired === true && (
            <FormControl isRequired>
              <FormLabel>{'What mobility are you currently using?'}</FormLabel>
              <CheckboxGroup
                value={physicianAssessment.mobilityAids || undefined}
                onChange={value => {
                  onChange({
                    ...physicianAssessment,
                    mobilityAids: value as MobilityAid[],
                  });
                }}
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
              </CheckboxGroup>
            </FormControl>
          )}

          {physicianAssessment?.mobilityAids?.includes('OTHERS') && (
            <FormControl isRequired>
              <FormLabel>{'Description'}</FormLabel>
              <Textarea
                value={physicianAssessment.otherMobilityAids || undefined}
                onChange={event =>
                  onChange({
                    ...physicianAssessment,
                    otherMobilityAids: event.target.value,
                  })
                }
              />
            </FormControl>
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
