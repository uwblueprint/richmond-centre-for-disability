import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  Box,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'; // Chakra UI
import { useState, SyntheticEvent, useEffect, FC } from 'react'; // React
import { GuardianInformation } from '@tools/admin/requests/guardian-information';
import GuardianInformationForm from './Form';
import { clientUploadToS3 } from '@lib/utils/s3-utils';
import { UpdateApplicationGuardianInformationInput } from '@lib/graphql/types';

type Props = {
  readonly guardianInformation: Omit<GuardianInformation, 'omitGuardianPoa'>;
  readonly onSave: (data: Omit<UpdateApplicationGuardianInformationInput, 'id'>) => void; // Callback that accepts the inputs defined in this page
};

const EditGuardianInformationModal: FC<Props> = ({
  children,
  guardianInformation: currentGuardianInformation,
  onSave,
}) => {
  // Guardian/POA File
  const [poaFile, setPoaFile] = useState<File | null>(null);

  // Guardian form information
  const [guardianInformation, setGuardianInformation] = useState<GuardianInformation>({
    omitGuardianPoa: false,
    ...currentGuardianInformation,
  });

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Toast message
  const toast = useToast();

  useEffect(() => {
    setGuardianInformation({
      omitGuardianPoa: false,
      ...currentGuardianInformation,
    });
  }, [currentGuardianInformation, isOpen]);

  /**
   * Handle edit submission
   */
  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    let poaFormS3ObjectKey = '';
    if (poaFile) {
      try {
        // TODO: Rename folder to rcd/poa-forms
        const { key } = await clientUploadToS3(poaFile, 'rcd/guardian-forms');
        poaFormS3ObjectKey = key;
      } catch (err) {
        toast({
          status: 'error',
          description: `Failed to upload POA file: ${err}`,
          isClosable: true,
        });
        return;
      }
    }

    const {
      omitGuardianPoa,
      firstName,
      middleName,
      lastName,
      phone,
      relationship,
      addressLine1,
      addressLine2,
      city,
      postalCode,
    } = guardianInformation;

    onSave({
      omitGuardianPoa,
      firstName,
      middleName,
      lastName,
      phone,
      relationship,
      addressLine1,
      addressLine2,
      city,
      postalCode,
      poaFormS3ObjectKey,
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
        size="3xl" //TODO: change to custom size
      >
        <ModalOverlay />
        <form onSubmit={handleSubmit}>
          <ModalContent paddingX="36px">
            <ModalHeader paddingBottom="12px" paddingTop="24px" paddingX="4px">
              <Text as="h2" textStyle="display-medium-bold">
                {'Edit Guardian/POA Information'}
              </Text>
            </ModalHeader>
            <ModalBody paddingTop="20px" paddingX="4px">
              <GuardianInformationForm
                guardianInformation={guardianInformation}
                onChange={setGuardianInformation}
                file={poaFile}
                onUploadFile={setPoaFile}
              />
            </ModalBody>
            <ModalFooter paddingBottom="24px" paddingTop="20px" paddingX="4px">
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
};

export default EditGuardianInformationModal;
