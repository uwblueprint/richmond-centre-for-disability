import { useMemo, useState } from 'react';
import { useQuery } from '@tools/hooks/graphql';
import {
  GetReviewInformationRequest,
  GetReviewInformationResponse,
  GET_REVIEW_INFORMATION_QUERY,
} from '@tools/admin/requests/review-information';
import DoctorInformationCard from '@components/admin/requests/doctor-information/Card'; // Doctor information card
import PaymentInformationCard from '@components/admin/requests/payment-information/Card'; // Payment information card
import PersonalInformationCard from '@components/admin/requests/permit-holder-information/Card'; // Personal information card
import ReasonForReplacementCard from '@components/admin/requests/reason-for-replacement/Card';
import AdditionalInformationCard from '@components/admin/requests/additional-questions/Card';
import GuardianInformationCard from '@components/admin/requests/guardian-information/Card';
import UndoReviewRequestModal from '@components/admin/requests/processing/UndoReviewRequestModal';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'; // Chakra UI
import { ApplicationType } from '@lib/graphql/types';

type Props = {
  readonly isCompleted: boolean;
  readonly isDisabled: boolean;
  readonly applicationId: number;
  readonly onConfirmed: () => void;
  readonly onUndo: () => void;
  readonly loading: boolean;
};

export default function ReviewInformationStep({
  isCompleted,
  isDisabled,
  applicationId,
  onConfirmed,
  onUndo,
  loading,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [applicationType, setApplicationType] = useState<ApplicationType | null>(null);

  useQuery<GetReviewInformationResponse, GetReviewInformationRequest>(
    GET_REVIEW_INFORMATION_QUERY,
    {
      variables: { id: applicationId },
      onCompleted: data => {
        if (data) {
          setApplicationType(data.application.type);
        }
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  /** Rendered card sections for each application type */
  const _cardSections = useMemo(() => {
    switch (applicationType) {
      case 'NEW':
        return (
          <>
            <PersonalInformationCard applicationId={applicationId} editDisabled isSubsection />
            <DoctorInformationCard applicationId={applicationId} editDisabled isSubsection />
            <AdditionalInformationCard applicationId={applicationId} editDisabled isSubsection />
            <GuardianInformationCard applicationId={applicationId} editDisabled isSubsection />
            <PaymentInformationCard applicationId={applicationId} editDisabled isSubsection />
          </>
        );
      case 'RENEWAL':
        return (
          <>
            <PersonalInformationCard applicationId={applicationId} editDisabled isSubsection />
            <DoctorInformationCard applicationId={applicationId} editDisabled isSubsection />
            <AdditionalInformationCard applicationId={applicationId} editDisabled isSubsection />
            <PaymentInformationCard applicationId={applicationId} editDisabled isSubsection />
          </>
        );
      case 'REPLACEMENT':
        return (
          <>
            <PersonalInformationCard applicationId={applicationId} editDisabled isSubsection />
            <ReasonForReplacementCard applicationId={applicationId} editDisabled isSubsection />
            <PaymentInformationCard applicationId={applicationId} editDisabled isSubsection />
          </>
        );
      default:
        return null;
    }
  }, [applicationType, applicationId]);

  return (
    <>
      {isCompleted ? (
        <UndoReviewRequestModal onUndoConfirmed={onUndo}>
          <Button
            color={'black'}
            variant="ghost"
            textDecoration="underline black"
            isDisabled={loading}
            isLoading={loading}
            loadingText="Undo Review"
            fontWeight="normal"
            fontSize="14px"
          >
            <Text textStyle="caption" color="black">
              Undo Review
            </Text>
          </Button>
        </UndoReviewRequestModal>
      ) : (
        <Button
          marginLeft="auto"
          height="35px"
          bg="background.gray"
          _hover={isDisabled ? undefined : { bg: 'background.grayHover' }}
          color="black"
          disabled={isDisabled || loading}
          onClick={onOpen}
          isLoading={loading}
          loadingText="Review information"
          fontWeight="normal"
          fontSize="14px"
        >
          <Text textStyle="xsmall-medium">Review information</Text>
        </Button>
      )}
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior="inside"
        size="3xl" // TODO: change to custom size
      >
        <ModalOverlay />
        <ModalContent paddingX="36px">
          <ModalHeader
            textStyle="display-medium-bold"
            paddingBottom="12px"
            paddingTop="24px"
            paddingX="4px"
          >
            <Text as="h2" textStyle="display-medium-bold">
              {'Review Request Information'}
            </Text>
          </ModalHeader>
          <ModalBody paddingY="20px" paddingX="4px">
            <VStack width="100%" spacing="20px" align="stretch">
              {_cardSections}
            </VStack>
          </ModalBody>
          <ModalFooter paddingBottom="24px" paddingX="4px">
            <Button colorScheme="gray" variant="solid" onClick={onClose}>
              {'Cancel'}
            </Button>
            <Button
              variant="solid"
              onClick={() => {
                onConfirmed();
                onClose();
              }}
              ml={'12px'}
            >
              {'Confirm'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
