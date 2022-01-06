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
import { PermitType, Eligibility } from '@lib/graphql/types';
import { PhysicianAssessmentInformation } from '@tools/components/admin/requests/forms/types';
import { ChangeEventHandler } from 'react';

type PhysicianAssessmentFormProps = {
  readonly physicianAssessmentInformation: PhysicianAssessmentInformation;
  readonly onChange: (updatedData: PhysicianAssessmentInformation) => void;
};

/**
 * PhysicianAssessmentForm Component for allowing users to edit physician assessment information.
 *
 * @param {PhysicianAssessmentInformation} physicianAssessmentInformation Object that holds all physician assessment information for a client request.
 * @param onChange Function that uses the updated values from form.
 */
export default function PhysicianAssessmentForm({
  physicianAssessmentInformation,
  onChange,
}: PhysicianAssessmentFormProps) {
  const handleChange =
    (field: keyof PhysicianAssessmentInformation): ChangeEventHandler<HTMLInputElement> =>
    event => {
      onChange({
        ...physicianAssessmentInformation,
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
            <Input
              value={physicianAssessmentInformation?.disability}
              onChange={handleChange('disability')}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{'Physician’s certification date'}</FormLabel>
            <Input
              type="date"
              value={physicianAssessmentInformation.physicianCertificationDate}
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
              value={
                physicianAssessmentInformation.patientEligibility === Eligibility.AffectsMobility
                  ? '0'
                  : physicianAssessmentInformation.patientEligibility ===
                    Eligibility.CannotWalk_100M
                  ? '1'
                  : physicianAssessmentInformation.patientEligibility ===
                    Eligibility.MobilityAidRequired
                  ? '2'
                  : '3'
              }
              onChange={value => {
                // handleChangedPatientEligibility
                onChange({
                  ...physicianAssessmentInformation,
                  patientEligibility:
                    value === '0'
                      ? Eligibility.AffectsMobility
                      : value === '1'
                      ? Eligibility.CannotWalk_100M
                      : value === '2'
                      ? Eligibility.MobilityAidRequired
                      : Eligibility.Other,
                  ...(value !== '3' && {
                    patientEligibilityDescription: undefined,
                  }),
                });
              }}
            >
              <Stack>
                <Radio value={'0'}>
                  {
                    'Applicant has a disability that affects mobility and the ability to walk specifically'
                  }
                </Radio>
                <Radio value={'1'}>
                  {'Applicant can NOT walk 100 meters without risk to health'}
                </Radio>
                <Radio value={'2'}>
                  {'Applicant requires the use of a mobiliy aid in order to travel any distance'}
                </Radio>
                <Radio value={'3'}>{'Other'}</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          {physicianAssessmentInformation.patientEligibility === Eligibility.Other && (
            <FormControl isRequired>
              <FormLabel>{'Description'}</FormLabel>
              <Textarea
                value={physicianAssessmentInformation.patientEligibilityDescription || ''}
                onChange={event =>
                  onChange({
                    ...physicianAssessmentInformation,
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
            value={physicianAssessmentInformation.permitType === PermitType.Permanent ? '0' : '1'}
            onChange={value =>
              onChange({
                ...physicianAssessmentInformation,
                permitType: value === '0' ? PermitType.Permanent : PermitType.Temporary,
              })
            }
          >
            <Stack>
              <Radio value={'0'}>{'Permanent'}</Radio>
              <Radio value={'1'}>{'Temporary'}</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        {physicianAssessmentInformation.permitType === PermitType.Temporary && (
          <FormControl isRequired>
            <FormLabel>{'Temporary permit will expire on'}</FormLabel>
            <Input
              type="date"
              value={physicianAssessmentInformation.temporaryPermitExpiryDate}
              onChange={event =>
                onChange({
                  ...physicianAssessmentInformation,
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
