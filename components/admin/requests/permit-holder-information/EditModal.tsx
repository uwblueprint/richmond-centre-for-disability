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
import {
  PermitHolderFormData,
  UpdatePermitHolderInformationResponse,
} from '@tools/admin/requests/permit-holder-information';
import PermitHolderInformationForm from '@components/admin/requests/permit-holder-information/Form';
import { Form, Formik } from 'formik';
import { editRequestPermitHolderInformationSchema } from '@lib/applicants/validation';
import ValidationErrorAlert from '@components/form/ValidationErrorAlert';

/**
 * Props for Edit Permit Information Modal
 */
type EditPermitHolderInformationModalProps = {
  children: ReactNode;
  readonly permitHolderInformation: PermitHolderFormData;
  readonly onSave: (
    applicationData: any
  ) => Promise<UpdatePermitHolderInformationResponse | undefined | null>;
};

export default function EditPermitHolderInformationModal({
  children,
  permitHolderInformation,
  onSave,
}: EditPermitHolderInformationModalProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [error, setError] = useState<string>('');

  const onModalClose = () => {
    onClose();
    setError('');
  };

  const handleSubmit = async (values: { permitHolder: PermitHolderFormData }) => {
    const result = await onSave(values.permitHolder);

    if (result?.updateApplicationGeneralInformation.ok) {
      onModalClose();
    } else {
      setError(result?.updateApplicationGeneralInformation.error ?? '');
    }
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>
      <Modal onClose={onModalClose} isOpen={isOpen} scrollBehavior="inside" size="3xl">
        <ModalOverlay />
        <Formik
          initialValues={{ permitHolder: { ...permitHolderInformation } }}
          validationSchema={editRequestPermitHolderInformationSchema}
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
