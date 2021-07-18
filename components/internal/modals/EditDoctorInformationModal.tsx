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
import React from 'react'; // React

export default function EditDoctorInformationModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const btnRef = React.useRef();
  return (
    <>
      <Button mt={3} ref={btnRef} onClick={onOpen}>
        Open
      </Button>

      <Modal
        onClose={onClose}
        finalFocusRef={btnRef}
        isOpen={isOpen}
        scrollBehavior="inside"
        size="3xl" //change to custom size
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text textStyle="display-medium-bold">{"Edit Doctor's Information"}</Text>
          </ModalHeader>
          {/* TODO: Space ModalBody using Grid or Flex */}
          <ModalBody>
            <Stack direction="row">
              <FormControl isRequired>
                <FormLabel>First name</FormLabel>
                <Input />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Last name</FormLabel>
                <Input />
              </FormControl>
            </Stack>
            <Stack direction="row">
              <FormControl isRequired>
                <FormLabel>Medical Services Plan Number</FormLabel>
                <Input />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input />
              </FormControl>
            </Stack>
            <Text textStyle="heading">Address</Text>
            <FormControl isRequired>
              <FormLabel>Address Line 1</FormLabel>
              <Input />
              <FormHelperText>Street Address, P.O. Box, Company Name, c/o</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>
                Address Line 2{' '}
                <Box as="span" textStyle="body-regular">
                  (optional)
                </Box>
              </FormLabel>
              <Input />
              <FormHelperText>Apartment, suite, unit, building, floor, etc</FormHelperText>
            </FormControl>
            <Stack direction="row">
              <FormControl isRequired>
                <FormLabel>City</FormLabel>
                <Input />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Postal Code</FormLabel>
                <Input />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" variant="solid" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="solid" ml={'12px'}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
