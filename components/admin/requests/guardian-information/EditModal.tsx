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
  useDisclosure,
  useToast,
} from '@chakra-ui/react'; // Chakra UI
import { useState, FC } from 'react'; // React
import { GuardianInformation } from '@tools/admin/requests/guardian-information';
import GuardianInformationForm from './Form';
import { clientUploadToS3 } from '@lib/utils/s3-utils';
import { UpdateApplicationGuardianInformationInput } from '@lib/graphql/types';
import { Form, Formik } from 'formik';
import { editGuardianInformationSchema } from '@lib/guardian/validation';

type Props = {
  readonly guardianInformation: Omit<GuardianInformation, 'omitGuardianPoa'>;
  readonly onSave: (data: Omit<UpdateApplicationGuardianInformationInput, 'id'>) => void; // Callback that accepts the inputs defined in this page
};

const EditGuardianInformationModal: FC<Props> = ({ children, guardianInformation, onSave }) => {
  // Guardian/POA File
  const [poaFile, setPoaFile] = useState<File | null>(null);

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Toast message
  const toast = useToast();

  /**
   * Handle edit submission
   */
  const handleSubmit = async (values: { guardianInformation: GuardianInformation }) => {
    let poaFormS3ObjectKey = '';
    if (poaFile) {
      try {
        // TODO: Rename folder to rcd/poa-forms
        const { key } = await clientUploadToS3(poaFile, 'rcd/guardian-forms');
        poaFormS3ObjectKey = key;
      } catch (err) {
        toast({
          status: 'error',
          description: `Failed to upload POA file: ${err}`,
          isClosable: true,
        });
        return;
      }
    }

    const {
      omitGuardianPoa,
      firstName,
      middleName,
      lastName,
      phone,
      relationship,
      addressLine1,
      addressLine2,
      city,
      postalCode,
    } = values.guardianInformation;

    onSave({
      omitGuardianPoa,
      firstName,
      middleName,
      lastName,
      phone,
      relationship,
      addressLine1,
      addressLine2,
      city,
      postalCode,
      poaFormS3ObjectKey,
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
        <Formik
          initialValues={{
            guardianInformation: { ...guardianInformation, omitGuardianPoa: false },
          }}
          validationSchema={editGuardianInformationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isValid }) => (
            <Form style={{ width: '100%' }} noValidate>
              <ModalContent paddingX="36px">
                <ModalHeader paddingBottom="12px" paddingTop="24px" paddingX="4px">
                  <Text as="h2" textStyle="display-medium-bold">
                    {'Edit Guardian/POA Information'}
                  </Text>
                </ModalHeader>
                <ModalBody paddingTop="20px" paddingX="4px">
                  <GuardianInformationForm
                    guardianInformation={values.guardianInformation}
                    file={poaFile}
                    onUploadFile={setPoaFile}
                  />
                </ModalBody>
                <ModalFooter paddingBottom="24px" paddingTop="20px" paddingX="4px">
                  <Button colorScheme="gray" variant="solid" onClick={onClose}>
                    {'Cancel'}
                  </Button>
                  <Button variant="solid" type="submit" ml={'12px'} isDisabled={!isValid}>
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
};

export default EditGuardianInformationModal;
