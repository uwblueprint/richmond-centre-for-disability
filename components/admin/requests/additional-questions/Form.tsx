import { Stack, Radio, Box } from '@chakra-ui/react'; // Chakra UI
import RadioGroupField from '@components/form/RadioGroupField';
import TextAreaField from '@components/form/TextAreaField';
import { AdditionalInformationFormData } from '@tools/admin/requests/additional-questions'; // AdditionalQuestions type

type AdditionalQuestionsFormProps = {
  additionalInformation: AdditionalInformationFormData;
};

export default function AdditionalQuestionsForm({
  additionalInformation,
}: AdditionalQuestionsFormProps) {
  return (
    <>
      <Box paddingBottom="24px">
        <RadioGroupField
          name="additionalInformation.usesAccessibleConvertedVan"
          label="Is the applicant using an accessible converted van?"
          required
          value={
            additionalInformation.usesAccessibleConvertedVan === null
              ? undefined
              : Number(additionalInformation.usesAccessibleConvertedVan)
          }
        >
          <Stack>
            <Radio value={1}>{'Yes'}</Radio>
            <Radio value={0}>{'No'}</Radio>
          </Stack>
        </RadioGroupField>
      </Box>

      {Number(additionalInformation.usesAccessibleConvertedVan) === 1 && (
        <Box paddingBottom="24px">
          <RadioGroupField
            name="additionalInformation.accessibleConvertedVanLoadingMethod"
            label="Please specify their loading method:"
            required
          >
            <Stack>
              <Radio value={'SIDE_LOADING'}>{'Side loading'}</Radio>
              <Radio value={'END_LOADING'}>{'End loading'}</Radio>
            </Stack>
          </RadioGroupField>
        </Box>
      )}

      <RadioGroupField
        name="additionalInformation.requiresWiderParkingSpace"
        label="Does the applicant need a wider accessible parking space?"
        required
        value={
          additionalInformation.requiresWiderParkingSpace === null
            ? undefined
            : Number(additionalInformation.requiresWiderParkingSpace)
        }
      >
        <Stack>
          <Radio value={1}>{'Yes'}</Radio>
          <Radio value={0}>{'No'}</Radio>
        </Stack>
      </RadioGroupField>

      {Number(additionalInformation.requiresWiderParkingSpace) === 1 && (
        <Box paddingTop="24px">
          <RadioGroupField
            name="additionalInformation.requiresWiderParkingSpaceReason"
            label="Please specify the reason"
            required
          >
            <Stack>
              <Radio value={'HAS_ACCESSIBLE_VAN'}>{'Accessible van'}</Radio>
              <Radio value={'MEDICAL_REASONS'}>{'Medical reason'}</Radio>
              <Radio value={'OTHER'}>{'Other'}</Radio>
            </Stack>
          </RadioGroupField>
        </Box>
      )}

      {additionalInformation.requiresWiderParkingSpaceReason === 'OTHER' && (
        <Box paddingTop="24px">
          <TextAreaField
            name="additionalInformation.otherRequiresWiderParkingSpaceReason"
            label="Description of the reason"
            required
          />
        </Box>
      )}
    </>
  );
}
