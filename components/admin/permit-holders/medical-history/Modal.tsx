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
} from '@chakra-ui/react'; // Chakra UI
import { ReactNode } from 'react'; // React
import { MobilityAid } from '@lib/graphql/types'; // Application type & Aid enum
import { formatDate } from '@lib/utils/date'; // Date formatter util
import { MedicalHistoryRow } from '@tools/admin/permit-holders/medical-history';

type MedicalHistoryModalProps = {
  details: MedicalHistoryRow['details'];
  children: ReactNode;
};

export default function MedicalHistoryModal(props: MedicalHistoryModalProps) {
  const { details, children } = props;

  const { isOpen, onClose, onOpen } = useDisclosure();

  const _renderAidsList = (aids: MobilityAid[]): JSX.Element => {
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

  const { disability, disabilityCertificationDate, patientCondition, mobilityAids, notes } =
    details;

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
              {`${disability} (${formatDate(disabilityCertificationDate)})`}
            </Text>
          </ModalHeader>
          <ModalBody paddingTop="0px" paddingBottom="36px" paddingX="4px">
            <Badge display="inline-block" backgroundColor="background.informative">
              {patientCondition}
            </Badge>
            <Divider my="24px" />
            <Box>
              <Text as="h3" textStyle="heading" paddingBottom="20px">
                {'Mobility Aids:'}
              </Text>
              {_renderAidsList(mobilityAids)}
            </Box>
            {notes && (
              <Box paddingTop="32px">
                <Text as="h3" textStyle="heading" paddingBottom="20px">
                  {'Notes: '}
                </Text>
                <Text as="p" textStyle="body-regular">
                  {notes}
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
