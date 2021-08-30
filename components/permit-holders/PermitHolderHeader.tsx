import { Badge, Box, Flex, HStack, Text, Wrap } from '@chakra-ui/react'; // Chakra UI
import { ChevronLeftIcon } from '@chakra-ui/icons'; // Chakra UI icon
import Link from 'next/link'; // Link
import { ApplicantData } from '@tools/pages/admin/permit-holders/permit-holder-id'; // Applicant data type

type PermitHolderHeaderProps = {
  readonly applicant: ApplicantData;
};

export default function PermitHolderHeader({ applicant }: PermitHolderHeaderProps) {
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
            {applicant && (
              <Text textStyle="display-large" as="h1" marginRight={3}>
                {`${applicant.firstName} ${applicant.lastName}`}
              </Text>
            )}
            {applicant.status && (
              <Wrap>
                <Badge variant={applicant.status}>{applicant.status}</Badge>
              </Wrap>
            )}
          </Flex>
          <HStack spacing={3} marginTop={3}>
            <Text textStyle="caption" as="p">
              ID: #{applicant?.rcdUserId}
            </Text>
          </HStack>
        </Box>
      </Flex>
    </Box>
  );
}
