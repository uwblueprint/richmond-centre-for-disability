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
} from '@chakra-ui/react'; // Chakra UI
import { ReasonForReplacement as ReasonForReplacementEnum } from '@lib/graphql/types'; // Reason For Replacement Enum
import { ReasonForReplacement } from '@tools/components/admin/requests/forms/types'; // Reason For Replacement Type

type ReasonForReplacementProps = {
  readonly reasonForReplacement: ReasonForReplacement;
  readonly onChange: (updatedData: ReasonForReplacement) => void;
};

/**
 * ReasonForReplacementForm Component for allowing users to edit reason for replacement information.
 *
 * @param {ReasonForReplacement} ReasonForReplacementForm Data Structure that holds all reason for replacement information for a client request.
 * @param onChange Function that uses the updated values from form.
 */
export default function ReasonForReplacementForm({
  reasonForReplacement,
  onChange,
}: ReasonForReplacementProps) {
  return (
    <>
      <FormControl as="fieldset" paddingBottom="24px">
        <FormLabel as="legend" marginBottom="8px">
          {'Reason'}
        </FormLabel>
        <RadioGroup
          value={reasonForReplacement.reason}
          onChange={value =>
            onChange({
              ...reasonForReplacement,
              reason: value as ReasonForReplacementEnum,
            })
          }
        >
          <Stack>
            <Radio value={ReasonForReplacementEnum.Lost}>{'Lost'}</Radio>
            <Radio value={ReasonForReplacementEnum.Stolen}>{'Stolen'}</Radio>
            <Radio value={ReasonForReplacementEnum.Other}>{'Other'}</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      {/* Conditionally render this section if Lost is selected as replacement reason */}
      {reasonForReplacement.reason === ReasonForReplacementEnum.Lost && (
        <>
          <FormControl isRequired paddingBottom="24px">
            <FormLabel>{`Date`}</FormLabel>
            <Input type="date" />
          </FormControl>

          <FormControl paddingBottom="24px">
            <FormLabel>
              {'Timestamp '}
              <Box as="span" textStyle="body-regular">
                {'(optional)'}
              </Box>
            </FormLabel>
            <Input
              placeholder={'eg. 04:00 pm'}
              value={reasonForReplacement.lostTimestamp || ''}
              onChange={event =>
                onChange({
                  ...reasonForReplacement,
                  lostTimestamp: event.target.value,
                })
              }
            />
            <FormHelperText color="text.seconday">{'hh:mm am/pm'}</FormHelperText>
          </FormControl>

          <FormControl isRequired paddingBottom="24px">
            <FormLabel>{'Location'}</FormLabel>
            <Input
              placeholder={'eg. Library'}
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
              placeholder={'Explain what happened.'}
              value={reasonForReplacement.description || ''}
              onChange={event =>
                onChange({
                  ...reasonForReplacement,
                  description: event.target.value,
                })
              }
            />
          </FormControl>
        </>
      )}

      {/* Conditionally renders this section if Stolen is selected as replacement reason */}
      {reasonForReplacement.reason === ReasonForReplacementEnum.Stolen && (
        <>
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
              <Box as="span" textStyle="body-regular">
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
              <Box as="span" textStyle="body-regular">
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
        </>
      )}

      {/* Conditionally renders this section if Other is selected as replacement reason */}
      {reasonForReplacement.reason === ReasonForReplacementEnum.Other && (
        <FormControl isRequired>
          <FormLabel>{'Event description'}</FormLabel>
          <Textarea
            placeholder={'Explain what happened.'}
            value={reasonForReplacement.description || ''}
            onChange={event =>
              onChange({
                ...reasonForReplacement,
                description: event.target.value,
              })
            }
          />
        </FormControl>
      )}
    </>
  );
}
