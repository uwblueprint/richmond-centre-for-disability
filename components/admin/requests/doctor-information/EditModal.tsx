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
  Box,
} from '@chakra-ui/react'; // Chakra UI
import { ReactNode } from 'react'; // React
import DoctorInformationForm from '@components/admin/requests/doctor-information/Form';
import { DoctorFormData } from '@tools/admin/requests/doctor-information'; // GraphQL types
import { Form, Formik } from 'formik';
import { editPhysicianInformationSchema } from '@lib/physicians/validation';

type EditDoctorInformationModalProps = {
  children: ReactNode;
  readonly doctorInformation: DoctorFormData;
  readonly onSave: (applicationData: any) => void;
};

export default function EditDoctorInformationModal({
  children,
  doctorInformation,
  onSave,
}: EditDoctorInformationModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = (values: { doctorInformation: DoctorFormData }) => {
    // TODO: Backend errors
    onSave(values.doctorInformation);
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
          initialValues={{ doctorInformation }}
          validationSchema={editPhysicianInformationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid }) => (
            <Form style={{ width: '100%' }} noValidate>
              <ModalContent paddingX="36px">
                <ModalHeader
                  textStyle="display-medium-bold"
                  paddingBottom="12px"
                  paddingTop="24px"
                  paddingX="4px"
                >
                  <Text as="h2" textStyle="display-medium-bold">
                    {"Edit Doctor's Information"}
                  </Text>
                </ModalHeader>
                <ModalBody paddingY="20px" paddingX="4px">
                  <DoctorInformationForm />
                </ModalBody>
                <ModalFooter paddingBottom="24px" paddingX="4px">
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
}
