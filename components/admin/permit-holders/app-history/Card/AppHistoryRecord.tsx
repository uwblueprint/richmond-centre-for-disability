import { Button, Grid, GridItem, HStack, Text, VStack, Link as FileLink } from '@chakra-ui/react';
import PermitTypeBadge from '@components/admin/PermitTypeBadge';
import { formatDate } from '@lib/utils/format';
import { PermitRecord } from '@tools/admin/permit-holders/app-history';
import { titlecase } from '@tools/string';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  permit: PermitRecord;
};

/** Permit record in APP history */
const AppHistoryRecord: FC<Props> = ({ permit }) => {
  const {
    rcdPermitId,
    expiryDate,
    application: {
      id: applicationId,
      type,
      permitType,
      processing: { documentsUrl, invoice },
    },
  } = permit;

  return (
    <VStack alignItems="stretch" spacing="16px">
      {/* Header section */}
      <HStack justify="space-between" alignItems="center">
        <VStack alignItems="flex-start" spacing="8px">
          <HStack spacing="8px">
            <Text as="h3" textStyle="heading">
              Permit {rcdPermitId}
            </Text>
            <PermitTypeBadge variant={permitType || 'PERMANENT'} />
          </HStack>
          <HStack spacing="20px">
            <Text as="p" textStyle="body-regular">
              Request Type: {titlecase(type)}
            </Text>
            <Text as="p" textStyle="body-regular">
              Expired on: {formatDate(expiryDate)}
            </Text>
          </HStack>
        </VStack>
        <Link href={`/admin/request/${applicationId}`}>
          <a target="_blank" rel="noopener noreferrer">
            <Button w="228px" variant="link">
              Go to request page
            </Button>
          </a>
        </Link>
      </HStack>

      {/* Attachments */}
      <VStack
        align="flex-start"
        px="24px"
        py="16px"
        spacing="12px"
        border="1px solid"
        borderColor="border.secondary"
        borderStyle="dashed"
        borderRadius="4px"
      >
        <Grid gridColumnGap="20px" gridTemplateColumns="200px 1fr" gridAutoRows="28px">
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
      </VStack>
    </VStack>
  );
};

export default AppHistoryRecord;
