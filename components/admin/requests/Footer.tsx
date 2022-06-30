import { Box, HStack, Text, Button, Link, Stack } from '@chakra-ui/react'; // Chakra UI
import ApproveRequestModal from '@components/admin/requests/processing/ApproveRequestModal'; // Approve button + modal
import RejectRequestModal from '@components/admin/requests/processing/RejectRequestModal'; // Reject button + modal
import { ApplicationStatus } from '@lib/graphql/types';
import Footer from '@components/admin/Footer';
import CompleteRequestModalButton from './processing/CompleteModalButton';

type RequestFooterProps = {
  readonly applicationId: number;
  readonly applicationStatus?: ApplicationStatus;
  readonly allStepsCompleted: boolean;
  readonly applicantId?: number;
};

/**
 * Footer of View Request page
 * @param applicationId ID of application
 * @param applicationStatus Status of application creation
 * @param allStepsCompleted Whether all processing tasks are complete
 * @param applicantId ID of applicant
 */
export default function RequestFooter({
  applicationId,
  applicationStatus,
  allStepsCompleted,
  applicantId,
}: RequestFooterProps) {
  /**
   * Returns the appropriate footer button(s) to be displayed depending on the current application status
   * @returns Rendered button component(s) or null.
   */
  const _renderActionButtons = () => {
    switch (applicationStatus) {
      case 'PENDING':
        return (
          <HStack spacing="20px">
            <RejectRequestModal applicationId={applicationId}>
              <Button
                height="48px"
                bg="secondary.critical"
                _hover={{ bg: 'secondary.criticalHover' }}
              >
                <Text textStyle="button-semibold">Reject request</Text>
              </Button>
            </RejectRequestModal>
            <ApproveRequestModal applicationId={applicationId}>
              <Button height="48px">
                <Text textStyle="button-semibold">Approve request</Text>
              </Button>
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
              <Link href={`/admin/permit-holder/` + applicantId} isExternal>
                <a>
                  <Button
                    bg="background.gray"
                    _hover={{ bg: 'background.grayHover' }}
                    marginRight="20px"
                    height="48px"
                  >
                    <Text textStyle="button-semibold" color="text.default">
                      View permit holder page
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
