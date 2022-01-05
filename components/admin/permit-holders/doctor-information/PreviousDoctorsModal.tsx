import {
  Box,
  Link,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  useDisclosure,
} from '@chakra-ui/react'; // Chakra UI
import Table from '@components/Table'; // Table component
import { ReactNode } from 'react'; // React
import { PreviousPhysicianData } from '@tools/pages/admin/permit-holders/types';

const COLUMNS = [
  {
    Header: 'Name',
    accessor: 'name',
    disableSortBy: true,
    minWidth: 140,
  },
  {
    Header: 'Phone #',
    accessor: 'phoneNumber',
    disableSortBy: true,
    maxWidth: 140,
  },
  {
    Header: 'MSP #',
    accessor: 'mspNumber',
    disableSortBy: true,
    maxWidth: 80,
  },
  {
    accessor: 'applicationId',
    disableSortBy: true,
    maxWidth: 200,
    Cell: _renderAppLink,
  },
];

type appProps = {
  value: { applicationId: number };
};

function _renderAppLink({ value }: appProps) {
  return (
    <Link href={`/admin/request/${value.applicationId}`} passHref>
      <Text textStyle="body-regular" textColor="primary" as="a">
        {'View associated APP'}
      </Text>
    </Link>
  );
}

type PreviousDoctorsInformationModalProps = {
  children: ReactNode;
  readonly previousPhysicianData: PreviousPhysicianData[];
};

export default function PreviousDoctorsInformationModal({
  children,
  previousPhysicianData,
}: PreviousDoctorsInformationModalProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal onClose={onClose} isOpen={isOpen} scrollBehavior="inside" size="3xl">
        <ModalOverlay />
        <ModalContent paddingX="36px">
          <ModalHeader
            textStyle="display-medium-bold"
            paddingBottom="32px"
            paddingTop="24px"
            paddingX="4px"
          >
            <Text as="h2" textStyle="display-medium-bold">
              {"Previous Doctors' Information"}
            </Text>
          </ModalHeader>
          <ModalBody paddingY="0px" paddingX="4px">
            <Box>
              <Table columns={COLUMNS} data={previousPhysicianData} />
            </Box>
          </ModalBody>
          <ModalFooter paddingTop="36px" paddingBottom="40px" paddingX="4px">
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
