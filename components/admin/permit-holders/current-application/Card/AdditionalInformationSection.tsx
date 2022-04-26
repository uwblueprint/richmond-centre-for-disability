import { Grid, GridItem, Text } from '@chakra-ui/react';
import { GetCurrentApplicationResponse } from '@tools/admin/permit-holders/current-application';
import { titlecase } from '@tools/string';
import { FC } from 'react';
import CurrentApplicationCardSection from './CardSection';

type Props = {
  readonly application: Required<GetCurrentApplicationResponse['application']>;
};

const AdditionalInformationSection: FC<Props> = ({ application }) => {
  const {
    type,
    usesAccessibleConvertedVan,
    accessibleConvertedVanLoadingMethod,
    requiresWiderParkingSpace,
    requiresWiderParkingSpaceReason,
    otherRequiresWiderParkingSpaceReason,
  } = application;

  if (type !== 'NEW' && type !== 'RENEWAL') {
    return null;
  }

  const usesAccessibleConvertedVanString = usesAccessibleConvertedVan ? 'Yes' : 'No';
  const requiresWiderParkingSpaceString = requiresWiderParkingSpace ? 'Yes' : 'No';

  return (
    <CurrentApplicationCardSection title="Additional Information">
      <Grid gridRowGap="12px" gridColumnGap="20px" templateColumns="200px 1fr" gridAutoRows="32px">
        {/* Whether applicant uses converted van */}
        <GridItem>
          <Text as="p" textStyle="body-regular">
            Converted van
          </Text>
        </GridItem>
        <GridItem>
          <Text as="p" textStyle="body-regular">
            {usesAccessibleConvertedVanString}
          </Text>
        </GridItem>
        {usesAccessibleConvertedVan && (
          <>
            {/* Accessible van loading method */}
            <GridItem>
              <Text as="p" textStyle="body-regular">
                Loading method
              </Text>
            </GridItem>
            <GridItem>
              <Text as="p" textStyle="body-regular">
                {!!accessibleConvertedVanLoadingMethod &&
                  titlecase(accessibleConvertedVanLoadingMethod)}
              </Text>
            </GridItem>
          </>
        )}

        {/* Whether applicant requires wider parking */}
        <GridItem>
          <Text as="p" textStyle="body-regular">
            Wider parking
          </Text>
        </GridItem>
        <GridItem>
          <Text as="p" textStyle="body-regular">
            {requiresWiderParkingSpaceString}
          </Text>
        </GridItem>
        {requiresWiderParkingSpace && (
          <>
            {/* Reason for requiring wider parking space */}
            <GridItem>
              <Text as="p" textStyle="body-regular">
                Reason
              </Text>
            </GridItem>
            <GridItem>
              <Text as="p" textStyle="body-regular">
                {requiresWiderParkingSpaceReason === 'OTHER'
                  ? otherRequiresWiderParkingSpaceReason
                  : !!requiresWiderParkingSpaceReason && titlecase(requiresWiderParkingSpaceReason)}
              </Text>
            </GridItem>
          </>
        )}
      </Grid>
    </CurrentApplicationCardSection>
  );
};

export default AdditionalInformationSection;
