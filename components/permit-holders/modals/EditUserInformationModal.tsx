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
  Select,
  Divider,
  useToast,
} from '@chakra-ui/react'; // Chakra UI
import { useState, SyntheticEvent, ReactNode } from 'react'; // React
import { Gender } from '@lib/graphql/types'; // Gender Enum
import SuccessfulEditAlert from '@components/permit-holders/SuccessfulEditAlert'; // Successful edit alert/toast

type EditUserInformationModalProps = {
  children: ReactNode;
};

export default function EditUserInformationModal({ children }: EditUserInformationModalProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  // Personal information state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date().toISOString().substring(0, 10));
  const [gender, setGender] = useState<Gender | string>('');

  // Contact information state
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Home address information state
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  //   TODO: Add error states for each field (post-mvp)

  const successfulEditToast = useToast();

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    // TODO: Will be addressed in API hookup
    onClose();

    successfulEditToast({
      render: () => (
        <SuccessfulEditAlert>{"User's information has been edited."}</SuccessfulEditAlert>
      ),
    });
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

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
              <Text as="h2" textStyle="display-medium-bold">
                {"Edit User's Information"}
              </Text>
            </ModalHeader>
            <ModalBody paddingY="20px" paddingX="4px">
              {/* Personal Information Section */}
              <Box paddingBottom="32px">
                <Text as="h3" textStyle="heading" paddingBottom="24px">
                  {'Personal Information'}
                </Text>
                <Stack direction="row" spacing="20px" paddingBottom="24px">
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
                    <FormLabel>{`Date of birth`}</FormLabel>
                    <Input
                      type="date"
                      value={dateOfBirth}
                      onChange={event => setDateOfBirth(event.target.value)}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>{'Gender'}</FormLabel>
                    <Select
                      placeholder="None Selected"
                      value={gender}
                      onChange={event => setGender(event.target.value)}
                    >
                      <option value={Gender.Male}>{'Male'}</option>
                      <option value={Gender.Female}>{'Female'}</option>
                      <option value={Gender.Other}>{'Other'}</option>
                    </Select>
                  </FormControl>
                </Stack>
              </Box>

              <Divider borderColor="border.secondary" />

              {/* Contact Information Section */}

              <Box paddingY="32px">
                <Text as="h3" textStyle="heading" paddingBottom="24px">
                  {'Contact Information'}
                </Text>

                <Stack direction="row" spacing="20px">
                  <FormControl>
                    <FormLabel>
                      {'Email '}
                      <Box as="span" textStyle="caption">
                        {'(optional)'}
                      </Box>
                    </FormLabel>
                    <Input value={email} onChange={event => setEmail(event.target.value)} />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>{'Phone number'}</FormLabel>
                    <Input
                      value={phoneNumber}
                      onChange={event => setPhoneNumber(event.target.value)}
                      type="tel"
                    />
                    <FormHelperText color="text.seconday">{'Example: 000-000-0000'}</FormHelperText>
                  </FormControl>
                </Stack>
              </Box>

              <Divider borderColor="border.secondary" />

              {/* Home Address Section */}

              <Box paddingTop="32px">
                <Text as="h3" textStyle="heading" paddingBottom="24px">
                  {'Home Address'}
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
                  <FormLabel>{'Address line 2 '}</FormLabel>
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
                    <FormHelperText color="text.seconday">{'Example: X0X 0X0'} </FormHelperText>
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