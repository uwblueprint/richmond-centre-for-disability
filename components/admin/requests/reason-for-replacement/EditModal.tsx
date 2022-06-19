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
import { ReactNode, useState } from 'react'; // React
import ReasonForReplacementForm from '@components/admin/requests/reason-for-replacement/Form'; // ReasonForReplacement form fields
import {
  ReasonForReplacementFormData,
  UpdateReasonForReplacementResponse,
} from '@tools/admin/requests/reason-for-replacement';
import { Form, Formik } from 'formik';
import { editReasonForReplacementFormSchema } from '@lib/applications/validation';
import ValidationErrorAlert from '@components/form/ValidationErrorAlert';

type EditReasonForReplacementModalProps = {
  readonly reasonForReplacement: ReasonForReplacementFormData;
  readonly onSave: (
    data: ReasonForReplacementFormData
  ) => Promise<UpdateReasonForReplacementResponse | null | undefined>;
  readonly children: ReactNode;
};

export default function EditReasonForReplacementModal({
  reasonForReplacement,
  onSave,
  children,
}: EditReasonForReplacementModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState<string>('');

  const onModalClose = () => {
    onClose();
    setError('');
  };

  const handleSubmit = async (values: { reasonForReplacement: ReasonForReplacementFormData }) => {
    const result = await onSave(values.reasonForReplacement);

    if (result?.updateApplicationReasonForReplacement.ok) {
      onModalClose();
    } else {
      setError(result?.updateApplicationReasonForReplacement.error ?? '');
    }
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal onClose={onModalClose} isOpen={isOpen} scrollBehavior="inside" size="lg">
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
                <ValidationErrorAlert error={error} />
                <ModalFooter paddingBottom="24px" paddingTop="8px">
                  <Button colorScheme="gray" variant="solid" onClick={onModalClose}>
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
