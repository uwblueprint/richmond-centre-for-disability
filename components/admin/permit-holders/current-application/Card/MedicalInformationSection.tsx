import { Grid, GridItem, Text, List, ListItem, HStack, Badge } from '@chakra-ui/react';
import { formatDate } from '@lib/utils/format';
import { GetCurrentApplicationResponse } from '@tools/admin/permit-holders/current-application';
import { titlecase } from '@tools/string';
import { FC } from 'react';
import CurrentApplicationCardSection from './CardSection';

type Props = {
  readonly application: Required<GetCurrentApplicationResponse['application']>;
};

const MedicalInformationSection: FC<Props> = ({ application }) => {
  const {
    type,
    disability,
    patientCondition,
    otherPatientCondition,
    disabilityCertificationDate,
    mobilityAids,
  } = application;

  if (type !== 'NEW') {
    return null;
  }

  return (
    <CurrentApplicationCardSection title="Medical Information">
      <Grid gridRowGap="12px" gridColumnGap="20px" templateColumns="200px 1fr" gridAutoRows="32px">
        {/* Disabling condition */}
        <GridItem>
          <Text as="p" textStyle="body-regular">
            Disabling condition
          </Text>
        </GridItem>
        <GridItem>
          <HStack h="initial" position="relative">
            <Text as="p" textStyle="body-regular">
              {disability}
            </Text>
            <Badge bgColor="background.informative">{titlecase(patientCondition)}</Badge>
          </HStack>
        </GridItem>
        {patientCondition === 'OTHER' && (
          <>
            {/* Condition description */}
            <GridItem>
              <Text as="p" textStyle="body-regular">
                Condition description
              </Text>
            </GridItem>
            <GridItem>
              <Text as="p" textStyle="body-regular">
                {otherPatientCondition}
              </Text>
            </GridItem>
          </>
        )}

        {/* Certification date */}
        <GridItem>
          <Text as="p" textStyle="body-regular">
            Certification date
          </Text>
        </GridItem>
        <GridItem>
          <Text as="p" textStyle="body-regular">
            {!!disabilityCertificationDate && formatDate(disabilityCertificationDate)}
          </Text>
        </GridItem>
        {/* Mobility aids */}
        <GridItem>
          <Text as="p" textStyle="body-regular">
            Mobility aids
          </Text>
        </GridItem>
        <GridItem>
          <List>
            {mobilityAids?.map(aid => (
              <ListItem key={aid}>
                <Text as="p" textStyle="body-regular">
                  {titlecase(aid)}
                </Text>
              </ListItem>
            ))}
          </List>
        </GridItem>
      </Grid>
    </CurrentApplicationCardSection>
  );
};

export default MedicalInformationSection;
