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
import { PermitType } from '@lib/graphql/types';
import { PhysicianAssessmentInformation } from '@tools/components/admin/requests/forms/types';
import React from 'react';

type PhysicianAssessmentFormProps = {
  readonly physicianAssessmentInformation: PhysicianAssessmentInformation;
  readonly onChange: (updatedData: PhysicianAssessmentInformation) => void;
};

/**
 * PhysicianAssessmentForm Component for allowing users to edit physician assessment information.
 *
 * @param {PhysicianAssessmentInformation} physicianAssessmentInformation Data Structure that holds all physician assessment information for a client request.
 * @param onChange Function that uses the updated values from form.
 */
export default function PhysicianAssessmentForm({
  physicianAssessmentInformation,
  onChange,
}: PhysicianAssessmentFormProps) {
  return (
    <>
      {/* Personal Information Section */}
      <Box paddingBottom="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {`Physician’s Assessment`}
        </Text>
        <Stack spacing="20px">
          <FormControl isRequired>
            <FormLabel>{'Medical name of disabling condition(s)'}</FormLabel>
            <Input
              value={physicianAssessmentInformation?.disability}
              onChange={event =>
                onChange({
                  ...physicianAssessmentInformation,
                  disability: event.target.value,
                })
              }
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{'Physician’s certification date'}</FormLabel>
            <Input
              type="date"
              value={physicianAssessmentInformation.physicianCertificationDate}
              onChange={event =>
                onChange({
                  ...physicianAssessmentInformation,
                  physicianCertificationDate: event.target.value,
                })
              }
            />
            <FormHelperText color="text.seconday">{'Format: YYYY-MM-DD'}</FormHelperText>
          </FormControl>
        </Stack>
      </Box>

      <Divider borderColor="border.secondary" />

      {/* Patient Eligibility Section */}

      <Box paddingY="32px">
        <Text as="h3" textStyle="heading" paddingBottom="24px">
          {'Patient Eligibility'}
        </Text>

        <Stack spacing="20px">
          <FormControl isRequired>
            <FormLabel>{'Please select the condition'}</FormLabel>
            <RadioGroup
              value={
                physicianAssessmentInformation.affectsMobility
                  ? '0'
                  : physicianAssessmentInformation.cannotWalk100m
                  ? '1'
                  : physicianAssessmentInformation.mobilityAidRequired
                  ? '2'
                  : '3'
              }
              onChange={value => {
                // handleChangedPatientEligibility
                onChange({
                  ...physicianAssessmentInformation,
                  affectsMobility: value === '0',
                  cannotWalk100m: value === '1',
                  mobilityAidRequired: value === '2',
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

          {physicianAssessmentInformation.affectsMobility === false &&
            physicianAssessmentInformation.cannotWalk100m == false &&
            physicianAssessmentInformation.mobilityAidRequired === false && (
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

        {physicianAssessmentInformation.permitType == PermitType.Temporary && (
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
