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
      <Grid gap="24px">
        <GridItem colStart={1} colSpan={1} rowStart={1} rowSpan={1}>
          <Text as="p" textStyle="body-regular">
            Application package
          </Text>
        </GridItem>
        <GridItem colStart={2} colSpan={1} rowStart={1} rowSpan={1}>
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
        <GridItem colStart={1} colSpan={1} rowStart={2} rowSpan={1}>
          <Text as="p" textStyle="body-regular">
            Invoice report
          </Text>
        </GridItem>
        <GridItem colStart={2} colSpan={1} rowStart={2} rowSpan={1}>
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
