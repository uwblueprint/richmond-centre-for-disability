import {
  Box,
  Flex,
  Center,
  HStack,
  Text,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Button,
} from '@chakra-ui/react'; // Chakra UI
import { ChevronLeftIcon, ChevronDownIcon } from '@chakra-ui/icons'; // Chakra UI icon
import Link from 'next/link'; // Link
import RequestStatusBadge from '@components/internal/RequestStatusBadge'; // Request status badge
import ApproveRequestModal from '@components/requests/modals/ApproveRequestModal'; // Approve button + modal
import RejectRequestModal from '@components/requests/modals/RejectRequestModal'; // Reject button + modal
import CompleteRequestModal from '@components/requests/modals/CompleteRequestModal'; // Mark as complete button + modal

type RequestHeaderProps = {
  readonly isRenewal: boolean;
  readonly applicationStatus: // TODO: Change this to the enum that we add
  'COMPLETED' | 'INPROGRESS' | 'PENDING' | 'REJECTED' | 'EXPIRING' | 'EXPIRED' | 'ACTIVE';
  readonly createdAt: string;
  readonly onApprove: () => void;
  readonly onReject: () => void;
  readonly onComplete: () => void;
};

export default function RequestHeader({
  isRenewal,
  applicationStatus,
  createdAt,
  onApprove,
  onReject,
  onComplete,
}: RequestHeaderProps) {
  const rightButtons = () => {
    switch (applicationStatus) {
      case 'PENDING':
        return (
          <HStack spacing={3}>
            <RejectRequestModal onReject={onReject}>
              <Button bg="secondary.critical" _hover={{ bg: 'secondary.criticalHover' }}>
                Reject
              </Button>
            </RejectRequestModal>
            <ApproveRequestModal onApprove={onApprove}>
              <Button>Approve</Button>
            </ApproveRequestModal>
          </HStack>
        );
      case 'INPROGRESS':
        return <CompleteRequestModal onComplete={onComplete} />;
      default:
        return null;
    }
  };

  const moreActions = () => {
    if (applicationStatus === 'INPROGRESS' || applicationStatus === 'REJECTED') {
      return (
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            height="30px"
            bg="background.gray"
            _hover={{ bg: 'background.grayHover' }}
            color="black"
          >
            Actions
          </MenuButton>
          <MenuList>
            {applicationStatus === 'INPROGRESS' ? (
              <RejectRequestModal onReject={onReject}>
                <MenuItem>Reject request</MenuItem>
              </RejectRequestModal>
            ) : (
              <ApproveRequestModal onApprove={onApprove}>
                <MenuItem>Approve request</MenuItem>
              </ApproveRequestModal>
            )}
          </MenuList>
        </Menu>
      );
    }
    return null;
  };

  return (
    <Box textAlign="left">
      <Link href="/admin" passHref>
        <Text textStyle="button-semibold" textColor="primary" as="a">
          <ChevronLeftIcon />
          All requests
        </Text>
      </Link>
      <Flex marginTop={8} alignItems="center">
        <Box>
          <Center>
            <Text textStyle="display-large" as="h1" marginRight={3}>
              {isRenewal ? 'Renewal' : 'Replacement'} Request
            </Text>
            <RequestStatusBadge variant={applicationStatus} />
          </Center>
          <HStack spacing={3} marginTop={3}>
            <Text textStyle="caption" as="p">
              Received date: {createdAt}
            </Text>
            {moreActions()}
          </HStack>
        </Box>
        <Box marginLeft="auto">{rightButtons()}</Box>
      </Flex>
    </Box>
  );
}