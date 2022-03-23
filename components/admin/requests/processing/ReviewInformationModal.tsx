import { ReactNode, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  GetReviewInformationRequest,
  GetReviewInformationResponse,
  GET_REVIEW_INFORMATION_QUERY,
} from '@components/admin/requests/processing/review-information';
import DoctorInformationCard from '@components/admin/requests/doctor-information/Card'; // Doctor information card
import PaymentInformationCard from '@components/admin/requests/payment-information/Card'; // Payment information card
import PersonalInformationCard from '@components/admin/requests/permit-holder-information/Card'; // Personal information card
import ReasonForReplacementCard from '@components/admin/requests/reason-for-replacement/Card';
import AdditionalInformationCard from '@components/admin/requests/additional-questions/Card';
import GuardianInformationCard from '@components/admin/permit-holders/guardian-information/Card';

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
import { ApplicationType, Guardian } from '@lib/graphql/types';

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
  const [applicationGuardian, setApplicationGuardian] = useState<Guardian | null>(null);

  useQuery<GetReviewInformationResponse, GetReviewInformationRequest>(
    GET_REVIEW_INFORMATION_QUERY,
    {
      variables: { id: applicationId },
      onCompleted: data => {
        if (data) {
          setApplicationGuardian({
            firstName: data.application.guardianFirstName || '',
            middleName: data.application.guardianMiddleName || '',
            lastName: data.application.guardianLastName || '',
            phone: data.application.guardianPhone || '',
            relationship: data.application.guardianRelationship || '',
            addressLine1: data.application.guardianAddressLine1 || '',
            addressLine2: data.application.guardianAddressLine2 || '',
            city: data.application.guardianCity || '',
            province: data.application.guardianProvince || 'BC',
            country: data.application.guardianCountry || '',
            postalCode: data.application.guardianPostalCode || '',
          });
          setApplicationType(data.application.type);
        }
      },
      notifyOnNetworkStatusChange: true,
    }
  );
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
              <PersonalInformationCard applicationId={applicationId} editDisabled />
              {applicationType === 'REPLACEMENT' ? (
                <ReasonForReplacementCard applicationId={applicationId} editDisabled />
              ) : (
                <>
                  <DoctorInformationCard applicationId={applicationId} editDisabled />
                  <AdditionalInformationCard applicationId={applicationId} />
                  {applicationType === 'NEW' && applicationGuardian && (
                    <GuardianInformationCard guardian={applicationGuardian} />
                  )}
                </>
              )}
              <PaymentInformationCard applicationId={applicationId} editDisabled />
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
