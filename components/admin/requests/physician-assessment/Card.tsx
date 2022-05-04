import { FC, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Box, Text, SimpleGrid, VStack, Badge } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card component
import {
  GetPhysicianAssessmentRequest,
  GetPhysicianAssessmentResponse,
  GET_PHYSICIAN_ASSESSMENT,
  PhysicianAssessment,
} from '@tools/admin/requests/physician-assessment';

type Props = {
  readonly applicationId: number;
  readonly isUpdated?: boolean;
  /** Whether card is a subsection */
  readonly isSubsection?: boolean;
};

const Card: FC<Props> = props => {
  const { applicationId, isUpdated, isSubsection } = props;

  const [physicianAssessment, setPhysicianAssessment] = useState<PhysicianAssessment | null>(null);

  useQuery<GetPhysicianAssessmentResponse, GetPhysicianAssessmentRequest>(
    GET_PHYSICIAN_ASSESSMENT,
    {
      variables: { id: applicationId },
      onCompleted: data => {
        if (data) {
          setPhysicianAssessment(data.application);
        }
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  if (!physicianAssessment) {
    return null;
  }

  const {
    disability,
    disabilityCertificationDate,
    patientCondition,
    otherPatientCondition,
    temporaryPermitExpiry,
    permitType,
  } = physicianAssessment;

  return (
    <PermitHolderInfoCard
      colSpan={7}
      header={`Physician’s Assessment`}
      updated={isUpdated}
      divider
      isSubsection={isSubsection}
      editModal={false}
    >
      <VStack align="left" spacing="12px">
        <SimpleGrid columns={2} spacingX="70px" spacingY="12px">
          <Box>
            <Text as="p" textStyle="body-regular" textAlign="left">
              Medical name of disabling condition(s)
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular" textAlign="left">
              {/* NOTETOSELF: Should disability be an array? */}
              {disability}
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular" textAlign="left">
              Certification date
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular" textAlign="left">
              {/* NOTETOSELF: Format date */}
              {disabilityCertificationDate}
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular" textAlign="left">
              Condition
            </Text>
          </Box>
          <Box>
            {/* NOTETOSELF: Verify this */}
            {/* Can we have multiple since we have patientCondition and otherPatientCondition */}
            {/* NOTETOSELF: How is badge colour determined */}
            <Badge as="p" textStyle="body-regular" textAlign="left">
              {patientCondition}
            </Badge>
            <Badge as="p" textStyle="body-regular" textAlign="left">
              {otherPatientCondition}
            </Badge>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular" textAlign="left">
              Condition description
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular" textAlign="left">
              {/* NOTETOSELF: What's the condition description? Is it notes from the MedicalInformation table */}
              {patientCondition} {/* placeholder */}
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular" textAlign="left">
              Impairment type
            </Text>
          </Box>
          <Box>
            {/* NOTETOSELF: How is badge colour determined */}
            <Badge as="p" textStyle="body-regular" textAlign="left">
              {permitType}
            </Badge>
          </Box>
          {/* NOTETOSELF: Should this be rendered for permanent permits */}
          <Box>
            <Text as="p" textStyle="body-regular" textAlign="left">
              Permit expiry date
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular" textAlign="left">
              {/* NOTETOSELF: Format date */}
              {temporaryPermitExpiry}
            </Text>
          </Box>
        </SimpleGrid>
      </VStack>
    </PermitHolderInfoCard>
  );
};

export default Card;
