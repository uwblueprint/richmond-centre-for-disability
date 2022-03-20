import { ReactNode } from 'react';
import DoctorInformationCard from '@components/admin/requests/doctor-information/Card'; // Doctor information card
import PaymentInformationCard from '@components/admin/requests/payment-information/Card'; // Payment information card
import PersonalInformationCard from '@components/admin/requests/permit-holder-information/Card'; // Personal information card
import ReasonForReplacementCard from '@components/admin/requests/reason-for-replacement/Card';
import AdditionalInformationCard from '@components/admin/requests/additional-questions/Card';
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
  VStack,
} from '@chakra-ui/react'; // Chakra UI

type ReviewInformationModalProps = {
  readonly children: ReactNode;
  readonly applicationId: number;
  readonly requestType: string;
  readonly onConfirmed: () => void;
};

export default function ReviewInformationModalProps({
  children,
  applicationId,
  requestType,
  onConfirmed,
}: ReviewInformationModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        <form onSubmit={onConfirmed}>
          <ModalContent paddingX="36px">
            <ModalHeader
              textStyle="display-medium-bold"
              paddingBottom="12px"
              paddingTop="24px"
              paddingX="4px"
            >
              <Text as="h2" textStyle="display-medium-bold">
                {'Review Request Information'}
              </Text>
            </ModalHeader>
            <ModalBody paddingY="20px" paddingX="4px">
              <VStack width="100%" spacing="20px" align="stretch">
                <PersonalInformationCard applicationId={applicationId} editDisabled />
                {requestType === 'REPLACEMENT' ? (
                  <ReasonForReplacementCard applicationId={applicationId} editDisabled />
                ) : (
                  <>
                    <DoctorInformationCard applicationId={applicationId} editDisabled />
                    <AdditionalInformationCard applicationId={applicationId} />
                  </>
                )}
                <PaymentInformationCard applicationId={applicationId} editDisabled />
              </VStack>
            </ModalBody>
            <ModalFooter paddingBottom="24px" paddingX="4px">
              <Button colorScheme="gray" variant="solid" onClick={onClose}>
                {'Cancel'}
              </Button>
              <Button variant="solid" type="submit" ml={'12px'}>
                {'Confirm'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}
