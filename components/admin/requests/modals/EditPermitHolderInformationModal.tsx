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
import { useState, useEffect, SyntheticEvent, ReactNode } from 'react'; // React
import { UpdateApplicationInput } from '@lib/graphql/types'; // GraphQL Types
import {
  NewAndRenewalPermitHolderInformation,
  PermitHolderInformation,
} from '@tools/components/admin/requests/forms/types';
import PermitHolderInformationForm from '@components/admin/requests/forms/PermitHolderInformationForm';

/**
 * Permit holder information props used for replacement requests.
 *
 * @param type identifies the prop object type
 * @param {PermitHolderInformation} permitHolderInformation Data Structure that holds all permit holder information for a client request.
 */
type ReplacementPermitHolderTypeInformation = {
  readonly type: 'replacement';
  readonly permitHolderInformation: PermitHolderInformation;
};

/**
 * Permit holder information props used for new or renewal requests.
 *
 * @param type identifies the prop object type
 * @param {NewAndRenewalPermitHolderInformation} permitHolderInformation Data Structure that holds all permit holder information for a client request.
 */
type NewAndRenewalPermitHolderTypeInformation = {
  readonly type: 'new' | 'renewal';
  readonly permitHolderInformation: NewAndRenewalPermitHolderInformation;
};

/**
 * Props for Edit Permit Information Modal
 */
type EditPermitHolderInformationModalProps = {
  children: ReactNode;
  readonly permitHolderInformation:
    | ReplacementPermitHolderTypeInformation
    | NewAndRenewalPermitHolderTypeInformation;
  readonly onSave: (applicationData: Omit<UpdateApplicationInput, 'id'>) => void;
};

export default function EditPermitHolderInformationModal({
  children,
  permitHolderInformation: currentPermitHolderInformation,
  onSave,
}: EditPermitHolderInformationModalProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [permitHolderTypeAndInformation, setPermitHolderTypeAndInformation] = useState<
    ReplacementPermitHolderTypeInformation | NewAndRenewalPermitHolderTypeInformation
  >(currentPermitHolderInformation);

  useEffect(() => {
    setPermitHolderTypeAndInformation(currentPermitHolderInformation);
  }, [currentPermitHolderInformation, isOpen]);

  //   TODO: Add error states for each field (post-mvp)

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    onSave(permitHolderTypeAndInformation.permitHolderInformation);
    onClose();
  };

  //TODO: investigate this due to TS type checking
  const handleReplacementPermitHolderInformationChange = (updatedData: PermitHolderInformation) => {
    if (permitHolderTypeAndInformation.type === 'replacement') {
      setPermitHolderTypeAndInformation({
        ...permitHolderTypeAndInformation,
        permitHolderInformation: updatedData,
      });
    }
  };

  const handleNewAndRenewalPermitHolderInformationChange = (
    updatedData: NewAndRenewalPermitHolderInformation
  ) => {
    if (
      permitHolderTypeAndInformation.type === 'new' ||
      permitHolderTypeAndInformation.type === 'renewal'
    ) {
      setPermitHolderTypeAndInformation({
        ...permitHolderTypeAndInformation,
        permitHolderInformation: updatedData,
      });
    }
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
                {'Edit Permit Holder Information'}
              </Text>
            </ModalHeader>
            <ModalBody paddingY="20px" paddingX="4px">
              {permitHolderTypeAndInformation.type === 'replacement' ? (
                <PermitHolderInformationForm
                  type={permitHolderTypeAndInformation.type}
                  permitHolderInformation={permitHolderTypeAndInformation.permitHolderInformation}
                  onChange={handleReplacementPermitHolderInformationChange}
                />
              ) : (
                <PermitHolderInformationForm
                  type={permitHolderTypeAndInformation.type}
                  permitHolderInformation={permitHolderTypeAndInformation.permitHolderInformation}
                  onChange={handleNewAndRenewalPermitHolderInformationChange}
                />
              )}
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
