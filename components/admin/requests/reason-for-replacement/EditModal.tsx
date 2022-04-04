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
import ReasonForReplacementForm from '@components/admin/requests/reason-for-replacement/Form'; // ReasonForReplacement form fields
import { ReasonForReplacementFormData } from '@tools/admin/requests/reason-for-replacement';
import { Form, Formik } from 'formik';
import { editReasonForReplacementFormSchema } from '@lib/applications/validation';

type EditReasonForReplacementModalProps = {
  readonly reasonForReplacement: ReasonForReplacementFormData;
  readonly onSave: (data: ReasonForReplacementFormData) => void;
  readonly children: ReactNode;
};

export default function EditReasonForReplacementModal({
  reasonForReplacement,
  onSave,
  children,
}: EditReasonForReplacementModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = (values: { reasonForReplacement: ReasonForReplacementFormData }) => {
    onSave(values.reasonForReplacement);
    onClose();
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal onClose={onClose} isOpen={isOpen} scrollBehavior="inside" size="lg">
        <ModalOverlay />

        <Formik
          initialValues={{
            reasonForReplacement,
          }}
          validationSchema={editReasonForReplacementFormSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isValid }) => (
            <Form noValidate>
              <ModalContent paddingX="36px">
                <ModalHeader paddingBottom="12px" paddingTop="24px" paddingX="4px">
                  <Text as="h2" textStyle="display-medium-bold">
                    {'Edit Reason for Replacement'}
                  </Text>
                </ModalHeader>
                <ModalBody paddingY="16px" paddingX="4px">
                  <ReasonForReplacementForm reasonForReplacement={values.reasonForReplacement} />
                </ModalBody>
                <ModalFooter paddingBottom="24px" paddingTop="8px">
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
