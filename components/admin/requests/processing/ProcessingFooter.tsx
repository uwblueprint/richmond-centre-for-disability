import { Button, Text, Portal, Box, Stack } from '@chakra-ui/react'; // Chakra UI
import Link from 'next/link'; // Link
import CompleteRequestModalButton from '@components/admin/requests/processing/CompleteModalButton'; // Mark as complete button + modal

type ProcessingTasksFooterProps = {
  readonly applicationId: number;
  readonly permitHolderId?: number;
  readonly allStepsCompleted: boolean;
};

export default function ProcessingTasksFooter({
  applicationId,
  permitHolderId,
  allStepsCompleted,
}: ProcessingTasksFooterProps) {
  return (
    <Portal>
      <Box
        position="fixed"
        left="0"
        bottom="0"
        right="0"
        paddingY="20px"
        paddingX="140px"
        bgColor="white"
        boxShadow="dark-lg"
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Stack direction="row" justifyContent="space-between">
              {permitHolderId && (
                <Link href={`/admin/permit-holder/` + permitHolderId}>
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
              <Link href="#">
                <a>
                  <CompleteRequestModalButton
                    applicationId={applicationId}
                    isDisabled={!allStepsCompleted}
                  />
                </a>
              </Link>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Portal>
  );
}
