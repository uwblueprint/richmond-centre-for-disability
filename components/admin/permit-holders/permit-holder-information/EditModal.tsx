import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  useDisclosure,
  Text,
  Stack,
  FormHelperText,
  Box,
  Divider,
} from '@chakra-ui/react'; // Chakra UI
import { useState, ReactNode } from 'react'; // React
import { formatDateYYYYMMDD } from '@lib/utils/format'; // Date formatter util
import { ApplicantFormData } from '@tools/admin/permit-holders/permit-holder-information';
import TextField from '@components/form/TextField';
import DateField from '@components/form/DateField';
import SelectField from '@components/form/SelectField';
import { Form, Formik } from 'formik';
import { permitHolderInformationSchema } from '@lib/applicants/permit-holder-information/validation';
import CheckboxField from '@components/form/CheckboxField';

type EditUserInformationModalProps = {
  applicant: ApplicantFormData;
  children: ReactNode;
  readonly onSave: (applicationData: ApplicantFormData) => void;
};

export default function EditUserInformationModal({
  applicant,
  children,
  onSave,
}: EditUserInformationModalProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [loading, setLoading] = useState(false);

  /**
   * Handle edit submission
   */
  const handleSubmit = async (values: ApplicantFormData) => {
    setLoading(true);
    await onSave(values);
    setLoading(false);
    onClose();
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal onClose={onClose} isOpen={isOpen} scrollBehavior="inside" size="3xl">
        <ModalOverlay />
        <Formik
          initialValues={{
            ...applicant,
            dateOfBirth: formatDateYYYYMMDD(new Date(applicant.dateOfBirth)),
          }}
          validationSchema={permitHolderInformationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isValid }) => (
            <Form noValidate>
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
                      <TextField name="firstName" label="First name" required />
                      <TextField name="middleName" label="Middle name" />
                      <TextField name="lastName" label="Last name" required />
                    </Stack>

                    <Stack direction="row" spacing="20px">
                      <DateField name="dateOfBirth" label="Date of birth" required />
                      <SelectField
                        name="gender"
                        label="Gender"
                        required
                        placeholder="Select gender"
                      >
                        <option value={'MALE'}>{'Male'}</option>
                        <option value={'FEMALE'}>{'Female'}</option>
                        <option value={'OTHER'}>{'Other'}</option>
                      </SelectField>
                    </Stack>
                  </Box>

                  <Divider />

                  {/* Contact Information Section */}

                  <Box paddingY="32px">
                    <Text as="h3" textStyle="heading" paddingBottom="24px">
                      {'Contact Information'}
                    </Text>

                    <Stack direction="row" spacing="20px">
                      <TextField name="email" label="Email address" labelHelperText="(optional)" />
                      <TextField name="phone" label="Phone number" required type="tel">
                        <FormHelperText color="text.secondary">
                          {'Example: 000-000-0000'}
                        </FormHelperText>
                      </TextField>
                    </Stack>

                    <Box paddingTop="24px">
                      <CheckboxField name="receiveEmailUpdates" isDisabled={!values.email}>
                        {'Permit holder would like to receive renewal updates through email'}
                      </CheckboxField>
                    </Box>
                  </Box>

                  <Divider />

                  {/* Home Address Section */}

                  <Box paddingTop="32px">
                    <Text as="h3" textStyle="heading" paddingBottom="24px">
                      {'Home Address'}
                    </Text>

                    <Box paddingBottom="24px">
                      <TextField name="addressLine1" label="Address line 1" required>
                        <FormHelperText color="text.secondary">
                          {'Street Address, P.O. Box, Company Name, c/o'}
                        </FormHelperText>
                      </TextField>
                    </Box>

                    <Box paddingBottom="24px">
                      <TextField
                        name="addressLine2"
                        label="Address line 2"
                        labelHelperText="(optional)"
                      >
                        <FormHelperText color="text.secondary">
                          {'Apartment, suite, unit, building, floor, etc'}
                        </FormHelperText>
                      </TextField>
                    </Box>

                    <Stack direction="row" spacing="20px">
                      <TextField name="city" label="City" required />
                      <TextField name="postalCode" label="Postal code" required>
                        <FormHelperText color="text.secondary">
                          {'Example: X0X 0X0'}{' '}
                        </FormHelperText>
                      </TextField>
                    </Stack>
                  </Box>
                </ModalBody>
                <ModalFooter paddingBottom="24px" paddingX="4px">
                  <Button colorScheme="gray" variant="solid" onClick={onClose}>
                    {'Cancel'}
                  </Button>
                  <Button
                    variant="solid"
                    type="submit"
                    ml={'12px'}
                    isLoading={loading}
                    isDisabled={!isValid}
                  >
                    {'Save'}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}
