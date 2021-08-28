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
import Table from '@components/internal/Table'; // Table component
import {
  GET_APPLICANT_PHYSICIANS_QUERY,
  GetApplicantPhysiciansRequest,
  GetApplicantPhysiciansResponse,
} from '@tools/pages/admin/permit-holders/past-physicians-modal';
import { ReactNode } from 'react'; // React
import { useState } from 'react'; // React
import { useQuery } from '@apollo/client'; // Apollo

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
  readonly permitHolderId: number;
};

type PreviousPhysicianData = {
  name: string;
  mspNumber: number;
  phone: string;
};

export default function PreviousDoctorsInformationModal({
  children,
  permitHolderId,
}: PreviousDoctorsInformationModalProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [physicianData, setPhysicianData] = useState<PreviousPhysicianData[]>();
  useQuery<GetApplicantPhysiciansResponse, GetApplicantPhysiciansRequest>(
    GET_APPLICANT_PHYSICIANS_QUERY,
    {
      variables: {
        id: permitHolderId,
      },
      onCompleted: data => {
        setPhysicianData(
          data.applicant.medicalHistory.map(record => ({
            name: record.physician.name,
            mspNumber: record.physician.mspNumber,
            phone: record.physician.phone,
          }))
        );
      },
    }
  );

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
              <Table columns={COLUMNS} data={physicianData || []} />
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
