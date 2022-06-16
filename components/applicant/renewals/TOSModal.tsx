import Link from 'next/link'; // Linking
import { useInView } from 'react-intersection-observer'; // Detect when DOM element is in viewport
import {
  Box,
  Flex,
  Text,
  Button,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react'; // Chakra UI
import RenewalFlow from '@containers/RenewalFlow'; // Request container

export default function TOSModal() {
  // TOS acceptance timestamp
  const { setAcceptedTOSTimestamp } = RenewalFlow.useContainer();

  // Modal state and close callback
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  // Hook for detecting when the user has fully scrolled over the last paragraph
  const [lastParagraphRef, finishedTOS] = useInView({
    threshold: 1, // Last paragraph needs to be fully scrolled over
    triggerOnce: true, // Only trigger once
  });

  /**
   * Handle agreement to TOS
   */
  const handleTOSAgree = () => {
    // Set timestamp of TOS agreement
    setAcceptedTOSTimestamp(new Date());

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text textStyle="display-medium-bold">Terms and Conditions</Text>
        </ModalHeader>
        <ModalBody>
          <Text as="p" textStyle="body-bold" marginBottom="12px">
            {`Please read these terms of use ("terms of use", "agreement") carefully before using The
            Permit Renewal service website (“website”, "service") operated by the Richmond Centre
            for Disability ("us", 'we", "our").`}
          </Text>
          <TOSSection sectionTitle={`Conditions of use`}>
            {`By using this website, you certify that you have read and reviewed this Agreement and
            that you agree to comply with its terms. If you do not want to be bound by the terms of
            this Agreement, you are advised to leave the website accordingly. Richmond Centre for
            Disability (RCD) only grants use and access of this website, its products, and its
            services to those who have accepted its terms.`}
          </TOSSection>
          <TOSSection sectionTitle={`Privacy policy`}>
            {`Before you continue using RCD Parking Permit Self-service portal, we advise you to read
            our privacy policy [link to privacy policy] regarding our user data collection. It will
            help you better understand our practices.`}
          </TOSSection>
          <TOSSection sectionTitle={`User information`}>
            {`As a user of this website, you may be asked to provide private information. You are
            responsible for ensuring the accuracy of this information, and you are responsible for
            maintaining the safety and security of your identifying information. You are also
            responsible for all activities that occur under your login.`}
            {`If you think there are any
            possible issues regarding the security of your private information on the website,
            inform us immediately so we may address it accordingly. We reserve all rights to
            terminate accounts, edit or remove content and cancel orders in their sole discretion.`}
          </TOSSection>
          <TOSSection sectionTitle={`Applicable law`}>
            {`By visiting this website, you agree that the laws of British Columbia province, without
            regard to principles of conflict laws, will govern these terms and conditions, or any
            dispute of any sort that might come between Richmond Centre for Disability and you, or
            its business partners and associates.`}
          </TOSSection>
          <TOSSection sectionTitle={`Disputes`}>
            {`Any dispute related in any way to your visit to this website from us shall be arbitrated
            by British Columbia province court and you consent to exclusive jurisdiction and venue
            of such courts.`}
          </TOSSection>
          <TOSSection sectionTitle={`Indemnification`}>
            {`You agree to indemnify RCD and its affiliates and hold RCD harmless against legal claims
            and demands that may arise from your use or misuse of our services. We reserve the right
            to select our own legal counsel.`}
          </TOSSection>
          <TOSSection sectionTitle={`Limitation on liability`} isLast>
            {`RCD is not liable for any damages that may occur to you as a result of your misuse of
            our website. RCD reserves the right to edit, modify, and change this Agreement any time.
            We shall let our users know of these changes through electronic mail. This Agreement is
            an understanding between RCD and the user, and this supersedes and replaces all prior
            agreements regarding the use of this website.`}
          </TOSSection>
          {/* TODO: Find a better way of assigning last paragraph ref */}
          <a ref={lastParagraphRef} />
        </ModalBody>
        <ModalFooter>
          <Box width="100%">
            <Divider marginBottom="16px" />
            <Flex width="100%" justifyContent="flex-start" marginBottom="16px">
              <Text as="p" textStyle="body-bold">
                Please read to the end to enable ”I agree” button.
              </Text>
            </Flex>
            <Flex width="100%" justifyContent="flex-end">
              <Link href="/">
                <Button variant="outline" marginRight="12px">{`Go back to home page`}</Button>
              </Link>
              <Button
                variant="solid"
                disabled={!finishedTOS}
                onClick={handleTOSAgree}
              >{`I agree`}</Button>
            </Flex>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

type TOSSectionProps = {
  readonly sectionTitle: string;
  readonly children: string | ReadonlyArray<string>;
  readonly isLast?: boolean;
};

function TOSSection(props: TOSSectionProps) {
  const { sectionTitle, children, isLast } = props;

  return (
    <Box>
      <Text as="h6" textStyle="body-bold">
        {sectionTitle}
      </Text>
      {typeof children === 'string' ? (
        <Text as="p" textStyle="body-regular" marginBottom={isLast ? 0 : '27px'}>
          {children}
        </Text>
      ) : (
        children.map((paragraph, i) => (
          <Text key={`paragraph-${i}`} as="p" textStyle="body-regular" marginBottom="27px">
            {paragraph}
          </Text>
        ))
      )}
    </Box>
  );
}
