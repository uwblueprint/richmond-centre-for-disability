import { FC, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Text, VStack, Badge, Wrap, Grid, GridItem } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card component
import {
  GetPhysicianAssessmentRequest,
  GetPhysicianAssessmentResponse,
  GET_PHYSICIAN_ASSESSMENT,
  PhysicianAssessment,
} from '@tools/admin/requests/physician-assessment';
import PermitTypeBadge from '@components/admin/PermitTypeBadge';
import { formatDate } from '@lib/utils/format';
import { titlecase } from '@tools/string';

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
        <Grid
          gridRowGap="12px"
          gridColumnGap="20px"
          templateColumns="200px 1fr"
          gridAutoRows="minmax(32px, auto)"
        >
          <GridItem>
            <Text as="p" textStyle="body-regular" textAlign="left">
              Medical name of disabling condition(s)
            </Text>
          </GridItem>
          <GridItem>
            <Text as="p" textStyle="body-regular" textAlign="left">
              {disability}
            </Text>
          </GridItem>
          <GridItem>
            <Text as="p" textStyle="body-regular" textAlign="left">
              Certification date
            </Text>
          </GridItem>
          <GridItem>
            <Text as="p" textStyle="body-regular" textAlign="left">
              {formatDate(disabilityCertificationDate)}
            </Text>
          </GridItem>
          <GridItem>
            <Text as="p" textStyle="body-regular" textAlign="left">
              Condition
            </Text>
          </GridItem>
          <Wrap>
            <Badge bgColor="background.informative">{titlecase(patientCondition as string)}</Badge>
          </Wrap>
          {patientCondition === 'OTHER' && (
            <>
              {/* Condition description */}
              <GridItem>
                <Text as="p" textStyle="body-regular" textAlign="left">
                  Condition description
                </Text>
              </GridItem>
              <GridItem>
                <Text as="p" textStyle="body-regular" textAlign="left">
                  {otherPatientCondition}
                </Text>
              </GridItem>
            </>
          )}
          <GridItem>
            <Text as="p" textStyle="body-regular" textAlign="left">
              Impairment type
            </Text>
          </GridItem>
          <GridItem>
            <PermitTypeBadge variant={permitType || 'PERMANENT'} />
          </GridItem>
          {permitType === 'TEMPORARY' && (
            <>
              <GridItem>
                <Text as="p" textStyle="body-regular" textAlign="left">
                  Permit expiry date
                </Text>
              </GridItem>
              <GridItem>
                <Text as="p" textStyle="body-regular" textAlign="left">
                  {formatDate(temporaryPermitExpiry)}
                </Text>
              </GridItem>
            </>
          )}
        </Grid>
      </VStack>
    </PermitHolderInfoCard>
  );
};

export default Card;
