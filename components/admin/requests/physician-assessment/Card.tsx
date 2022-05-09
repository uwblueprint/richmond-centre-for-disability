import { FC, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  Text,
  VStack,
  Badge,
  Wrap,
  Grid,
  GridItem,
  List,
  ListItem,
  Button,
} from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card component
import {
  GetPhysicianAssessmentRequest,
  GetPhysicianAssessmentResponse,
  GET_PHYSICIAN_ASSESSMENT,
  PhysicianAssessment,
  UpdatePhysicianAssessmentRequest,
  UpdatePhysicianAssessmentResponse,
  UPDATE_PHYSICIAN_ASSESSMENT,
} from '@tools/admin/requests/physician-assessment';
import PermitTypeBadge from '@components/admin/PermitTypeBadge';
import { formatDateYYYYMMDD } from '@lib/utils/format';
import { titlecase } from '@tools/string';
import EditPhysicianAssessmentModal from './EditModal';

type Props = {
  readonly applicationId: number;
  readonly isUpdated?: boolean;
  readonly editDisabled?: boolean;
  /** Whether card is a subsection */
  readonly isSubsection?: boolean;
};

const Card: FC<Props> = props => {
  const { applicationId, isUpdated, editDisabled, isSubsection } = props;

  const [physicianAssessment, setPhysicianAssessment] = useState<PhysicianAssessment | null>(null);

  const { refetch } = useQuery<GetPhysicianAssessmentResponse, GetPhysicianAssessmentRequest>(
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

  const [updatePhysicianAssessment] = useMutation<
    UpdatePhysicianAssessmentResponse,
    UpdatePhysicianAssessmentRequest
  >(UPDATE_PHYSICIAN_ASSESSMENT);

  if (!physicianAssessment) {
    return null;
  }

  /** Handler for saving physician assessment */
  const handleSave = async (data: PhysicianAssessment) => {
    if (data.patientCondition === null || data.permitType === null) {
      // TODO: Improve error handling
      return;
    }

    await updatePhysicianAssessment({
      variables: {
        input: {
          id: applicationId,
          ...data,
          patientCondition: data.patientCondition,
          permitType: data.permitType,
        },
      },
    });
    refetch();
  };

  const {
    disability,
    disabilityCertificationDate,
    patientCondition,
    otherPatientCondition,
    temporaryPermitExpiry,
    permitType,
    mobilityAids,
  } = physicianAssessment;
  return (
    <PermitHolderInfoCard
      colSpan={7}
      header={`Physician’s Assessment`}
      updated={isUpdated}
      divider
      isSubsection={isSubsection}
      editModal={
        !editDisabled && (
          <EditPhysicianAssessmentModal
            physicianAssessment={{
              disability,
              disabilityCertificationDate,
              otherPatientCondition,
              temporaryPermitExpiry,
              patientCondition,
              permitType,
              mobilityAids,
            }}
            onSave={handleSave}
          >
            <Button color="primary" variant="ghost" textDecoration="underline">
              <Text textStyle="body-bold">Edit</Text>
            </Button>
          </EditPhysicianAssessmentModal>
        )
      }
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
              {formatDateYYYYMMDD(disabilityCertificationDate)}
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
          {/* NOTETOSELF: I think this is conditionally rendered? Will ask designers */}
          <GridItem>
            <Text as="p" textStyle="body-regular" textAlign="left">
              Mobility aids
            </Text>
          </GridItem>
          <GridItem>
            <List>
              {mobilityAids?.map(aid => (
                <ListItem key={aid}>
                  <Text as="p" textStyle="body-regular" textAlign="left">
                    {titlecase(aid)}
                  </Text>
                </ListItem>
              ))}
            </List>
          </GridItem>
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
                  {formatDateYYYYMMDD(temporaryPermitExpiry)}
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
