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
  Divider,
} from '@chakra-ui/react'; // Chakra UI
import { useState, SyntheticEvent } from 'react'; // React

export default function EditPermitHolderInformationModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  // Personal information state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Contact information state
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Home address information state
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  //   TODO: Add error states for each field (post-mvp)

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    // TODO: Will be addressed in API hookup
  };

  return (
    <>
      {/* Button will be removed before merging */}
      <Button mt={3} onClick={onOpen}>
        Open
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} scrollBehavior="inside" size="3xl">
        <ModalOverlay />
        <form onSubmit={handleSubmit}>
          <ModalContent paddingX="36px">
            <ModalHeader
              textStyle="display-medium-bold"
              paddingBottom="12px"
              paddingTop="24px"
              paddingX="4px"
            >
              <Text textStyle="display-medium-bold">{'Edit Permit Holder Information'}</Text>
            </ModalHeader>
            <ModalBody paddingY="20px" paddingX="4px">
              {/* Personal Information Section */}
              <Box paddingBottom="32px">
                <Text textStyle="heading" paddingBottom="24px">
                  {'Personal Information'}
                </Text>
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
              </Box>

              {/* TODO: Customize Divider to change color  */}
              <Divider />

              {/* Contact Information Section */}

              <Box paddingY="32px">
                <Text textStyle="heading" paddingBottom="24px">
                  {'Contact Information'}
                </Text>

                <Stack direction="row" spacing="20px">
                  <FormControl isRequired>
                    <FormLabel>{'Phone number'}</FormLabel>
                    <Input
                      placeholder="000-000-000"
                      value={phoneNumber}
                      onChange={event => setPhoneNumber(event.target.value)}
                      type="tel"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>
                      {'Email address '}
                      <Box as="span" textStyle="body-regular">
                        {'(optional)'}
                      </Box>
                    </FormLabel>
                    <Input value={email} onChange={event => setEmail(event.target.value)} />
                  </FormControl>
                </Stack>
              </Box>

              {/* TODO: Customize Divider to change color  */}
              <Divider />

              {/* Home Address Section */}

              <Box paddingTop="32px">
                <Text textStyle="heading" paddingBottom="24px">
                  {'Home Address '}
                  <Box as="span" textStyle="caption">
                    {'(must be in British Columbia)'}
                  </Box>
                </Text>

                <FormControl isRequired paddingBottom="24px">
                  <FormLabel>{'Address line 1'}</FormLabel>
                  <Input
                    value={addressLine1}
                    onChange={event => setAddressLine1(event.target.value)}
                  />
                  <FormHelperText color="text.seconday">
                    {'Street Address, P.O. Box, Company Name, c/o'}
                  </FormHelperText>
                </FormControl>

                <FormControl paddingBottom="24px">
                  <FormLabel>
                    {'Address line 2 '}
                    <Box as="span" textStyle="caption">
                      {'(optional)'}
                    </Box>
                  </FormLabel>
                  <Input
                    value={addressLine2}
                    onChange={event => setAddressLine2(event.target.value)}
                  />
                  <FormHelperText color="text.seconday">
                    {'Apartment, suite, unit, building, floor, etc'}
                  </FormHelperText>
                </FormControl>

                <Stack direction="row" spacing="20px">
                  <FormControl isRequired>
                    <FormLabel>{'City'}</FormLabel>
                    <Input value={city} onChange={event => setCity(event.target.value)} />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>{'Postal code'}</FormLabel>
                    <Input
                      value={postalCode}
                      onChange={event => setPostalCode(event.target.value)}
                    />
                  </FormControl>
                </Stack>
              </Box>
            </ModalBody>
            <ModalFooter paddingBottom="24px" paddingX="4px">
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
