import { useEffect, useState, ReactNode, SyntheticEvent } from 'react';
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
import { PaymentDetails } from '@tools/components/admin/requests/forms/types';
import PaymentDetailsForm from '@components/admin/requests/forms/PaymentDetailsForm';

type EditPaymentDetailsModalProps = {
  readonly children: ReactNode;
  readonly paymentInformation: PaymentDetails;
  readonly onSave: (applicationData: any) => void;
};

export default function EditPaymentDetailsModal({
  children,
  paymentInformation: currentPaymentInformation,
  onSave,
}: EditPaymentDetailsModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paymentInformation, setPaymentInformation] = useState<PaymentDetails>(
    currentPaymentInformation || {
      paymentMethod: undefined,
      donationAmount: null,
      shippingAddressSameAsHomeAddress: false,
      shippingFullName: '',
      shippingAddressLine1: '',
      shippingAddressLine2: '',
      shippingCity: '',
      shippingProvince: undefined,
      shippingPostalCode: '',
      billingAddressSameAsHomeAddress: false,
      billingFullName: '',
      billingAddressLine1: '',
      billingAddressLine2: '',
      billingCity: '',
      billingProvince: undefined,
      billingPostalCode: '',
    }
  );

  useEffect(() => {
    setPaymentInformation(currentPaymentInformation);
  }, [currentPaymentInformation, isOpen]);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    // TODO: Add error handling to each field as follows (post-mvp)
    // if (!hideShippingInfo) {
    //   if (!shippingFullName.length) {
    //     setShippingFullNameInputError("Please enter the recipient's full name.");
    //   }
    // }
    const {
      paymentMethod,
      donationAmount,
      shippingAddressSameAsHomeAddress,
      shippingFullName,
      shippingAddressLine1,
      shippingAddressLine2,
      shippingCity,
      shippingProvince,
      shippingPostalCode,
      billingAddressSameAsHomeAddress,
      billingFullName,
      billingAddressLine1,
      billingAddressLine2,
      billingCity,
      billingProvince,
      billingPostalCode,
    } = paymentInformation;
    onSave({
      ...(paymentMethod && { paymentMethod }),
      ...(donationAmount !== undefined && { donationAmount }),
      shippingAddressSameAsHomeAddress,
      shippingFullName,
      shippingAddressLine1,
      shippingAddressLine2,
      shippingCity,
      shippingProvince,
      shippingPostalCode,
      billingAddressSameAsHomeAddress,
      billingFullName,
      billingAddressLine1,
      billingAddressLine2,
      billingCity,
      billingProvince,
      billingPostalCode,
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
        size="3xl" // TODO: change to custom size
      >
        <ModalOverlay />
        <form onSubmit={handleSubmit}>
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
              <PaymentDetailsForm
                paymentInformation={paymentInformation}
                onChange={setPaymentInformation}
              />
            </ModalBody>
            <ModalFooter paddingBottom="24px" paddingX="4px">
              <Button colorScheme="gray" variant="solid" onClick={onClose}>
                {'Cancel'}
              </Button>
              <Button variant="solid" type="submit" ml={'12px'}>
                {'Save'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}
