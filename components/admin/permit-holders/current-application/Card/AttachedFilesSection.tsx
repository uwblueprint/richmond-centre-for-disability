import { Grid, GridItem, Text, Link as FileLink } from '@chakra-ui/react';
import { getFileName } from '@lib/utils/s3-utils';
import { CurrentApplication } from '@tools/admin/permit-holders/current-application';
import { FC } from 'react';
import CurrentApplicationCardSection from './CardSection';

type Props = {
  readonly application: CurrentApplication;
};

const AttachedFilesSection: FC<Props> = ({ application }) => {
  const {
    processing: { documentsUrl, documentsS3ObjectKey, invoice, walletCard },
  } = application;

  return (
    <CurrentApplicationCardSection title="Attached Files">
      <Grid
        gridRowGap="12px"
        gridColumnGap="20px"
        templateColumns="200px 1fr"
        gridAutoRows="minmax(32px, auto)"
      >
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
            <FileLink href={documentsUrl} target="_blank" rel="noopener noreferrer">
              <Text as="p" textStyle="body-regular" color="primary" textDecoration="underline">
                {!!documentsS3ObjectKey && getFileName(documentsS3ObjectKey)}
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
            invoice.s3ObjectUrl && (
              <FileLink href={invoice.s3ObjectUrl} target="_blank" rel="noopener noreferrer">
                <Text as="p" textStyle="body-regular" color="primary" textDecoration="underline">
                  {!!invoice.s3ObjectKey && getFileName(invoice.s3ObjectKey)}
                </Text>
              </FileLink>
            )
          )}
        </GridItem>
        <GridItem>
          <Text as="p" textStyle="body-regular">
            Wallet Card
          </Text>
        </GridItem>
        <GridItem>
          {walletCard === null ? (
            <Text as="p" textStyle="body-regular" color="text.filler">
              Not generated yet
            </Text>
          ) : (
            walletCard.s3ObjectUrl && (
              <FileLink href={walletCard.s3ObjectUrl} target="_blank" rel="noopener noreferrer">
                <Text as="p" textStyle="body-regular" color="primary" textDecoration="underline">
                  {!!walletCard.s3ObjectKey && getFileName(walletCard.s3ObjectKey)}
                </Text>
              </FileLink>
            )
          )}
        </GridItem>
      </Grid>
    </CurrentApplicationCardSection>
  );
};

export default AttachedFilesSection;
