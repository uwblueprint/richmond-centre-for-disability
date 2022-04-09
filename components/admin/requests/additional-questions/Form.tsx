import { Stack, Radio } from '@chakra-ui/react'; // Chakra UI
import RadioGroupField from '@components/form/RadioGroupField';
import TextAreaField from '@components/form/TextAreaField';
import {
  AccessibleConvertedVanLoadingMethod,
  RequiresWiderParkingSpaceReason,
} from '@prisma/client';
import { AdditionalInformationFormData } from '@tools/admin/requests/additional-questions'; // AdditionalQuestions type

type AdditionalQuestionsFormProps = {
  additionalInformation: AdditionalInformationFormData;
};

export default function AdditionalQuestionsForm({
  additionalInformation,
}: AdditionalQuestionsFormProps) {
  return (
    <>
      {/* NOTETOSELF: Check if initial values work */}
      <RadioGroupField
        name="additionalInformation.usesAccessibleConvertedVan"
        label="Is the applicant using an accessible converted van?"
        required
      >
        <Stack>
          <Radio value={'0'}>{'Yes'}</Radio>
          <Radio value={'1'}>{'No'}</Radio>
        </Stack>
      </RadioGroupField>

      {/* TODO: add padding */}

      {/* TODO: Fix TypeScript error */}
      {additionalInformation.usesAccessibleConvertedVan && (
        <RadioGroupField
          name="additionalInformation.accessibleConvertedVanLoadingMethod"
          label="Please specify their loading method:"
          required
        >
          <Stack>
            <Radio value={AccessibleConvertedVanLoadingMethod.SIDE_LOADING}>{'Side loading'}</Radio>
            <Radio value={AccessibleConvertedVanLoadingMethod.END_LOADING}>{'End loading'}</Radio>
          </Stack>
        </RadioGroupField>
      )}

      <RadioGroupField
        name="additionalInformation.requiresWiderParkingSpace"
        label="Does the applicant need a wider accessible parking space?"
        required
      >
        <Stack>
          <Radio value={1}>{'Yes'}</Radio>
          <Radio value={0}>{'No'}</Radio>
        </Stack>
      </RadioGroupField>

      {additionalInformation.requiresWiderParkingSpace && (
        <RadioGroupField
          name="additionalInformation.requiresWiderParkingSpaceReason"
          label="Please specify the reason"
          required
        >
          <Stack>
            <Radio value={RequiresWiderParkingSpaceReason.HAS_ACCESSIBLE_VAN}>
              {'Accessible van'}
            </Radio>
            <Radio value={RequiresWiderParkingSpaceReason.MEDICAL_REASONS}>
              {'Medical reason'}
            </Radio>
            <Radio value={RequiresWiderParkingSpaceReason.OTHER}>{'Other'}</Radio>
          </Stack>
        </RadioGroupField>
      )}

      {/* TODO: Fix TypeScript error */}
      {additionalInformation.requiresWiderParkingSpaceReason ===
        RequiresWiderParkingSpaceReason.OTHER && (
        <TextAreaField
          name="additionalInformation.otherRequiresWiderParkingSpaceReason"
          label="Description of the reason"
          required
        />
      )}
    </>
  );
}
