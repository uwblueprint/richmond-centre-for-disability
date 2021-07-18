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
  Radio,
  RadioGroup,
  Box,
  InputGroup,
  InputLeftElement,
  Checkbox,
  Select,
  Grid,
  GridItem,
} from '@chakra-ui/react'; // Chakra UI
import React from 'react'; // React

export default function EditPaymentDetailsModal() {
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
          <ModalHeader textStyle="display-medium-bold">
            <Text textStyle="display-medium-bold">Edit Payment, Shipping and Billing Details</Text>
          </ModalHeader>
          {/* TODO: Space ModalBody using Grid or Flex */}
          <ModalBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem rowSpan={2} colSpan={1}>
                <FormControl as="fieldset" isRequired>
                  <FormLabel as="legend">Payment method</FormLabel>
                  <RadioGroup>
                    <Stack>
                      <Radio value="Mastercard">Mastercard</Radio>
                      <Radio value="Visa">Visa</Radio>
                      <Radio value="Debit">Debit</Radio>
                      <Radio value="Cash">Cash</Radio>
                      <Radio value="Cheque">Cheque</Radio>
                      <Radio value="E-transfer">E-transfer</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired isDisabled>
                  <FormLabel>
                    Permit fee{' '}
                    <Box as="span" textStyle="body-regular">
                      (fixed cost)
                    </Box>
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="#A3AEBE" fontSize="1.2em">
                      $
                    </InputLeftElement>
                    <Input />
                  </InputGroup>
                  {/* TODO: Confirm if the helper text is wanted */}
                  <FormHelperText>fixed cost</FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel>
                    Donation{' '}
                    <Box as="span" textStyle="body-regular">
                      (optional)
                    </Box>
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="#A3AEBE" fontSize="1.2em">
                      $
                    </InputLeftElement>
                    <Input />
                  </InputGroup>
                </FormControl>
              </GridItem>
            </Grid>

            <Text textStyle="heading">Shipping Address</Text>

            <Checkbox>Same as home address</Checkbox>
            <FormControl isRequired>
              <FormLabel>Full name</FormLabel>
              <Input />
              <FormHelperText>Street Address, P.O. Box, Company Name, c/o</FormHelperText>
            </FormControl>
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
              <FormControl>
                {/* Make territory lower case to be consitsent? */}
                <FormLabel>Province / Territory</FormLabel>
                <Select>
                  <option>Ontario</option>
                  <option>Quebec</option>
                  {/* TODO: Add rest of provinces */}
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="row">
              <FormControl>
                <FormLabel>Country / region</FormLabel>
                <Select>
                  <option>Canada</option>
                  {/* TODO: Add rest of countries */}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Postal code</FormLabel>
                <Input />
              </FormControl>
            </Stack>

            <Text textStyle="heading">Billing Address</Text>

            <Checkbox>Same as home address</Checkbox>
            <FormControl isRequired>
              <FormLabel>Full name</FormLabel>
              <Input />
              <FormHelperText>Street Address, P.O. Box, Company Name, c/o</FormHelperText>
            </FormControl>
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
              <FormControl>
                {/* Make territory lower case to be consitsent? */}
                <FormLabel>Province / Territory</FormLabel>
                <Select>
                  <option>Ontario</option>
                  <option>Quebec</option>
                  {/* TODO: Add rest of provinces */}
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="row">
              <FormControl>
                <FormLabel>Country / region</FormLabel>
                {/* TODO: Allow users to type if that's what the designers intended? */}
                <Select>
                  <option>Canada</option>
                  {/* TODO: Add rest of countries */}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Postal code</FormLabel>
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
