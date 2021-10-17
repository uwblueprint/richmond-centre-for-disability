import { GridItem, Text, FormControl, FormLabel, Stack, Radio, RadioGroup } from '@chakra-ui/react'; // Chakra UI
// import { AdditionalQuestionsFormData } from '@tools/components/admin/requests/forms/renewals/AdditionalQuestionsFormData';

type AdditionalQuestionsFormProps = {
  // data: AdditionalQuestionsFormData;
  // onSave: (additionalQuestionsFormData: AdditionalQuestionsFormData) => void;
};

/**
 * Custom Card component with styling.
 * @param props - Props
 * @returns Additional Questions Form Card.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function AdditionalQuestionsForm(props: AdditionalQuestionsFormProps) {
  return (
    <GridItem
      padding="32px 40px 40px"
      background="white"
      border="1px solid"
      borderColor="border.secondary"
      boxSizing="border-box"
      borderRadius="8px"
    >
      <Text as="h5" textStyle="display-small-semibold">
        {'Additional Questions'}
      </Text>

      <FormControl as="fieldset" isRequired paddingTop="20px">
        <FormLabel>{'Is the applicant using an accessible converted van?'}</FormLabel>
        <RadioGroup>
          <Stack>
            <Radio value={'0'}>{'Yes'}</Radio>
            <Radio value={'1'}>{'No'}</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      <FormControl as="fieldset" isRequired paddingTop="24px">
        <FormLabel>{'Does the applicant need a wider accessible parking space?'}</FormLabel>
        <RadioGroup>
          <Stack>
            <Radio value="0">{'Yes'}</Radio>
            <Radio value="1">{'No'}</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
    </GridItem>
  );
}
