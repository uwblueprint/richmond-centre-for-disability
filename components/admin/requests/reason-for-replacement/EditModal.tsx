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
import { useState, useEffect, ReactNode } from 'react'; // React
import ReasonForReplacementForm from '@components/admin/requests/reason-for-replacement/Form'; // ReasonForReplacement form fields
import { ReasonForReplacementFormData } from '@tools/admin/requests/reason-for-replacement';
import { Form, Formik } from 'formik';
import { nestedReasonForReplacementFormSchema } from '@lib/applications/validation';

type EditReasonForReplacementModalProps = {
  readonly reasonForReplacement: ReasonForReplacementFormData;
  readonly onSave: (data: ReasonForReplacementFormData) => void;
  readonly children: ReactNode;
};

export default function EditReasonForReplacementModal({
  reasonForReplacement: currentReasonForReplacement,
  onSave,
  children,
}: EditReasonForReplacementModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // TODO: maybe get rid of this
  const [reasonForReplacement, setReasonForReplacement] = useState<ReasonForReplacementFormData>(
    currentReasonForReplacement
  );

  // TODO: update this
  useEffect(() => {
    setReasonForReplacement(currentReasonForReplacement);
  }, [currentReasonForReplacement, isOpen]);

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
          validationSchema={nestedReasonForReplacementFormSchema}
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
                  <ReasonForReplacementForm
                    reasonForReplacement={values.reasonForReplacement}
                    onChange={setReasonForReplacement}
                  />
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
