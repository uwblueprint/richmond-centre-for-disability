import { Box, Flex, Center, HStack, Text, Button } from '@chakra-ui/react'; // Chakra UI
import { ChevronLeftIcon } from '@chakra-ui/icons'; // Chakra UI icon
import Link from 'next/link'; // Link
import RequestStatusBadge from '@components/internal/RequestStatusBadge'; // Request status badge
import ApproveModal from '@components/requests/ApproveModal'; // Approve modal button + modal
import RejectModal from '@components/requests/RejectModal'; // Reject modal button + modal

type RequestHeaderProps = {
  readonly isRenewal: boolean;
  readonly applicationStatus: // TODO: Change this to the enum that we add
  'COMPLETED' | 'INPROGRESS' | 'PENDING' | 'REJECTED' | 'EXPIRING' | 'EXPIRED' | 'ACTIVE';
  readonly createdAt: string;
  readonly onApprove: () => void;
  readonly onReject: () => void;
};

export default function RequestHeader({
  isRenewal,
  applicationStatus,
  createdAt,
  onApprove,
  onReject,
}: RequestHeaderProps) {
  const rightButtons = () => {
    switch (applicationStatus) {
      case 'PENDING':
        return (
          <HStack spacing={3}>
            <RejectModal onReject={onReject} />
            <ApproveModal onApprove={onApprove} />
          </HStack>
        );
      case 'INPROGRESS':
        return <Button textStyle="button-semibold">Mark as Complete</Button>;
      default:
        return null;
    }
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
            <Text textStyle="display-xlarge" as="h1" marginRight={3}>
              {isRenewal ? 'Renewal' : 'Replacement'} Request
            </Text>
            <RequestStatusBadge variant={applicationStatus} />
          </Center>
          <Text textStyle="caption" as="p">
            Received {createdAt}
          </Text>
        </Box>
        <Box marginLeft="auto">{rightButtons()}</Box>
      </Flex>
    </Box>
  );
}
