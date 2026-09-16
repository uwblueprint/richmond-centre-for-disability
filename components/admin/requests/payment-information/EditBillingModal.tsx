import { ReactNode, useState } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import BillingInformationForm from './BillingForm';
import ValidationErrorAlert from '@components/form/ValidationErrorAlert';
import { editBillingInformationSchema } from '@lib/applications/validation';
import {
  BillingInformationFormData,
  UpdateBillingInformationResponse,
} from '@tools/admin/requests/payment-information';

type Props = {
  readonly children: ReactNode;
  readonly billingInformation: BillingInformationFormData;
  readonly onSave: (
    billingInformation: BillingInformationFormData
  ) => Promise<UpdateBillingInformationResponse | null | undefined>;
};

export default function EditBillingInformationModal({
  children,
  billingInformation,
  onSave,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState('');

  const closeModal = () => {
    setError('');
    onClose();
  };

  const handleSubmit = async (values: { billingInformation: BillingInformationFormData }) => {
    const result = await onSave(values.billingInformation);
    if (result?.updateApplicationBillingInformation.ok) {
      closeModal();
      return;
    }

    setError(result?.updateApplicationBillingInformation.error ?? '');
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>
      <Modal onClose={closeModal} isOpen={isOpen} scrollBehavior="inside" size="3xl">
        <ModalOverlay />
        <Formik
          initialValues={{ billingInformation }}
          validationSchema={editBillingInformationSchema}
          onSubmit={handleSubmit}
          validateOnMount
        >
          {({ values, isValid }) => (
            <Form noValidate>
              <ModalContent paddingX="36px">
                <ModalHeader paddingBottom="12px" paddingTop="24px" paddingX="4px">
                  <Text as="h2" textStyle="display-medium-bold">
                    Edit Billing Information
                  </Text>
                </ModalHeader>
                <ModalBody paddingY="20px" paddingX="4px">
                  <BillingInformationForm billingInformation={values.billingInformation} />
                </ModalBody>
                <ValidationErrorAlert error={error} />
                <ModalFooter paddingBottom="24px" paddingX="4px">
                  <Button colorScheme="gray" variant="solid" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button variant="solid" type="submit" ml="12px" isDisabled={!isValid}>
                    Save
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
