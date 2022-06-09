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
import DoctorInformationForm from '@components/admin/requests/doctor-information/Form';
import {
  DoctorFormData,
  UpdateDoctorInformationResponse as UpdateApplicationDoctorInformationResponse,
} from '@tools/admin/requests/doctor-information'; // GraphQL types
import { UpdateDoctorInformationResponse as UpdateApplicantDoctorInformationResponse } from '@tools/admin/permit-holders/doctor-information'; // GraphQL types}
import { Form, Formik } from 'formik';
import { editPhysicianInformationSchema } from '@lib/physicians/validation';
import ValidationErrorAlert from '@components/form/ValidationErrorAlert';

type EditDoctorInformationModalProps = {
  children: ReactNode;
  readonly doctorInformation: DoctorFormData;
  readonly onSave: (
    applicationData: DoctorFormData
  ) => Promise<
    | UpdateApplicantDoctorInformationResponse
    | UpdateApplicationDoctorInformationResponse
    | undefined
    | null
  >;
};

export default function EditDoctorInformationModal({
  children,
  doctorInformation,
  onSave,
}: EditDoctorInformationModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState<string>('');

  const onModalClose = () => {
    onClose();
    setError('');
  };

  const handleSubmit = async (values: { doctorInformation: DoctorFormData }) => {
    const result = await onSave(values.doctorInformation);
    if (
      (result as UpdateApplicantDoctorInformationResponse)?.updateApplicantDoctorInformation?.ok ||
      (result as UpdateApplicationDoctorInformationResponse)?.updateApplicationDoctorInformation?.ok
    ) {
      onModalClose();
    } else {
      setError(
        ((result as UpdateApplicantDoctorInformationResponse)?.updateApplicantDoctorInformation
          ?.error ||
          (result as UpdateApplicationDoctorInformationResponse)?.updateApplicationDoctorInformation
            ?.error) ??
          ''
      );
    }
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior="inside"
        size="3xl" //TODO: change to custom size
      >
        <ModalOverlay />
        <Formik
          initialValues={{ doctorInformation }}
          validationSchema={editPhysicianInformationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid }) => (
            <Form style={{ width: '100%' }} noValidate>
              <ModalContent paddingX="36px">
                <ModalHeader
                  textStyle="display-medium-bold"
                  paddingBottom="12px"
                  paddingTop="24px"
                  paddingX="4px"
                >
                  <Text as="h2" textStyle="display-medium-bold">
                    {"Edit Doctor's Information"}
                  </Text>
                </ModalHeader>
                <ModalBody paddingY="20px" paddingX="4px">
                  <DoctorInformationForm />
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
