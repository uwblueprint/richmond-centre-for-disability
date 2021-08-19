import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Text,
  Stack,
  FormHelperText,
  Box,
  RadioGroup,
  Radio,
  Textarea,
} from '@chakra-ui/react'; // Chakra UI
import { useState, useEffect, SyntheticEvent, ReactNode } from 'react'; // React
import { ReplacementData } from '@tools/components/internal/requests/reason-for-replacement-card'; // ReplacementData type

type EditReasonForReplacementModalProps = {
  readonly replacement: ReplacementData;
  readonly children: ReactNode;
};

export default function EditReasonForReplacementModal({
  replacement,
  children,
}: EditReasonForReplacementModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // TODO: need to replace values with ReasonForReplacement enum when that is available
  const [reason, setReason] = useState('');

  //   Lost Information state
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [timestamp, setTimestamp] = useState('');
  const [location, setLocation] = useState<string | undefined>('');
  const [eventDescription, setEventDescription] = useState<string | undefined>('');

  //   Stolen Information state
  const [policeFileNumber, setPoliceFileNumber] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [policeOfficerName, setPoliceOfficerName] = useState('');

  //   Other information state
  const [otherEventDescription, setOtherEventDescription] = useState('');

  useEffect(() => {
    setReason(replacement.reason);
    setTimestamp(replacement.lostTimestamp);
    setLocation(replacement.lostLocation || undefined);
    setEventDescription(replacement.description || undefined);
  }, [replacement]);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    //  TODO: Will be addressed in API hookup
    onClose();
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal onClose={onClose} isOpen={isOpen} scrollBehavior="inside" size="lg">
        <ModalOverlay />
        <form onSubmit={handleSubmit}>
          <ModalContent paddingX="36px">
            <ModalHeader paddingBottom="12px" paddingTop="24px" paddingX="4px">
              <Text as="h2" textStyle="display-medium-bold">
                {'Edit Reason for Replacement'}
              </Text>
            </ModalHeader>
            <ModalBody paddingY="16px" paddingX="4px">
              <FormControl as="fieldset" paddingBottom="24px">
                <FormLabel as="legend" marginBottom="8px">
                  {'Reason'}
                </FormLabel>
                <RadioGroup onChange={setReason} value={reason}>
                  <Stack>
                    <Radio value="Lost">{'Lost'}</Radio>
                    <Radio value="Stolen">{'Stolen'}</Radio>
                    <Radio value="Other">{'Other'}</Radio>
                    {/* TODO: need to replace values with ReasonForReplacement enum when that is available */}
                  </Stack>
                </RadioGroup>
              </FormControl>

              {/* Conditionally render this section if Lost is selected as replacement reason */}
              {reason === 'Lost' && (
                <>
                  <FormControl isRequired paddingBottom="24px">
                    <FormLabel>{`Date`}</FormLabel>
                    <Input
                      type="date"
                      value={date}
                      onChange={event => setDate(event.target.value)}
                    />
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
                      value={timestamp}
                      onChange={event => setTimestamp(event.target.value)}
                    />
                    <FormHelperText color="text.seconday">{'hh:mm am/pm'}</FormHelperText>
                  </FormControl>

                  <FormControl isRequired paddingBottom="24px">
                    <FormLabel>{'Location'}</FormLabel>
                    <Input
                      placeholder={'eg. Library'}
                      value={location}
                      onChange={event => setLocation(event.target.value)}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>{'Event description'}</FormLabel>
                    <Textarea
                      placeholder={'Explain what happened.'}
                      value={eventDescription}
                      onChange={event => setEventDescription(event.target.value)}
                    />
                  </FormControl>
                </>
              )}

              {/* Conditionally renders this section if Stolen is selected as replacement reason */}
              {reason === 'Stolen' && (
                <>
                  <FormControl isRequired paddingBottom="24px">
                    <FormLabel>{'Police file number'}</FormLabel>
                    <Input
                      value={policeFileNumber}
                      onChange={event => setPoliceFileNumber(event.target.value)}
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
                      value={jurisdiction}
                      onChange={event => setJurisdiction(event.target.value)}
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
                      value={policeOfficerName}
                      onChange={event => setPoliceOfficerName(event.target.value)}
                    />
                  </FormControl>
                </>
              )}

              {/* Conditionally renders this section if Other is selected as replacement reason */}
              {reason === 'Other' && (
                <FormControl isRequired>
                  <FormLabel>{'Event description'}</FormLabel>
                  <Textarea
                    placeholder={'Explain what happened.'}
                    value={otherEventDescription}
                    onChange={event => setOtherEventDescription(event.target.value)}
                  />
                </FormControl>
              )}
            </ModalBody>
            <ModalFooter paddingBottom="24px" paddingTop="8px">
              <Button colorScheme="gray" variant="solid" onClick={onClose}>
                {'Cancel'}
              </Button>
              <Button variant="solid" type="submit" ml={'12px'}>
                {'Save'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}
