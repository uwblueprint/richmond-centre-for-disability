import { FormControl, FormLabel, Stack, Radio, RadioGroup } from '@chakra-ui/react'; // Chakra UI
import { AdditionalInformationFormData } from '@tools/admin/requests/additional-questions'; // AdditionalQuestions type

type AdditionalQuestionsFormProps = {
  data: AdditionalInformationFormData;
  onChange: (additionalQuestions: AdditionalInformationFormData) => void;
};

export default function AdditionalQuestionsForm({ data, onChange }: AdditionalQuestionsFormProps) {
  return (
    <>
      <FormControl as="fieldset" isRequired>
        <FormLabel>{'Is the applicant using an accessible converted van?'}</FormLabel>
        <RadioGroup
          value={
            data.usesAccessibleConvertedVan === null
              ? undefined
              : data.usesAccessibleConvertedVan
              ? '0'
              : '1'
          }
          onChange={value =>
            onChange({ ...data, usesAccessibleConvertedVan: value === '0' ? true : false })
          }
        >
          <Stack>
            <Radio value={'0'}>{'Yes'}</Radio>
            <Radio value={'1'}>{'No'}</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      <FormControl as="fieldset" isRequired paddingTop="24px">
        <FormLabel>{'Does the applicant need a wider accessible parking space?'}</FormLabel>
        <RadioGroup
          value={
            data.requiresWiderParkingSpace === null
              ? undefined
              : data.requiresWiderParkingSpace
              ? '0'
              : '1'
          }
          onChange={value =>
            onChange({ ...data, requiresWiderParkingSpace: value === '0' ? true : false })
          }
        >
          <Stack>
            <Radio value="0">{'Yes'}</Radio>
            <Radio value="1">{'No'}</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
    </>
  );
}
