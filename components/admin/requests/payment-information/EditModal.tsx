import { ReactNode } from 'react';
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
import { PaymentInformationFormData } from '@tools/admin/requests/payment-information';
import PaymentDetailsForm from '@components/admin/requests/payment-information/Form';
import { Form, Formik } from 'formik';
import { paymentInformationSchema } from '@lib/applications/validation';

type EditPaymentDetailsModalProps = {
  readonly children: ReactNode;
  readonly paymentInformation: PaymentInformationFormData;
  readonly onSave: (applicationData: any) => void;
};

export default function EditPaymentDetailsModal({
  children,
  paymentInformation,
  onSave,
}: EditPaymentDetailsModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = (values: { paymentInformation: PaymentInformationFormData }) => {
    // TODO FIX: Card is passing in processingFee in object which is breaking request and needs to be removed
    const { processingFee, ...pickedValues } = values.paymentInformation;
    // TODO: Backend errors
    onSave(pickedValues);
    onClose();
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior="inside"
        size="3xl" // TODO: change to custom size
      >
        <ModalOverlay />
        <Formik
          initialValues={{ paymentInformation: { ...paymentInformation } }}
          validationSchema={paymentInformationSchema}
          onSubmit={handleSubmit}
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
