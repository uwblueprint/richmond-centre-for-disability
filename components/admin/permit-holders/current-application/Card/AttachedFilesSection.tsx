import { Grid, GridItem, Text, Link as FileLink } from '@chakra-ui/react';
import { GetCurrentApplicationResponse } from '@tools/admin/permit-holders/current-application';
import { FC } from 'react';
import CurrentApplicationCardSection from './CardSection';

type Props = {
  readonly application: GetCurrentApplicationResponse['application'];
};

const AttachedFilesSection: FC<Props> = ({ application }) => {
  const {
    processing: { documentsUrl, invoice },
  } = application;

  return (
    <CurrentApplicationCardSection title="Attached Files">
      <Grid gridRowGap="12px" gridColumnGap="20px" templateColumns="200px 1fr" gridAutoRows="32px">
        <GridItem>
          <Text as="p" textStyle="body-regular">
            Application package
          </Text>
        </GridItem>
        <GridItem>
          {documentsUrl === null ? (
            <Text as="p" textStyle="body-regular" color="text.filler">
              Not uploaded or file pending upload
            </Text>
          ) : (
            <FileLink>
              <Text as="p" textStyle="body-regular">
                {documentsUrl}
              </Text>
            </FileLink>
          )}
        </GridItem>
        <GridItem>
          <Text as="p" textStyle="body-regular">
            Invoice report
          </Text>
        </GridItem>
        <GridItem>
          {invoice === null ? (
            <Text as="p" textStyle="body-regular" color="text.filler">
              Not generated yet
            </Text>
          ) : (
            <FileLink>
              <Text as="p" textStyle="body-regular">
                {invoice.s3ObjectUrl}
              </Text>
            </FileLink>
          )}
        </GridItem>
      </Grid>
    </CurrentApplicationCardSection>
  );
};

export default AttachedFilesSection;
