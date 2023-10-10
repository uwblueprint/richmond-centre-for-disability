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
  AdditionalInformationFormData,
  UpdateAdditionalInformationResponse,
} from '@tools/admin/requests/additional-questions';
import AdditionalQuestionsForm from '@components/admin/requests/additional-questions/Form';
import { Form, Formik } from 'formik';
import { editAdditionalQuestionsSchema } from '@lib/applications/validation';
import ValidationErrorAlert from '@components/form/ValidationErrorAlert';

type Props = {
  readonly children: ReactNode;
  readonly additionalInformation: AdditionalInformationFormData;
  readonly onSave: (
    additionalInformation: AdditionalInformationFormData
  ) => Promise<UpdateAdditionalInformationResponse | undefined | null>;
};

export default function EditAdditionalInformationModal({
  children,
  additionalInformation,
  onSave,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState<string>('');

  const onModalClose = () => {
    onClose();
    setError('');
  };

  const handleSubmit = async (values: { additionalInformation: AdditionalInformationFormData }) => {
    const result = await onSave(values.additionalInformation);

    if (result?.updateApplicationAdditionalInformation?.ok) {
      onModalClose();
    } else {
      setError(result?.updateApplicationAdditionalInformation?.error ?? '');
    }
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal onClose={onClose} isOpen={isOpen} scrollBehavior="inside" size="3xl">
        <ModalOverlay />
        <Formik
          initialValues={{ additionalInformation: additionalInformation }}
          validationSchema={editAdditionalQuestionsSchema}
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
                    {'Edit Additional Information'}
                  </Text>
                </ModalHeader>
                <ModalBody paddingY="20px" paddingX="4px">
                  <AdditionalQuestionsForm additionalInformation={values.additionalInformation} />
                </ModalBody>
                <ValidationErrorAlert error={error} />
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
