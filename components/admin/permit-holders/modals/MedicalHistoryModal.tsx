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
  Divider,
  ListItem,
  UnorderedList,
  Badge,
  HStack,
} from '@chakra-ui/react'; // Chakra UI
import { ReactNode } from 'react'; // React
import { Aid, Application } from '@lib/graphql/types'; // Application type & Aid enum
import { formatDate } from '@lib/utils/format'; // Date formatter util

type MedicalHistoryModalProps = {
  application: Application;
  children: ReactNode;
};

export default function MedicalHistoryModal(props: MedicalHistoryModalProps) {
  const { application, children } = props;

  const { isOpen, onClose, onOpen } = useDisclosure();
  const _renderAidsList = (aids: Aid[]): JSX.Element => {
    return (
      <UnorderedList paddingLeft="15px">
        {aids?.map(aid => (
          <ListItem key={aid} textStyle="body-regular">
            {aid
              .toLowerCase()
              .replace(/^\w/, c => c.toUpperCase())
              .replace('_', ' ')}
          </ListItem>
        ))}
      </UnorderedList>
    );
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal onClose={onClose} isOpen={isOpen} scrollBehavior="inside" size="3xl">
        <ModalOverlay />
        <ModalContent paddingX="36px">
          <ModalHeader
            textStyle="display-medium-bold"
            paddingBottom="22px"
            paddingTop="24px"
            paddingX="4px"
          >
            <Text as="h2" textStyle="display-medium-bold">
              {`${application.disability} (${formatDate(application.createdAt)})`}
            </Text>
          </ModalHeader>
          <ModalBody paddingTop="0px" paddingBottom="36px" paddingX="4px">
            {(application.patientEligibility == 'AFFECTS_MOBILITY' ||
              application.patientEligibility == 'MOBILITY_AID_REQUIRED' ||
              application.patientEligibility == 'CANNOT_WALK_100M') && (
              <HStack paddingBottom="22px" spacing="16px">
                {application.patientEligibility == 'AFFECTS_MOBILITY' && (
                  <Badge backgroundColor="background.informative">{'Affects Mobility'}</Badge>
                )}
                {application.patientEligibility == 'MOBILITY_AID_REQUIRED' && (
                  <Badge backgroundColor="background.informative">{'Aid Required'}</Badge>
                )}
                {application.patientEligibility == 'CANNOT_WALK_100M' && (
                  <Badge backgroundColor="background.informative">{'Cannot walk > 100m'}</Badge>
                )}
              </HStack>
            )}

            <Divider />

            {application.aid && (
              <Box paddingTop="24px">
                <Text as="h3" textStyle="heading" paddingBottom="20px">
                  {'Mobility Aids:'}
                </Text>
                {_renderAidsList(application.aid)}
              </Box>
            )}

            {application.notes && (
              <Box paddingTop="32px">
                <Text as="h3" textStyle="heading" paddingBottom="20px">
                  {'Notes: '}
                </Text>
                <Text as="p" textStyle="body-regular">
                  {application.notes}
                </Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter paddingTop="0px" paddingBottom="24px" paddingX="4px">
            <Button
              colorScheme="gray"
              variant="solid"
              onClick={onClose}
              size="lg"
              width="93px"
              height="48px"
            >
              {'Back'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
