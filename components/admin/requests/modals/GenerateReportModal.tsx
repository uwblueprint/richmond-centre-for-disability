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
            <ModalContent
              paddingLeft={'16px'}
              maxWidth="45rem"
              maxHeight="600px"
              paddingRight="16px"
            >
              <ModalHeader paddingTop="24px" paddingBottom="12px">
                <Text textStyle="display-medium-bold">Requests Report</Text>
              </ModalHeader>
              <ModalBody paddingY="20px" paddingBottom="44px">
                <Box paddingBottom="32px">
                  <FormControl isRequired>
                    <FormLabel fontSize="20px" paddingBottom="16px">
                      {'Application Date'}
                    </FormLabel>
                  </FormControl>
                  <Stack direction="row" spacing="20px">
                    <FormControl isRequired>
                      <FormLabel>{'Start date'}</FormLabel>
                      <Input
                        type="date"
                        width="184px"
                        value={startDate}
                        onChange={event => setStartDate(event.target.value)}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>{'End date'}</FormLabel>
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
                  <Stack direction="row" spacing="20px" paddingBottom="16px">
                    <FormControl>
                      <FormLabel fontSize="20px">{'Columns to Export'}</FormLabel>
                    </FormControl>
                  </Stack>
                </Box>
                <Box>
                  <Checkbox paddingBottom={'6px'} fontWeight={'bold'}>
                    Select All
                  </Checkbox>
                  <SimpleGrid columns={3} spacingX={'20px'} spacingY={'6px'}>
                    <Checkbox>User ID</Checkbox>
                    <Checkbox>Applicant Name</Checkbox>
                    <Checkbox>Applicant DoB</Checkbox>
                    <Checkbox>APP Number</Checkbox>
                    <Checkbox>Application Date</Checkbox>
                    <Checkbox>Payment Method</Checkbox>
                    <Checkbox>Fee Amount</Checkbox>
                    <Checkbox>Donation Amount</Checkbox>
                    <Checkbox>Total Amount</Checkbox>
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
                  disabled={startDate && endDate ? false : true}
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
        <ModalContent paddingLeft={'16px'} maxWidth="40rem" paddingRight="16px">
          <ModalHeader paddingTop="24px" paddingBottom="0px">
            <Stack direction="row">
              <Text textStyle="display-medium-bold" paddingRight="10px">
                Requests Report
              </Text>
              <Button
                variant="outline"
                onClick={() => setStep(GenerateReportModalEnum.SELECT_COLUMNS)}
              >
                Edit
              </Button>
            </Stack>
          </ModalHeader>
          <ModalBody paddingTop="20px" paddingBottom="24px">
            <Box paddingBottom="20px">
              <Stack spacing="16px">
                <Stack direction="row" spacing="20px">
                  <Text textStyle="display-medium-bold" fontSize="22px">
                    Application Date:
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
              <SimpleGrid columns={3} spacingY={'6px'}>
                <ListItem fontSize="17px">User ID</ListItem>
                <ListItem fontSize="17px">Applicant Name</ListItem>
                <ListItem fontSize="17px">Applicant DoB</ListItem>
                <ListItem fontSize="17px">APP Number</ListItem>
                <ListItem fontSize="17px">Application Date</ListItem>
                <ListItem fontSize="17px">Payment Method</ListItem>
                <ListItem fontSize="17px">Fee Amount</ListItem>
                <ListItem fontSize="17px">Donation Amount</ListItem>
                <ListItem fontSize="17px">Total Amount</ListItem>
              </SimpleGrid>
            </Box>
          </ModalBody>
          <ModalFooter paddingBottom="40px">
            <Button
              colorScheme="gray"
              variant="solid"
              onClick={() => {
                setStep(GenerateReportModalEnum.SELECT_COLUMNS);
                onClose();
              }}
            >
              {'Back to Requests Table'}
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
