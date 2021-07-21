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
} from '@chakra-ui/react'; // Chakra UI
import { useState, SyntheticEvent } from 'react'; // React

export default function EditDoctorInformationModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mspNumber, setMspNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    //  TODO
  };
  return (
    <>
      {/* Button will be removed before merging */}
      <Button mt={3} onClick={onOpen}>
        Open
      </Button>

      <Modal
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior="inside"
        size="3xl" //TODO: change to custom size
      >
        <ModalOverlay />
        <form onSubmit={handleSubmit}>
          <ModalContent paddingX="40px">
            <ModalHeader paddingBottom="12px" paddingTop="24px">
              <Text textStyle="display-medium-bold">{"Edit Doctor's Information"}</Text>
            </ModalHeader>
            <ModalBody paddingY="20px">
              <Box paddingBottom="32px">
                <Stack direction="row" spacing="20px">
                  <FormControl isRequired>
                    <FormLabel>{'First name'}</FormLabel>
                    <Input value={firstName} onChange={event => setFirstName(event.target.value)} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>{'Last name'}</FormLabel>
                    <Input value={lastName} onChange={event => setLastName(event.target.value)} />
                  </FormControl>
                </Stack>

                <Stack direction="row" spacing="20px">
                  <FormControl isRequired>
                    <FormLabel>{'Medical Services Plan Number'}</FormLabel>
                    <Input value={mspNumber} onChange={event => setMspNumber(event.target.value)} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>{'Phone Number'}</FormLabel>
                    <Input
                      value={phoneNumber}
                      onChange={event => setPhoneNumber(event.target.value)}
                    />
                  </FormControl>
                </Stack>
              </Box>

              <Box paddingTop="32px">
                <Text textStyle="heading" paddingBottom="24px">
                  {'Address'}
                </Text>
                <FormControl isRequired paddingBottom="24px">
                  <FormLabel>{'Address Line 1'}</FormLabel>
                  <Input
                    value={addressLine1}
                    onChange={event => setAddressLine1(event.target.value)}
                  />
                  <FormHelperText color="#323741">
                    {'Street Address, P.O. Box, Company Name, c/o'}
                  </FormHelperText>
                </FormControl>

                <FormControl paddingBottom="24px">
                  <FormLabel>
                    {'Address Line 2 '}
                    <Box as="span" textStyle="body-regular">
                      {'(optional)'}
                    </Box>
                  </FormLabel>
                  <Input
                    value={addressLine2}
                    onChange={event => setAddressLine2(event.target.value)}
                  />
                  <FormHelperText color="#323741">
                    {'Apartment, suite, unit, building, floor, etc'}
                  </FormHelperText>
                </FormControl>

                <Stack direction="row" spacing="20px" paddingBottom="20px">
                  <FormControl isRequired>
                    <FormLabel>{'City'}</FormLabel>
                    <Input value={city} onChange={event => setCity(event.target.value)} />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>{'Postal Code'}</FormLabel>
                    <Input
                      value={postalCode}
                      onChange={event => setPostalCode(event.target.value)}
                    />
                  </FormControl>
                </Stack>
              </Box>
            </ModalBody>
            <ModalFooter paddingBottom="24px" paddingTop="0px">
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
