import { Box, HStack, Text, VStack, Wrap } from '@chakra-ui/react'; // Chakra UI
import { ChevronLeftIcon } from '@chakra-ui/icons'; // Chakra UI icon
import Link from 'next/link'; // Link
import { ApplicantStatus } from '@lib/graphql/types';
import PermitHolderStatusBadge from '@components/admin/PermitHolderStatusBadge';

type PermitHolderHeaderProps = {
  readonly applicant: {
    name: string;
    status: ApplicantStatus;
    rcdUserId: number | null; // TODO: Should be non-null (same as DB schema)
  };
};

export default function PermitHolderHeader({
  applicant: { name, status, rcdUserId },
}: PermitHolderHeaderProps) {
  return (
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
        <Text textStyle="caption" as="p">
          ID: {rcdUserId ? `#${rcdUserId}` : 'N/A'}
        </Text>
      </VStack>
    </Box>
  );
}
