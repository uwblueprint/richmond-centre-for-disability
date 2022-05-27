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
import { PhysicianAssessment } from '@tools/admin/requests/physician-assessment';
import PhysicianAssessmentForm from './Form';
import { Form, Formik } from 'formik';
import { editPhysicianAssessmentSchema } from '@lib/physicians/validation';

type Props = {
  readonly children: ReactNode;
  readonly physicianAssessment: PhysicianAssessment;
  readonly onSave: (physicianAssessment: PhysicianAssessment) => void;
};

export default function EditPhysicianAssessmentModal({
  children,
  physicianAssessment,
  onSave,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (values: { physicianAssessment: PhysicianAssessment }) => {
    const validatedValues = await editPhysicianAssessmentSchema.validate(values);
    onSave(validatedValues.physicianAssessment);
    onClose();
  };
  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal onClose={onClose} isOpen={isOpen} scrollBehavior="inside" size="3xl">
        <ModalOverlay />
        <Formik
          initialValues={{
            physicianAssessment,
          }}
          validationSchema={editPhysicianAssessmentSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isValid }) => (
            <Form noValidate>
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
                  <PhysicianAssessmentForm physicianAssessment={values.physicianAssessment} />
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
