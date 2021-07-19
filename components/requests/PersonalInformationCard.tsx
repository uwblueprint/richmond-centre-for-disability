import { Box, HStack, VStack, Text, Divider, Badge, Link } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/internal/PermitHolderInfoCard'; // Custom Card component
import { Applicant } from '@lib/graphql/types'; // Applicant type
import { MouseEventHandler } from 'react'; // React

type PersonalInformationProps = {
  readonly applicant: Applicant;
  readonly expirationDate: string;
  readonly mostRecentAPP: string;
  readonly contactInfoUpdated?: boolean;
  readonly addressInfoUpdated?: boolean;
  readonly handleEdit: MouseEventHandler;
  readonly handleName: MouseEventHandler;
};

export default function PersonalInformationCard(props: PersonalInformationProps) {
  const { applicant } = props;
  const header = (
    <Link
      textStyle="display-small-semibold"
      color="primary"
      textDecoration="underline"
      onClick={props.handleName}
    >
      {`${applicant.firstName} ${applicant.lastName}`}
    </Link>
  );
  return (
    <PermitHolderInfoCard colSpan={5} header={header} handleEdit={props.handleEdit}>
      <VStack spacing="12px" pt="12px" align="left">
        <Box>
          <Text textStyle="body-regular">Permanent Permit Holder</Text>
        </Box>
        <Box>
          <Text textStyle="body-regular">User ID: {applicant.rcdUserId}</Text>
        </Box>
        <Box>
          <HStack spacing="4px">
            <Text textStyle="body-regular">Most Recent APP: #{props.mostRecentAPP}</Text>
            <Badge variant="active">Active</Badge>
          </HStack>
          <Text textStyle="xsmall">Expiring {props.expirationDate}</Text>
        </Box>
      </VStack>
      <Divider pt="24px" />
      <VStack spacing="12px" pt="12px" align="left">
        <HStack spacing="12px">
          {props.contactInfoUpdated && (
            <Text textStyle="caption" opacity="0.5">
              updated
            </Text>
          )}
        </HStack>
        <Box>
          <Link textStyle="body-regular" color="primary" textDecoration="underline">
            {applicant.email}
          </Link>
        </Box>
        <Box>
          <Text textStyle="body-regular">{applicant.phone}</Text>
        </Box>
      </VStack>
      <Divider pt="24px" />
      <VStack spacing="12px" pt="12px" align="left">
        {props.addressInfoUpdated && (
          <Text textStyle="caption" opacity="0.5">
            updated
          </Text>
        )}
        <Box>
          <Text textStyle="body-regular">{applicant.addressLine1}</Text>
          <Text textStyle="body-regular">{applicant.city}</Text>
          <Text textStyle="body-regular">Canada</Text>
          <Text textStyle="body-regular">{applicant.province}</Text>
        </Box>
      </VStack>
    </PermitHolderInfoCard>
  );
}
