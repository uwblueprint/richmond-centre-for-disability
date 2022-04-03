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
import { ReactNode } from 'react'; // React
import { PermitHolderFormData } from '@tools/admin/requests/permit-holder-information';
import PermitHolderInformationForm from '@components/admin/requests/permit-holder-information/Form';
import { Form, Formik } from 'formik';
import { nestedRequestPermitHolderInformationSchema } from '@lib/applicants/validation';

/**
 * Props for Edit Permit Information Modal
 */
type EditPermitHolderInformationModalProps = {
  children: ReactNode;
  readonly permitHolderInformation: PermitHolderFormData;
  readonly onSave: (applicationData: PermitHolderFormData) => void;
};

export default function EditPermitHolderInformationModal({
  children,
  permitHolderInformation,
  onSave,
}: EditPermitHolderInformationModalProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleSubmit = (values: { permitHolder: PermitHolderFormData }) => {
    onSave(values.permitHolder);
    onClose();
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>
      <Modal onClose={onClose} isOpen={isOpen} scrollBehavior="inside" size="3xl">
        <ModalOverlay />
        <Formik
          initialValues={{ permitHolder: { ...permitHolderInformation } }}
          validationSchema={nestedRequestPermitHolderInformationSchema}
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
                    {'Edit Permit Holder Information'}
                  </Text>
                </ModalHeader>
                <ModalBody paddingY="20px" paddingX="4px">
                  <PermitHolderInformationForm permitHolderInformation={values.permitHolder} />
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
