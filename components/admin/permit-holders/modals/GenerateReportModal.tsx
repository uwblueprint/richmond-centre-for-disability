import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  Box,
  Stack,
  Input,
  FormControl,
  FormLabel,
  Checkbox,
  SimpleGrid,
  ListItem,
} from '@chakra-ui/react'; // Chakra UI
import { DownloadIcon } from '@chakra-ui/icons';
import { useState } from 'react'; // React

type GenerateReportProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

enum GenerateReportModalEnum {
  SELECT_COLUMNS = 1,
  EXPORT = 2,
}

export default function GenerateReportModal(props: GenerateReportProps) {
  const { isOpen, onClose } = props;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [step, setStep] = useState(GenerateReportModalEnum.SELECT_COLUMNS);

  if (step == 1) {
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose} isCentered size={'xl'}>
          <ModalOverlay />
          <form>
            <ModalContent paddingLeft={'10px'} maxWidth="40rem">
              <ModalHeader paddingTop="24px" paddingBottom="12px">
                <Text textStyle="display-medium-bold">Permit Holder Report</Text>
              </ModalHeader>
              <ModalBody paddingY="20px">
                <Box paddingBottom="32px">
                  <Stack direction="row" spacing="20px">
                    <FormControl isRequired>
                      <FormLabel>{'Expiry start Date'}</FormLabel>
                      <Input
                        type="date"
                        width="184px"
                        value={startDate}
                        onChange={event => setStartDate(event.target.value)}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>{'Expiry end date'}</FormLabel>
                      <Input
                        type="date"
                        width="184px"
                        value={endDate}
                        onChange={event => {
                          setEndDate(event.target.value);
                        }}
                      />
                    </FormControl>
                  </Stack>
                </Box>
                <Box>
                  <Stack direction="row" spacing="20px">
                    <FormControl>
                      <FormLabel>{'Columns to Export'}</FormLabel>
                    </FormControl>
                  </Stack>
                </Box>
                <Box>
                  <Checkbox paddingBottom={'10px'} fontWeight={'bold'}>
                    Select All
                  </Checkbox>
                  <SimpleGrid columns={3} spacingX={'0px'} spacingY={'10px'}>
                    <Checkbox>User ID</Checkbox>
                    <Checkbox>Applicant Name</Checkbox>
                    <Checkbox>Applicant DoB</Checkbox>
                    <Checkbox>Home Address</Checkbox>
                    <Checkbox>Email</Checkbox>
                    <Checkbox>Phone Number</Checkbox>
                    <Checkbox>Recent APP #</Checkbox>
                    <Checkbox>Recent App Type</Checkbox>
                    <Checkbox>User Status</Checkbox>
                  </SimpleGrid>
                </Box>
              </ModalBody>
              <ModalFooter paddingBottom="24px">
                <Button colorScheme="gray" variant="solid" onClick={onClose}>
                  {'Cancel'}
                </Button>
                <Button
                  variant="solid"
                  ml={'12px'}
                  onClick={() => setStep(GenerateReportModalEnum.EXPORT)}
                >
                  {'Next'}
                </Button>
              </ModalFooter>
            </ModalContent>
          </form>
        </Modal>
      </>
    );
  } else {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={'xl'}>
        <ModalOverlay />
        <ModalContent paddingLeft={'10px'} maxWidth="40rem">
          <ModalHeader paddingTop="24px" paddingBottom="12px">
            <Stack direction="row">
              <Text textStyle="display-medium-bold" paddingRight="10px">
                Permit Holder Report
              </Text>
              <Button
                variant="outline"
                onClick={() => setStep(GenerateReportModalEnum.SELECT_COLUMNS)}
              >
                Edit
              </Button>
            </Stack>
          </ModalHeader>
          <ModalBody paddingY="20px">
            <Box paddingBottom="20px">
              <Stack spacing="20px">
                <Stack direction="row" spacing="20px">
                  <Text textStyle="display-medium-bold" fontSize="22px">
                    Expiry Date:
                  </Text>
                  <Text textStyle="display-medium" fontSize="22px" paddingTop="2px">
                    {startDate} - {endDate}
                  </Text>
                </Stack>
                <Text textStyle="display-medium-bold" fontSize="21px">
                  Columns Exported:
                </Text>
              </Stack>
            </Box>
            <Box>
              <SimpleGrid columns={3} spacingY={'10px'}>
                <ListItem fontSize="18px">User ID</ListItem>
                <ListItem fontSize="18px">Applicant Name</ListItem>
                <ListItem fontSize="18px">Applicant DoB</ListItem>
                <ListItem fontSize="18px">Home Address</ListItem>
                <ListItem fontSize="18px">Email</ListItem>
                <ListItem fontSize="18px">Phone Number</ListItem>
                <ListItem fontSize="18px">Recent APP #</ListItem>
                <ListItem fontSize="18px">Recent APP Type</ListItem>
                <ListItem fontSize="18px">User Status</ListItem>
              </SimpleGrid>
            </Box>
          </ModalBody>
          <ModalFooter paddingBottom="24px">
            <Button
              colorScheme="gray"
              variant="solid"
              onClick={() => {
                setStep(GenerateReportModalEnum.SELECT_COLUMNS);
                onClose();
              }}
            >
              {'Cancel'}
            </Button>
            <Button variant="solid" ml={'12px'} leftIcon={<DownloadIcon />}>
              {'Export as CSV'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
}
