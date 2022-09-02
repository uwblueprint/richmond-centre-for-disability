import { ReactNode, useState } from 'react';
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
import {
  PaymentInformationFormData,
  UpdatePaymentInformationResponse,
} from '@tools/admin/requests/payment-information';
import PaymentDetailsForm from '@components/admin/requests/payment-information/Form';
import { Form, Formik } from 'formik';
import { editPaymentInformationSchema } from '@lib/applications/validation';
import ValidationErrorAlert from '@components/form/ValidationErrorAlert';

type EditPaymentDetailsModalProps = {
  readonly children: ReactNode;
  readonly paymentInformation: PaymentInformationFormData;
  readonly onSave: (
    applicationData: any
  ) => Promise<UpdatePaymentInformationResponse | undefined | null>;
};

export default function EditPaymentDetailsModal({
  children,
  paymentInformation,
  onSave,
}: EditPaymentDetailsModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState<string>('');

  const onModalClose = () => {
    onClose();
    setError('');
  };

  const handleSubmit = async (values: { paymentInformation: PaymentInformationFormData }) => {
    const result = await onSave(values.paymentInformation);

    if (result?.updateApplicationPaymentInformation.ok) {
      onModalClose();
    } else {
      setError(result?.updateApplicationPaymentInformation.error ?? '');
    }
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal
        onClose={onModalClose}
        isOpen={isOpen}
        scrollBehavior="inside"
        size="3xl" // TODO: change to custom size
      >
        <ModalOverlay />
        <Formik
          initialValues={{ paymentInformation }}
          validationSchema={editPaymentInformationSchema}
          onSubmit={handleSubmit}
          validateOnMount
        >
          {({ values, isValid }) => (
            <Form style={{ width: '100%' }} noValidate>
              <ModalContent paddingX="36px">
                <ModalHeader
                  textStyle="display-medium-bold"
                  paddingBottom="12px"
                  paddingTop="24px"
                  paddingX="4px"
                >
                  <Text as="h2" textStyle="display-medium-bold">
                    {'Edit Payment, Shipping and Billing Details'}
                  </Text>
                </ModalHeader>
                <ModalBody paddingY="20px" paddingX="4px">
                  <PaymentDetailsForm paymentInformation={values.paymentInformation} />
                </ModalBody>
                <ValidationErrorAlert error={error} />
                <ModalFooter paddingBottom="24px" paddingX="4px">
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
