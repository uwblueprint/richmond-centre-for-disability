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
              {`${application.disability} (${new Date(application.createdAt).toLocaleDateString(
                'en-ZA'
              )})`}
            </Text>
          </ModalHeader>
          <ModalBody paddingTop="0px" paddingBottom="36px" paddingX="4px">
            {(application.affectsMobility ||
              application.mobilityAidRequired ||
              application.cannotWalk100m) && (
              <HStack paddingBottom="22px" spacing="16px">
                {application.affectsMobility && (
                  <Badge backgroundColor="background.informative">{'Affects Mobility'}</Badge>
                )}
                {application.mobilityAidRequired && (
                  <Badge backgroundColor="background.informative">{'Aid Required'}</Badge>
                )}
                {application.cannotWalk100m && (
                  <Badge backgroundColor="background.informative">{'Cannot walk > 100m'}</Badge>
                )}
              </HStack>
            )}

            <Divider borderColor="border.secondary" />

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
