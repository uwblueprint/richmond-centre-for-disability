import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  FormHelperText,
  Box,
  Radio,
  SimpleGrid,
} from '@chakra-ui/react'; // Chakra UI
import DateField from '@components/form/DateField';
import NumberField from '@components/form/NumberField';
import RadioGroupField from '@components/form/RadioGroupField';
import TextArea from '@components/form/TextAreaField';
import TextField from '@components/form/TextField';
import { formatDateYYYYMMDDLocal } from '@lib/utils/date'; // Date formatter util
import { ReasonForReplacementFormData } from '@tools/admin/requests/reason-for-replacement';
import { useFormikContext } from 'formik';
import moment from 'moment';

type ReasonForReplacementProps = {
  readonly reasonForReplacement: ReasonForReplacementFormData;
};

/**
 * ReasonForReplacementForm Component for allowing users to edit reason for replacement information.
 *
 * @param {ReasonForReplacementFormData} reasonForReplacement Data Structure that holds all reason for replacement information for a client request.
 */
export default function ReasonForReplacementForm({
  reasonForReplacement,
}: ReasonForReplacementProps) {
  const { setFieldValue } = useFormikContext();

  return (
    <>
      <Box paddingBottom="24px">
        <RadioGroupField name="reasonForReplacement.reason" label="Reason" required>
          <Stack>
            <Radio
              value={'LOST'}
              onChange={() => {
                setFieldValue('paymentInformation.processingFee', '31');
              }}
            >
              {'Lost'}
            </Radio>
            <Radio
              value={'STOLEN'}
              onChange={() => {
                setFieldValue('paymentInformation.processingFee', '31');
              }}
            >
              {'Stolen'}
            </Radio>
            <Radio
              value={'MAIL_LOST'}
              onChange={() => {
                setFieldValue('paymentInformation.processingFee', '0');
              }}
            >
              {'Mail Lost'}
            </Radio>
            <Radio
              value={'OTHER'}
              onChange={() => {
                setFieldValue('paymentInformation.processingFee', '0');
              }}
            >
              {'Other'}
            </Radio>
            <Radio
              value={'OTHER'}
              onChange={() => {
                setFieldValue('paymentInformation.processingFee', '0');
              }}
            >
              {'Other'}
            </Radio>
          </Stack>
        </RadioGroupField>
      </Box>

      {/* Conditionally render this section if Lost is selected as replacement reason */}
      {reasonForReplacement.reason === 'LOST' && (
        <>
          <SimpleGrid columns={[1, 1, 1, 2]} spacing="32px">
            <Box paddingBottom="24px">
              <DateField
                name="reasonForReplacement.lostTimestamp"
                label="Date"
                required
                value={
                  reasonForReplacement.lostTimestamp
                    ? // lostTimestamp is the date in the LOCAL TIMEZONE, in YYYY-MM-DD format
                      // use moment to get Date object in local timezone as
                      // Date constructor defaults to UTC when given YYYY-MM-DD string
                      formatDateYYYYMMDDLocal(moment(reasonForReplacement.lostTimestamp).toDate())
                    : ''
                }
              />
            </Box>

            <FormControl paddingBottom="24px">
              <FormLabel>
                {'Timestamp '}
                <Box as="span" textStyle="body-regular" fontSize="sm">
                  {'(optional)'}
                </Box>
              </FormLabel>
              <Input
                type="time"
                value={
                  moment(reasonForReplacement.lostTimestamp).toDate().toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                  }) || ''
                }
                onChange={event => {
                  const updatedlostTimestamp = moment(reasonForReplacement.lostTimestamp);
                  updatedlostTimestamp.set('hour', parseInt(event.target.value.substring(0, 2)));
                  updatedlostTimestamp.set('minute', parseInt(event.target.value.substring(3, 5)));

                  setFieldValue(
                    'reasonForReplacement.lostTimestamp',
                    updatedlostTimestamp.toDate()
                  );
                }}
              />
              <FormHelperText color="text.secondary">{'Example: HH:MM AM/PM'}</FormHelperText>
            </FormControl>
          </SimpleGrid>

          <Box paddingBottom="24px">
            <TextField name="reasonForReplacement.lostLocation" label="Location" required />
          </Box>

          <TextArea
            name="reasonForReplacement.eventDescription"
            label="Event description"
            required
          />
        </>
      )}

      {/* Conditionally renders this section if Stolen is selected as replacement reason */}
      {reasonForReplacement.reason === 'STOLEN' && (
        <>
          <SimpleGrid columns={[1, 1, 1, 1, 3]} spacing="26px">
            <Box paddingBottom="24px">
              <NumberField
                name="reasonForReplacement.stolenPoliceFileNumber"
                label="Police file number"
                required
                value={reasonForReplacement.stolenPoliceFileNumber || ''}
              />
            </Box>

            <Box paddingBottom="24px">
              <TextField
                name="reasonForReplacement.stolenJurisdiction"
                label={
                  <>
                    {'Jurisdiction '}
                    <Box as="span" textStyle="body-regular" fontSize="sm">
                      {'(optional)'}
                    </Box>
                  </>
                }
              />
            </Box>

            <TextField
              name="reasonForReplacement.stolenPoliceOfficerName"
              label={
                <>
                  {'Police officer name '}
                  <Box as="span" textStyle="body-regular" fontSize="sm">
                    {'(optional)'}
                  </Box>
                </>
              }
            />
          </SimpleGrid>
        </>
      )}

      {/* Conditionally renders this section if Other is selected as replacement reason */}
      {reasonForReplacement.reason === 'OTHER' && (
        <TextArea name="reasonForReplacement.eventDescription" label="Event description" required />
      )}
    </>
  );
}
