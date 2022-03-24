import { ReactNode, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
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
  VStack,
} from '@chakra-ui/react'; // Chakra UI
import { ApplicationType } from '@lib/graphql/types';

type ReviewInformationModalProps = {
  readonly children: ReactNode;
  readonly applicationId: number;
  readonly onConfirmed: () => void;
};

export default function ReviewInformationModalProps({
  children,
  applicationId,
  onConfirmed,
}: ReviewInformationModalProps) {
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
            <AdditionalInformationCard applicationId={applicationId} isSubsection />
            <GuardianInformationCard applicationId={applicationId} isSubsection />
            <PaymentInformationCard applicationId={applicationId} editDisabled isSubsection />
          </>
        );
      case 'RENEWAL':
        return (
          <>
            <PersonalInformationCard applicationId={applicationId} editDisabled isSubsection />
            <DoctorInformationCard applicationId={applicationId} editDisabled isSubsection />
            <AdditionalInformationCard applicationId={applicationId} isSubsection />
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
      <Box onClick={onOpen}>{children}</Box>
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
            <Button variant="solid" onClick={onConfirmed} ml={'12px'}>
              {'Confirm'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
