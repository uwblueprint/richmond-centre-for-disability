import { Grid, GridItem, Text, List, ListItem, HStack, Badge } from '@chakra-ui/react';
import { formatDate } from '@lib/utils/date';
import { MedicalInformationSectionData } from '@tools/admin/permit-holders/current-application';
import { titlecase } from '@tools/string';
import { FC } from 'react';
import CurrentApplicationCardSection from './CardSection';

type Props = {
  readonly medicalInformation: MedicalInformationSectionData;
};

const MedicalInformationSection: FC<Props> = ({ medicalInformation }) => {
  const {
    disability,
    patientCondition,
    otherPatientCondition,
    disabilityCertificationDate,
    mobilityAids,
  } = medicalInformation;

  return (
    <CurrentApplicationCardSection title="Medical Information">
      <Grid
        gridRowGap="12px"
        gridColumnGap="20px"
        templateColumns="200px 1fr"
        gridAutoRows="minmax(32px, auto)"
      >
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

            {patientCondition !== null
              ? patientCondition.map(condition => (
                  <Badge key={condition} bgColor="background.informative">
                    {titlecase(condition)}
                  </Badge>
                ))
              : 'N/A'}
          </HStack>
        </GridItem>
        {patientCondition?.includes('OTHER') && (
          <>
            {/* Condition description */}
            <GridItem>
              <Text as="p" textStyle="body-regular">
                Other condition description
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
