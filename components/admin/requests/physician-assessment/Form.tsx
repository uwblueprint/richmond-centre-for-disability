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
} from '@chakra-ui/react'; // Chakra UI
import { PatientCondition, PermitType } from '@lib/graphql/types';
import { PhysicianAssessment } from '@tools/admin/requests/physician-assessment';
import { ChangeEventHandler } from 'react';

type PhysicianAssessmentFormProps = {
  readonly physicianAssessment: PhysicianAssessment;
  readonly onChange: (updatedData: PhysicianAssessment) => void;
};

/**
 * PhysicianAssessmentForm Component for allowing users to edit physician assessment information.
 *
 * @param {PhysicianAssessment} physicianAssessment Object that holds all physician assessment information for a client request.
 * @param onChange Function that uses the updated values from form.
 */
export default function PhysicianAssessmentForm({
  physicianAssessment,
  onChange,
}: PhysicianAssessmentFormProps) {
  const handleChange =
    (field: keyof PhysicianAssessment): ChangeEventHandler<HTMLInputElement> =>
    event => {
      onChange({
        ...physicianAssessment,
        [field]: event.target.value,
      });
    };

  return (
    <>
      <Box paddingBottom="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {`Physician’s Assessment`}
        </Text>
        <Stack spacing="20px">
          <FormControl isRequired>
            <FormLabel>{'Medical name of disabling condition(s)'}</FormLabel>
            <Input value={physicianAssessment?.disability} onChange={handleChange('disability')} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{'Physician’s certification date'}</FormLabel>
            <Input
              type="date"
              value={physicianAssessment.physicianCertificationDate}
              onChange={handleChange('physicianCertificationDate')}
            />
            <FormHelperText color="text.seconday">{'Format: YYYY-MM-DD'}</FormHelperText>
          </FormControl>
        </Stack>
      </Box>

      <Divider />

      {/* Patient Eligibility Section */}

      <Box paddingY="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Patient Eligibility'}
        </Text>

        <Stack spacing="20px">
          <FormControl isRequired>
            <FormLabel>{'Please select the condition'}</FormLabel>
            {/* TODO: Revise DB schema to replace the 3 boolean columns to a single enum column */}
            <RadioGroup
              value={physicianAssessment.patientCondition}
              onChange={value => {
                // handleChangedPatientEligibility
                onChange({
                  ...physicianAssessment,
                  patientCondition: value as PatientCondition,
                });
              }}
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
            </RadioGroup>
          </FormControl>

          {physicianAssessment.patientCondition === 'OTHER' && (
            <FormControl isRequired>
              <FormLabel>{'Description'}</FormLabel>
              <Textarea
                value={physicianAssessment.patientEligibilityDescription || ''}
                onChange={event =>
                  onChange({
                    ...physicianAssessment,
                    patientEligibilityDescription: event.target.value,
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

        <FormControl isRequired paddingBottom="24px">
          <FormLabel>{'This patient is experiencing a mobility impairment which is'}</FormLabel>
          <RadioGroup
            value={physicianAssessment.permitType}
            onChange={value =>
              onChange({
                ...physicianAssessment,
                permitType: value as PermitType,
              })
            }
          >
            <Stack>
              <Radio value={'PERMANENT'}>{'Permanent'}</Radio>
              <Radio value={'TEMPORARY'}>{'Temporary'}</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        {physicianAssessment.permitType === 'TEMPORARY' && (
          <FormControl isRequired>
            <FormLabel>{'Temporary permit will expire on'}</FormLabel>
            <Input
              type="date"
              value={physicianAssessment.temporaryPermitExpiryDate}
              onChange={event =>
                onChange({
                  ...physicianAssessment,
                  temporaryPermitExpiryDate: event.target.value,
                })
              }
            />
            <FormHelperText color="text.seconday">{'Format: YYYY-MM-DD'}</FormHelperText>
          </FormControl>
        )}
      </Box>
    </>
  );
}
