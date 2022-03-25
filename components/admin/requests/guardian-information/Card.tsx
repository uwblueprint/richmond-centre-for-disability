import { useQuery } from '@apollo/client';
import { Box, Text, Divider, VStack } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card Component
import { formatFullName } from '@lib/utils/format';
import {
  GetGuardianInformationRequest,
  GetGuardianInformationResponse,
  GET_GUARDIAN_INFORMATION,
  GuardianCardData,
} from '@tools/admin/requests/guardian-information';
import { useState } from 'react';

type GuardianInformationProps = {
  readonly applicationId: number;
  /** Whether card is a subsection */
  readonly isSubsection?: boolean;
};

export default function GuardianInformationCard({
  applicationId,
  isSubsection,
}: GuardianInformationProps) {
  const [guardian, setGuardian] = useState<GuardianCardData | null>(null);

  useQuery<GetGuardianInformationResponse, GetGuardianInformationRequest>(
    GET_GUARDIAN_INFORMATION,
    {
      variables: { id: applicationId },
      onCompleted: data => {
        if (data) {
          const {
            firstName,
            lastName,
            relationship,
            phone,
            addressLine1,
            city,
            province,
            country,
            postalCode,
          } = data.application;
          // Only set guardian if mandatory fields are non-null
          // TODO: Improve schema design by adding nesting
          if (
            !!firstName &&
            !!lastName &&
            !!relationship &&
            !!phone &&
            !!addressLine1 &&
            !!city &&
            !!province &&
            !!country &&
            !!postalCode
          ) {
            setGuardian(data.application);
          }
        }
      },
    }
  );

  if (!guardian) {
    return null;
  }

  return (
    <PermitHolderInfoCard colSpan={7} header={`Guardian's Information`} isSubsection={isSubsection}>
      <Divider mt="24px" />

      <VStack spacing="12px" align="left" paddingTop="24px">
        <Box>
          <Text as="p" textStyle="body-regular">
            {formatFullName(guardian.firstName, guardian.middleName, guardian.lastName)}
          </Text>
        </Box>
        <Box>
          <Text as="p" textStyle="body-regular">
            {`Phone: ${guardian.phone}`}
          </Text>
        </Box>
        <Box>
          <Text as="p" textStyle="body-regular">
            {`Relationship: ${guardian.relationship}`}
          </Text>
        </Box>
      </VStack>

      <Divider mt="24px" />

      <VStack spacing="12px" pt="24px" align="left">
        <Box>
          <Text as="h4" textStyle="body-bold">
            Address
          </Text>
        </Box>
        <Box>
          <Text as="p" textStyle="body-regular">
            {guardian.addressLine2 ? `${guardian.addressLine2} - ` : ''}
            {guardian.addressLine1}
          </Text>
          <Text as="p" textStyle="body-regular">
            {`${guardian.city} ${guardian.province}`}
          </Text>
          <Text as="p" textStyle="body-regular">
            {guardian.country}
          </Text>
          <Text as="p" textStyle="body-regular">
            {guardian.postalCode}
          </Text>
        </Box>
      </VStack>
    </PermitHolderInfoCard>
  );
}
