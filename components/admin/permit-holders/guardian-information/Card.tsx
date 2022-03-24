import { Box, Text, Divider, VStack } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card Component
import { Guardian } from '@lib/graphql/types'; // Guardian type

type GuardianInformationProps = {
  guardian: Guardian;
};

export default function GuardianInformationCard({ guardian }: GuardianInformationProps) {
  return (
    <PermitHolderInfoCard colSpan={7} header={`Guardian's Information`}>
      <Divider mt="24px" />

      <VStack spacing="12px" align="left" paddingTop="24px">
        <Box>
          <Text as="p" textStyle="body-regular">
            {`${guardian.firstName} ${guardian.lastName}`}
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
            {guardian.addressLine1}
          </Text>
          <Text as="p" textStyle="body-regular">
            {guardian.addressLine2 || ''}
          </Text>
          <Text as="p" textStyle="body-regular">
            {`${guardian.city} ${guardian.province}`}
          </Text>
          <Text as="p" textStyle="body-regular">
            {`Canada`}
          </Text>
          <Text as="p" textStyle="body-regular">
            {guardian.postalCode}
          </Text>
        </Box>
      </VStack>
    </PermitHolderInfoCard>
  );
}
