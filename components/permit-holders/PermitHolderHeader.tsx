import { Box, Flex, HStack, Text } from '@chakra-ui/react'; // Chakra UI
import { ChevronLeftIcon } from '@chakra-ui/icons'; // Chakra UI icon
import Link from 'next/link'; // Link
import RequestStatusBadge from '@components/internal/RequestStatusBadge'; // Request status badge
import { Applicant, ApplicationStatus } from '@lib/graphql/types'; // Applicant type

type PermitHolderHeaderProps = {
  readonly applicant: Applicant;
  readonly applicationStatus: ApplicationStatus | 'EXPIRING' | 'EXPIRED' | 'ACTIVE';
};

export default function PermitHolderHeader({
  applicant,
  applicationStatus,
}: PermitHolderHeaderProps) {
  return (
    <Box textAlign="left">
      <Link href="/admin/permit-holders" passHref>
        <Text textStyle="button-semibold" textColor="primary" as="a">
          <ChevronLeftIcon />
          All permit holders
        </Text>
      </Link>
      <Flex marginTop={5} alignItems="center">
        <Box>
          <Flex alignItems="center">
            <Text textStyle="display-large" as="h1" marginRight={3}>
              {`${applicant.firstName} ${applicant.lastName}`}
            </Text>
            <RequestStatusBadge variant={applicationStatus} />
          </Flex>
          <HStack spacing={3} marginTop={3}>
            <Text textStyle="caption" as="p">
              ID: #{applicant.rcdUserId}
            </Text>
          </HStack>
        </Box>
      </Flex>
    </Box>
  );
}
