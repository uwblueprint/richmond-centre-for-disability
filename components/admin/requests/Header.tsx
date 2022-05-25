import { Box, Flex, HStack, Text, Link, VStack, Alert, AlertIcon } from '@chakra-ui/react'; // Chakra UI
import { ChevronLeftIcon } from '@chakra-ui/icons'; // Chakra UI icon
import NextLink from 'next/link'; // Link
import RequestStatusBadge from '@components/admin/RequestStatusBadge'; // Request status badge
import ShopifyBadge from '@components/admin/ShopifyBadge';
import PermitTypeBadge from '@components/admin/PermitTypeBadge';
import { ApplicationStatus, ApplicationType, PermitType } from '@lib/graphql/types';
import { titlecase } from '@tools/string';
import { formatDateYYYYMMDD } from '@lib/utils/date';

type RequestHeaderProps = {
  readonly applicationType: ApplicationType;
  readonly permitType: PermitType;
  readonly createdAt: Date;
  readonly applicationStatus?: ApplicationStatus;
  readonly paidThroughShopify?: boolean;
  readonly shopifyOrderID?: string;
  readonly shopifyOrderNumber?: string;
  readonly temporaryPermitExpiry: Date | null;
  readonly reasonForRejection?: string;
};

/**
 * Header of View Request page
 * @param applicationType Type of application
 * @param permitType Type of permit
 * @param createdAt Date permit was created at
 * @param applicationStatus Status of application
 * @param paidThroughShopify If the permit fee was paid through Shopify
 * @param shopifyOrderID Order ID of Shopify payment if paid through Shopify
 * @param shopifyOrderNumber Order number of Shopify payment if paid through Shopify
 * @param temporaryPermitExpiry Permit expiry if application is for a temporary permit
 * @param reasonForRejection Reason for rejecting application
 */
export default function RequestHeader({
  applicationType,
  permitType,
  createdAt,
  applicationStatus,
  paidThroughShopify,
  shopifyOrderID,
  shopifyOrderNumber,
  temporaryPermitExpiry,
  reasonForRejection,
}: RequestHeaderProps) {
  const displayShopifyUrl = paidThroughShopify && shopifyOrderID && shopifyOrderNumber;
  const shopifyOrderUrl = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/admin/orders/${shopifyOrderID}`;

  return (
    <Box textAlign="left">
      <NextLink href="/admin" passHref>
        <Text textStyle="button-semibold" textColor="primary" as="a">
          <ChevronLeftIcon />
          All requests
        </Text>
      </NextLink>
      <VStack alignItems="stretch">
        <Flex marginTop={5} alignItems="baseline" justifyContent="space-between">
          <Box>
            <Flex alignItems="center">
              <Text textStyle="display-large" as="h1" marginRight={3} textTransform="capitalize">
                {`${titlecase(applicationType)} Request`}
              </Text>
              <HStack spacing={3}>
                {applicationStatus && <RequestStatusBadge variant={applicationStatus} />}
                {paidThroughShopify && <ShopifyBadge />}
              </HStack>
            </Flex>
            <HStack spacing={3} marginTop={3}>
              <Text textStyle="caption" as="p">
                Received on {createdAt.toDateString()} at {createdAt.toLocaleTimeString('en-CA')}
              </Text>
            </HStack>
            {displayShopifyUrl && (
              <Text textStyle="caption" as="p">
                Paid with Shopify: Order{' '}
                <Link
                  href={shopifyOrderUrl}
                  isExternal={true}
                  textStyle="caption-bold"
                  textDecoration="underline"
                  color="primary"
                >
                  {`#${shopifyOrderNumber}`}
                </Link>
              </Text>
            )}
          </Box>
          <Box>
            <Flex alignItems="center">
              <Text textStyle="heading" as="h3" marginRight={3} textTransform="capitalize">
                Permit Type:
              </Text>
              <PermitTypeBadge variant={permitType} />
            </Flex>
            <HStack justifyContent="flex-end">
              {permitType === 'TEMPORARY' && !!temporaryPermitExpiry && (
                <Text textStyle="caption" as="p" mt="12px">
                  This permit will expire: {formatDateYYYYMMDD(temporaryPermitExpiry)}
                </Text>
              )}
            </HStack>
          </Box>
        </Flex>
        {applicationStatus === 'REJECTED' && (
          <Alert status="error">
            <AlertIcon />
            <Text as="p" textStyle="caption">
              <b>Reason for Rejection: </b>
              {reasonForRejection || ''}
            </Text>
          </Alert>
        )}
      </VStack>
    </Box>
  );
}
