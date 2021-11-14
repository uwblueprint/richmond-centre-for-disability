import {
  Box,
  Flex,
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
import RequestStatusBadge from '@components/admin/RequestStatusBadge'; // Request status badge
import ApproveRequestModal from '@components/admin/requests/modals/ApproveRequestModal'; // Approve button + modal
import RejectRequestModal from '@components/admin/requests/modals/RejectRequestModal'; // Reject button + modal
import CompleteRequestModal from '@components/admin/requests/modals/CompleteRequestModal'; // Mark as complete button + modal
import { ApplicationStatus } from '@lib/graphql/types'; // Types

type RequestHeaderProps = {
  readonly applicationStatus?: ApplicationStatus;
  readonly createdAt: Date;
  readonly allStepsCompleted: boolean;
  readonly onApprove: () => void;
  readonly onReject: () => void;
  readonly onComplete: () => void;
};

/**
 * Header of View Request page
 * @param applicationStatus Status of application
 * @param createdAt Date of application creation
 * @param allStepsCompleted Whether all processing tasks are complete
 * @param onApprove Callback for handling application approval
 * @param onReject Callback for handling application rejection
 * @param onComplete Callback for handling application completion
 */
export default function RequestHeader({
  applicationStatus,
  createdAt,
  allStepsCompleted,
  onApprove,
  onReject,
  onComplete,
}: RequestHeaderProps) {
  /**
   * Returns the appropriate header button(s) to be displayed depending on the current application status
   * @returns Rendered button component(s) or null.
   */
  const _renderActionButtons = () => {
    switch (applicationStatus) {
      case ApplicationStatus.Pending:
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
      case ApplicationStatus.Approved:
        return (
          <CompleteRequestModal onComplete={onComplete}>
            <Button disabled={!allStepsCompleted}>Mark as complete</Button>
          </CompleteRequestModal>
        );
      default:
        return null;
    }
  };

  /**
   * Returns the appropriate 'More Actions' dropdown to be displayed depending on the current application status
]   * @returns Rendered 'More Actions' dropdown component or null
   */
  const _renderMoreActionsDropdown = () => {
    if (
      applicationStatus === ApplicationStatus.Approved ||
      applicationStatus === ApplicationStatus.Rejected
    ) {
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
            <Text textStyle="caption">More Actions</Text>
          </MenuButton>
          <MenuList>
            {applicationStatus === ApplicationStatus.Approved ? (
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
      <Flex marginTop={5} alignItems="center">
        <Box>
          <Flex alignItems="center">
            <Text textStyle="display-large" as="h1" marginRight={3}>
              Renewal Request
            </Text>
            {applicationStatus && <RequestStatusBadge variant={applicationStatus} />}
          </Flex>
          <HStack spacing={3} marginTop={3}>
            <Text textStyle="caption" as="p">
              Received date: {createdAt.toDateString()}
            </Text>
            {_renderMoreActionsDropdown()}
          </HStack>
        </Box>
        <Box marginLeft="auto">{_renderActionButtons()}</Box>
      </Flex>
    </Box>
  );
}
