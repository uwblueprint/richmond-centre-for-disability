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
import { PhysicianAssessment } from '@tools/admin/requests/physician-assessment';
import PhysicianAssessmentForm from './Form';

type Props = {
  readonly children: ReactNode;
  readonly physicianAssessment: PhysicianAssessment;
  readonly onSave: (physicianAssessment: PhysicianAssessment) => void;
};

export default function EditPhysicianAssessmentModal({
  children,
  physicianAssessment: currentPhysicianAssessment,
  onSave,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [physicianAssessment, setPhysicianAssessment] = useState<PhysicianAssessment>(
    currentPhysicianAssessment
  );

  useEffect(() => {
    setPhysicianAssessment(currentPhysicianAssessment);
  }, [currentPhysicianAssessment, isOpen]);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    // TODO: Refactor to work with form validation (wrap in a Formik component)
    onSave(physicianAssessment);
    onClose();
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal onClose={onClose} isOpen={isOpen} scrollBehavior="inside" size="3xl">
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
              <PhysicianAssessmentForm
                physicianAssessment={physicianAssessment}
                onChange={setPhysicianAssessment}
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
