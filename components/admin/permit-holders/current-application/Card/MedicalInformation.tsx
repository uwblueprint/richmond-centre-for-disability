import { Grid, GridItem, Text, List, ListItem } from '@chakra-ui/react';
import { formatDate } from '@lib/utils/format';
import { GetCurrentApplicationResponse } from '@tools/admin/permit-holders/current-application';
import { FC } from 'react';
import CurrentApplicationCardSection from './CardSection';

type Props = {
  readonly application: Required<GetCurrentApplicationResponse['application']>;
};

const MedicalInformationSection: FC<Props> = ({ application }) => {
  const { type, disability, patientCondition, disabilityCertificationDate, mobilityAids } =
    application;

  // ? Return null if type is not NEW (other fields cannot exist)
  if (type !== 'NEW') {
    return null;
  }

  return (
    <CurrentApplicationCardSection title="Medical Information">
      <Grid gap="24px">
        {/* Disabling condition */}
        <GridItem colStart={1} colSpan={1} rowStart={1} rowSpan={1}>
          <Text as="p" textStyle="body-regular">
            Disabling condition
          </Text>
        </GridItem>
        <GridItem colStart={2} colSpan={1} rowStart={1} rowSpan={1}>
          <Text as="p" textStyle="body-regular">
            {patientCondition}
          </Text>
        </GridItem>
        {/* Condition description */}
        <GridItem colStart={1} colSpan={1} rowStart={2} rowSpan={1}>
          <Text as="p" textStyle="body-regular">
            Condition description
          </Text>
        </GridItem>
        <GridItem colStart={2} colSpan={1} rowStart={2} rowSpan={1}>
          <Text as="p" textStyle="body-regular">
            {disability}
          </Text>
        </GridItem>
        {/* Certification date */}
        <GridItem colStart={1} colSpan={1} rowStart={3} rowSpan={1}>
          <Text as="p" textStyle="body-regular">
            Certification date
          </Text>
        </GridItem>
        <GridItem colStart={2} colSpan={1} rowStart={3} rowSpan={1}>
          <Text as="p" textStyle="body-regular">
            {!!disabilityCertificationDate && formatDate(disabilityCertificationDate)}
          </Text>
        </GridItem>
        {/* Mobility aids */}
        <GridItem colStart={1} colSpan={1} rowStart={4} rowSpan={1}>
          <Text as="p" textStyle="body-regular">
            Mobility aids
          </Text>
        </GridItem>
        <GridItem colStart={2} colSpan={1} rowStart={4} rowSpan={1}>
          <List>
            {mobilityAids?.map(aid => (
              <ListItem key={aid}>
                <Text as="p" textStyle="body-regular">
                  {aid}
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
