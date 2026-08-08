import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  VStack,
  Alert,
  AlertIcon,
  Box,
} from '@chakra-ui/react';
import { formatDateYYYYMMDD } from '@lib/utils/date';
import { titlecase } from '@tools/string';
import { useEffect, useState } from 'react';

export type ActivePermitInfo = {
  rcdPermitId: number;
  type: string;
  expiryDate: string;
  createdAt?: string;
  active?: boolean;
};

/**
 * Check if a permit is considered active
 * @param permit Permit details object or null
 * @returns boolean true if warning pop-up should be triggered
 */
export const isActivePermit = (permit: ActivePermitInfo | null): boolean => {
  if (!permit) {
    return false;
  }

  return !!permit.active;
};

type Props = {
  readonly isOpen: boolean;
  readonly permit: ActivePermitInfo | null;
  readonly applicantName?: string;
  readonly onProceed: () => void;
  readonly onCancel: () => void;
};

/**
 * Warning modal displayed when staff selects a permit holder who has an active permit or recently renewed permit
 */
export default function ActivePermitWarningModal({
  isOpen,
  permit,
  applicantName,
  onProceed,
  onCancel,
}: Props) {
  const [shouldReturnFocus, setShouldReturnFocus] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setShouldReturnFocus(true);
    }
  }, [isOpen]);

  if (!permit) {
    return null;
  }

  const handleProceed = () => {
    setShouldReturnFocus(false);
    onProceed();
  };

  const handleCancel = () => {
    setShouldReturnFocus(true);
    onCancel();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleProceed}
      isCentered
      size="lg"
      returnFocusOnClose={shouldReturnFocus}
    >
      <ModalOverlay />
      <ModalContent pt={4}>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <Box>
                <Text textStyle="body-bold">
                  {applicantName ? `${applicantName} ` : 'This permit holder '}already has an active
                  permit.
                </Text>
              </Box>
            </Alert>

            <VStack align="stretch" spacing={2} bg="background.gray" padding={4} borderRadius="md">
              <Text textStyle="body-regular">
                <b>Permit Number:</b> #{permit.rcdPermitId}
              </Text>
              <Text textStyle="body-regular">
                <b>Permit Type:</b> {titlecase(permit.type)}
              </Text>
              <Text textStyle="body-regular">
                <b>Expiry Date:</b> {formatDateYYYYMMDD(new Date(permit.expiryDate))}
              </Text>
              {permit.createdAt && (
                <Text textStyle="body-regular">
                  <b>Issued Date:</b> {formatDateYYYYMMDD(new Date(permit.createdAt))}
                </Text>
              )}
            </VStack>

            <Text textStyle="body-regular">
              Please confirm if you still wish to proceed with processing another permit request or
              renewal for this permit holder.
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            bg="background.gray"
            _hover={{ bg: 'background.grayHover' }}
            color="black"
            marginRight={3}
            onClick={handleCancel}
          >
            <Text textStyle="button-semibold">Cancel</Text>
          </Button>
          <Button
            colorScheme="primary"
            bg="primary"
            _hover={{ bg: 'primaryHover' }}
            onClick={handleProceed}
          >
            <Text textStyle="button-semibold">Dismiss Warning</Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
