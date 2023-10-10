import { useRouter } from 'next/router';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Spacer,
  useDisclosure,
  VStack,
  Wrap,
} from '@chakra-ui/react'; // Chakra UI
import { ChevronDownIcon, ChevronLeftIcon } from '@chakra-ui/icons'; // Chakra UI icon
import Link from 'next/link'; // Link
import { ApplicantStatus } from '@lib/graphql/types';
import PermitHolderStatusBadge from '@components/admin/PermitHolderStatusBadge';
import ConfirmDeleteApplicantModal from '@components/admin/permit-holders/table/ConfirmDeleteApplicantModal';
import SetPermitHolderToInactiveModal from '@components/admin/permit-holders/table/ConfirmSetInactiveModal';
import SetPermitHolderToActiveModal from '@components/admin/permit-holders/table/ConfirmSetActiveModal';
import AdditionalNotesModal from '@components/admin/permit-holders/additional-notes/Modal';

type PermitHolderHeaderProps = {
  readonly applicant: {
    id: number;
    name: string;
    status: ApplicantStatus;
    inactiveReason?: string;
    notes: string;
  };
  readonly refetch: () => void;
};

export default function PermitHolderHeader({
  applicant: { id, name, status, inactiveReason, notes },
  refetch,
}: PermitHolderHeaderProps) {
  const router = useRouter();

  // Set Permit Holder Inactive/Active modal state
  const {
    isOpen: isSetPermitHolderStatusModalOpen,
    onOpen: onOpenSetPermitHolderStatusModal,
    onClose: onCloseSetPermitHolderStatusModal,
  } = useDisclosure();

  // Delete applicant modal state
  const {
    isOpen: isDeleteApplicantModalOpen,
    onOpen: onOpenDeleteApplicantModal,
    onClose: onCloseDeleteApplicantModal,
  } = useDisclosure();

  // Additional notes modal state
  const {
    isOpen: isNotesModalOpen,
    onOpen: onOpenNotesModal,
    onClose: onCloseNotesModal,
  } = useDisclosure();

  return (
    <>
      <VStack alignItems="stretch" spacing="12px">
        <HStack justify="space-between" alignItems="flex-end">
          <Box textAlign="left">
            <Link href="/admin/permit-holders" passHref>
              <Text textStyle="button-semibold" textColor="primary" as="a">
                <ChevronLeftIcon />
                All permit holders
              </Text>
            </Link>
            <VStack marginTop={5} align="left">
              <HStack>
                <Text textStyle="display-large" as="h1" marginRight={3}>
                  {name}
                </Text>
                <Wrap>
                  <PermitHolderStatusBadge variant={status} />
                </Wrap>
              </HStack>
              <HStack spacing="20px">
                <Box>
                  <Text textStyle="caption" as="p">
                    ID: #{id}
                  </Text>
                </Box>
                <Box>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                      height="30px"
                      bg="background.gray"
                      _hover={{ bg: 'background.grayHover' }}
                      color="black"
                    >
                      <Text textStyle="caption">More Actions</Text>
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        color={status === 'ACTIVE' ? 'text.critical' : 'text.success'}
                        textStyle="button-regular"
                        onClick={onOpenSetPermitHolderStatusModal}
                      >
                        {`Set as ${status === 'ACTIVE' ? 'Inactive' : 'Active'}`}
                      </MenuItem>
                      <MenuItem
                        color="text.critical"
                        textStyle="button-regular"
                        onClick={onOpenDeleteApplicantModal}
                      >
                        {'Delete Permit Holder'}
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Box>
                <Box>
                  {notes && (
                    <Text noOfLines={1}>
                      <b>Note:</b> {notes}
                    </Text>
                  )}
                </Box>
                <Spacer />
              </HStack>
            </VStack>
          </Box>
          <Button h="48px" variant="outline" onClick={onOpenNotesModal}>
            Additional Notes
          </Button>
        </HStack>
        {status === 'INACTIVE' && (
          <Alert status="error">
            <AlertIcon />
            <Text as="p" textStyle="caption">
              <b>Permit Holder is Inactive: </b>
              {inactiveReason || ''}
            </Text>
          </Alert>
        )}
      </VStack>

      {/* Modals for setting permit holder as active/inactive */}
      {status === 'ACTIVE' && (
        <SetPermitHolderToInactiveModal
          isOpen={isSetPermitHolderStatusModalOpen}
          applicantId={id}
          refetch={refetch}
          onClose={onCloseSetPermitHolderStatusModal}
        />
      )}
      {status === 'INACTIVE' && (
        <SetPermitHolderToActiveModal
          isOpen={isSetPermitHolderStatusModalOpen}
          applicantId={id}
          refetch={refetch}
          onClose={onCloseSetPermitHolderStatusModal}
        />
      )}
      <ConfirmDeleteApplicantModal
        isOpen={isDeleteApplicantModalOpen}
        applicantId={id}
        refetch={() => {
          /* Do not refetch, redirect to permit holders page */
        }}
        onClose={() => {
          onCloseDeleteApplicantModal();
          router.push('/admin/permit-holders');
        }}
      />

      {/* Additional notes modal */}
      <AdditionalNotesModal
        isOpen={isNotesModalOpen}
        notes={notes}
        applicantId={id}
        onClose={onCloseNotesModal}
        refetch={refetch}
      />
    </>
  );
}
