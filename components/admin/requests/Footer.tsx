import { Box, HStack, Text, Button, Link, Stack } from '@chakra-ui/react'; // Chakra UI
import ApproveRequestModal from '@components/admin/requests/processing/ApproveRequestModal'; // Approve button + modal
import RejectRequestModal from '@components/admin/requests/processing/RejectRequestModal'; // Reject button + modal
import { ApplicationStatus } from '@lib/graphql/types';
import Footer from '@components/admin/Footer';
import CompleteRequestModalButton from './processing/CompleteModalButton';

type RequestHeaderProps = {
  readonly applicationId: number;
  readonly applicationStatus?: ApplicationStatus;
  readonly allStepsCompleted: boolean;
  readonly applicantId?: number;
};

/**
 * Header of View Request page
 * @param applicationStatus Status of application
 * @param createdAt Date of application creation
 * @param allStepsCompleted Whether all processing tasks are complete
 */
export default function RequestHeader({
  applicationId,
  applicationStatus,
  allStepsCompleted,
  applicantId,
}: RequestHeaderProps) {
  /**
   * Returns the appropriate footer button(s) to be displayed depending on the current application status
   * @returns Rendered button component(s) or null.
   */
  const _renderActionButtons = () => {
    switch (applicationStatus) {
      case 'PENDING':
        return (
          <HStack spacing={3}>
            <RejectRequestModal applicationId={applicationId}>
              <Button bg="secondary.critical" _hover={{ bg: 'secondary.criticalHover' }}>
                Reject
              </Button>
            </RejectRequestModal>
            <ApproveRequestModal applicationId={applicationId}>
              <Button>Approve</Button>
            </ApproveRequestModal>
          </HStack>
        );
      case 'IN_PROGRESS':
        return (
          <Stack direction="row" justifyContent="space-between">
            <CompleteRequestModalButton
              applicationId={applicationId}
              isDisabled={!allStepsCompleted}
            />
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <Footer>
      <Stack width="100%" direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Stack direction="row" justifyContent="space-between">
            {applicantId && (
              <Link href={`/admin/permit-holder/` + applicantId}>
                <a>
                  <Button
                    bg="background.gray"
                    _hover={{ bg: 'background.grayHover' }}
                    marginRight="20px"
                    height="48px"
                    width="225px"
                  >
                    <Text textStyle="button-semibold" color="text.default">
                      View permit holder
                    </Text>
                  </Button>
                </a>
              </Link>
            )}
          </Stack>
        </Box>
        <Box>{_renderActionButtons()}</Box>
      </Stack>
    </Footer>
  );
}
