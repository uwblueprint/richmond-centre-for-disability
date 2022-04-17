import { Button, Text, Box, Stack } from '@chakra-ui/react'; // Chakra UI
import Link from 'next/link'; // Link
import CompleteRequestModalButton from '@components/admin/requests/processing/CompleteModalButton'; // Mark as complete button + modal
import Footer from '@components/admin/Footer';
type ProcessingTasksFooterProps = {
  readonly applicationId: number;
  readonly applicantId?: number;
  readonly allStepsCompleted: boolean;
};

export default function ProcessingTasksFooter({
  applicationId,
  applicantId,
  allStepsCompleted,
}: ProcessingTasksFooterProps) {
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
        <Box>
          <Stack direction="row" justifyContent="space-between">
            <CompleteRequestModalButton
              applicationId={applicationId}
              isDisabled={!allStepsCompleted}
            />
          </Stack>
        </Box>
      </Stack>
    </Footer>
  );
}
