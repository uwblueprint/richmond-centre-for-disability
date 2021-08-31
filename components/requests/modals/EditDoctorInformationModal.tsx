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
import { useState, SyntheticEvent, ReactNode, useEffect } from 'react'; // React
import { DoctorInformationCardPhysician } from '@tools/components/internal/requests/doctor-information-card'; // Physician type
import { Physician } from '@lib/graphql/types'; // GraphQL types

type EditDoctorInformationModalProps = {
  children: ReactNode;
  readonly physician: DoctorInformationCardPhysician;
  readonly onSave: (
    physicianData: Pick<
      Physician,
      'mspNumber' | 'name' | 'addressLine1' | 'addressLine2' | 'city' | 'postalCode' | 'phone'
    >
  ) => void; // Callback that accepts the inputs defined in this page
};

export default function EditDoctorInformationModal({
  children,
  physician,
  onSave,
}: EditDoctorInformationModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [name, setName] = useState('');
  const [mspNumber, setMspNumber] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  useEffect(() => {
    setName(physician.name);
    setMspNumber(physician.mspNumber);
    setPhoneNumber(physician.phone);
    setAddressLine1(physician.addressLine1);
    setAddressLine2(physician.addressLine2 || '');
    setCity(physician.city);
    setPostalCode(physician.postalCode);
  }, [physician]);

  /**
   * Handle edit submission
   */
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    onSave({
      mspNumber,
      name,
      phone: phoneNumber,
      addressLine1,
      addressLine2,
      city,
      postalCode,
    });
    onClose();
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior="inside"
        size="3xl" //TODO: change to custom size
      >
        <ModalOverlay />
        <form onSubmit={handleSubmit}>
          <ModalContent paddingX="36px">
            <ModalHeader paddingBottom="12px" paddingTop="24px" paddingX="4px">
              <Text as="h2" textStyle="display-medium-bold">
                {"Edit Doctor's Information"}
              </Text>
            </ModalHeader>
            <ModalBody paddingTop="20px" paddingX="4px">
              <Box paddingBottom="32px">
                <Stack direction="row" spacing="20px" marginBottom="24px">
                  <FormControl isRequired>
                    <FormLabel>{'Name'}</FormLabel>
                    <Input value={name} onChange={event => setName(event.target.value)} />
                  </FormControl>
                </Stack>

                <Stack direction="row" spacing="20px">
                  <FormControl isRequired>
                    <FormLabel>{'Medical Services Plan number'}</FormLabel>
                    <Input
                      value={mspNumber}
                      onChange={event => setMspNumber(parseInt(event.target.value))}
                    />
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

              <Box paddingTop="32px">
                <Text as="h3" textStyle="heading" paddingBottom="24px">
                  {'Address'}
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
                    <Box as="span" textStyle="body-regular">
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

                <Stack direction="row" spacing="20px" paddingBottom="20px">
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
            <ModalFooter paddingBottom="24px" paddingTop="20px" paddingX="4px">
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
