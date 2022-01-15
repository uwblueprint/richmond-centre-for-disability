import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  FormHelperText,
  Box,
  RadioGroup,
  Radio,
  Textarea,
  SimpleGrid,
} from '@chakra-ui/react'; // Chakra UI
import { ReasonForReplacement as ReasonForReplacementEnum } from '@lib/graphql/types'; // Reason For Replacement Enum
import { formatDate } from '@lib/utils/format'; // Date formatter util
import { ReasonForReplacementFormData } from '@tools/admin/requests/reason-for-replacement';

type ReasonForReplacementProps = {
  readonly reasonForReplacement: ReasonForReplacementFormData;
  readonly onChange: (updatedData: ReasonForReplacementFormData) => void;
};

/**
 * ReasonForReplacementForm Component for allowing users to edit reason for replacement information.
 *
 * @param {ReasonForReplacementFormData} reasonForReplacement Data Structure that holds all reason for replacement information for a client request.
 * @param onChange Function that uses the updated values from form.
 */
export default function ReasonForReplacementForm({
  reasonForReplacement,
  onChange,
}: ReasonForReplacementProps) {
  return (
    <>
      <FormControl isRequired as="fieldset" paddingBottom="24px">
        <FormLabel as="legend" marginBottom="8px">
          {'Reason'}
        </FormLabel>
        <RadioGroup
          value={reasonForReplacement.reason || undefined}
          onChange={value =>
            onChange({
              ...reasonForReplacement,
              reason: value as ReasonForReplacementEnum,
            })
          }
        >
          <Stack>
            <Radio value={'LOST'}>{'Lost'}</Radio>
            <Radio value={'STOLEN'}>{'Stolen'}</Radio>
            <Radio value={'OTHER'}>{'Other'}</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      {/* Conditionally render this section if Lost is selected as replacement reason */}
      {reasonForReplacement.reason === 'LOST' && (
        <>
          <SimpleGrid columns={[1, 1, 1, 2]} spacing="32px">
            <FormControl isRequired paddingBottom="24px">
              <FormLabel>{`Date`}</FormLabel>
              <Input
                type="date"
                value={
                  reasonForReplacement.lostTimestamp
                    ? formatDate(new Date(reasonForReplacement.lostTimestamp), true)
                    : ''
                }
                onChange={event => {
                  const updatedlostTimestamp = new Date(reasonForReplacement.lostTimestamp);
                  updatedlostTimestamp.setFullYear(parseInt(event.target.value.substring(0, 4)));
                  updatedlostTimestamp.setMonth(parseInt(event.target.value.substring(5, 7)) - 1);
                  updatedlostTimestamp.setDate(parseInt(event.target.value.substring(8, 10)));

                  onChange({
                    ...reasonForReplacement,
                    lostTimestamp: Date.parse(updatedlostTimestamp.toString())
                      ? updatedlostTimestamp
                      : reasonForReplacement.lostTimestamp,
                  });
                }}
              />
            </FormControl>

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
                  new Date(reasonForReplacement.lostTimestamp).toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                  }) || ''
                }
                onChange={event => {
                  const updatedlostTimestamp = new Date(reasonForReplacement.lostTimestamp);
                  updatedlostTimestamp.setHours(parseInt(event.target.value.substring(0, 2)));
                  updatedlostTimestamp.setMinutes(parseInt(event.target.value.substring(3, 5)));

                  onChange({
                    ...reasonForReplacement,
                    lostTimestamp: Date.parse(updatedlostTimestamp.toString())
                      ? updatedlostTimestamp
                      : reasonForReplacement.lostTimestamp,
                  });
                }}
              />
              <FormHelperText color="text.seconday">{'Example: HH:MM AM/PM'}</FormHelperText>
            </FormControl>
          </SimpleGrid>

          <FormControl isRequired paddingBottom="24px">
            <FormLabel>{'Location'}</FormLabel>
            <Input
              value={reasonForReplacement.lostLocation || ''}
              onChange={event =>
                onChange({
                  ...reasonForReplacement,
                  lostLocation: event.target.value,
                })
              }
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{'Event description'}</FormLabel>
            <Textarea
              value={reasonForReplacement.eventDescription || ''}
              onChange={event =>
                onChange({
                  ...reasonForReplacement,
                  eventDescription: event.target.value,
                })
              }
            />
          </FormControl>
        </>
      )}

      {/* Conditionally renders this section if Stolen is selected as replacement reason */}
      {reasonForReplacement.reason === 'STOLEN' && (
        <>
          <SimpleGrid columns={[1, 1, 1, 1, 3]} spacing="26px">
            <FormControl isRequired paddingBottom="24px">
              <FormLabel>{'Police file number'}</FormLabel>
              <Input
                value={reasonForReplacement.stolenPoliceFileNumber || undefined}
                onChange={event =>
                  onChange({
                    ...reasonForReplacement,
                    stolenPoliceFileNumber: parseInt(event.target.value),
                  })
                }
              />
            </FormControl>

            <FormControl paddingBottom="24px">
              <FormLabel>
                {'Jurisdiction '}
                <Box as="span" textStyle="body-regular" fontSize="sm">
                  {'(optional)'}
                </Box>
              </FormLabel>
              <Input
                value={reasonForReplacement.stolenJurisdiction || ''}
                onChange={event =>
                  onChange({
                    ...reasonForReplacement,
                    stolenJurisdiction: event.target.value,
                  })
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>
                {'Police officer name '}
                <Box as="span" textStyle="body-regular" fontSize="sm">
                  {'(optional)'}
                </Box>
              </FormLabel>
              <Input
                value={reasonForReplacement.stolenPoliceOfficerName || ''}
                onChange={event =>
                  onChange({
                    ...reasonForReplacement,
                    stolenPoliceOfficerName: event.target.value,
                  })
                }
              />
            </FormControl>
          </SimpleGrid>
        </>
      )}

      {/* Conditionally renders this section if Other is selected as replacement reason */}
      {reasonForReplacement.reason === 'OTHER' && (
        <FormControl isRequired>
          <FormLabel>{'Event description'}</FormLabel>
          <Textarea
            value={reasonForReplacement.eventDescription || ''}
            onChange={event =>
              onChange({
                ...reasonForReplacement,
                eventDescription: event.target.value,
              })
            }
          />
        </FormControl>
      )}
    </>
  );
}
