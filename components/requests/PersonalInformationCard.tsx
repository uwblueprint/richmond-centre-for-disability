import { Box, HStack, VStack, Text, Divider, Badge, Link } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/internal/PermitHolderInfoCard'; // Custom Card component
import { Applicant } from '@lib/graphql/types'; // Applicant type
import { MouseEventHandler } from 'react'; // React

type PersonalInformationProps = {
  readonly applicant: Applicant;
  readonly expirationDate: string;
  readonly mostRecentAPP: number;
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
          <Text as="p" textStyle="body-regular">
            Permanent Permit Holder
          </Text>
        </Box>
        <Box>
          <Text as="p" textStyle="body-regular">
            User ID: {applicant.rcdUserId}
          </Text>
        </Box>
        <Box>
          <HStack spacing="4px">
            <Text as="p" textStyle="body-regular" marginRight={2}>
              Most recent APP: #{props.mostRecentAPP}
            </Text>
            <Badge variant="ACTIVE">Active</Badge>
          </HStack>
          <Text as="p" textStyle="xsmall" color="secondary">
            Expiring {props.expirationDate}
          </Text>
        </Box>
      </VStack>
      <Divider pt="24px" />
      <VStack spacing="12px" pt="12px" align="left">
        <HStack spacing="12px">
          <Box>
            <Text as="h4" textStyle="body-bold">
              Contact Information
            </Text>
          </Box>
          {props.contactInfoUpdated && (
            <Text as="p" textStyle="caption" opacity="0.5">
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
          <Text as="p" textStyle="body-regular">
            {applicant.phone}
          </Text>
        </Box>
      </VStack>
      <Divider pt="24px" />
      <VStack spacing="12px" pt="12px" align="left">
        <HStack spacing="12px">
          <Box>
            <Text as="h4" textStyle="body-bold">
              Home Address
            </Text>
          </Box>
          {props.contactInfoUpdated && (
            <Text as="p" textStyle="caption" opacity="0.5">
              updated
            </Text>
          )}
        </HStack>
        <Box>
          <Text as="p" textStyle="body-regular">
            {applicant.addressLine1}
          </Text>
          <Text as="p" textStyle="body-regular">
            {applicant.addressLine2}
          </Text>
          <Text as="p" textStyle="body-regular">
            {applicant.city} {applicant.province}
          </Text>
          <Text as="p" textStyle="body-regular">
            Canada
          </Text>
          <Text as="p" textStyle="body-regular">
            {applicant.postalCode}
          </Text>
        </Box>
      </VStack>
    </PermitHolderInfoCard>
  );
}
