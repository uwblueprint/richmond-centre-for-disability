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
  PhysicianAssessment,
  UpdatePhysicianAssessmentResponse,
} from '@tools/admin/requests/physician-assessment';
import PhysicianAssessmentForm from './Form';
import { Form, Formik } from 'formik';
import { editPhysicianAssessmentSchema } from '@lib/physicians/validation';
import ValidationErrorAlert from '@components/form/ValidationErrorAlert';

type Props = {
  readonly children: ReactNode;
  readonly physicianAssessment: PhysicianAssessment;
  readonly onSave: (
    physicianAssessment: PhysicianAssessment
  ) => Promise<UpdatePhysicianAssessmentResponse | null | undefined>;
};

export default function EditPhysicianAssessmentModal({
  children,
  physicianAssessment,
  onSave,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState<string>('');

  const onModalClose = () => {
    onClose();
    setError('');
  };

  const handleSubmit = async (values: { physicianAssessment: PhysicianAssessment }) => {
    const result = await onSave(values.physicianAssessment);

    if (result?.updateApplicationPhysicianAssessment.ok) {
      onModalClose();
    } else {
      setError(result?.updateApplicationPhysicianAssessment.error ?? '');
    }
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal onClose={onModalClose} isOpen={isOpen} scrollBehavior="inside" size="3xl">
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
                    {`Edit Physician's Assessment`}
                  </Text>
                </ModalHeader>
                <ModalBody paddingY="20px" paddingX="4px">
                  <PhysicianAssessmentForm physicianAssessment={values.physicianAssessment} />
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
