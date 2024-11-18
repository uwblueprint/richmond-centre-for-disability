import { useRouter } from 'next/router';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'; // Chakra UI
import { ChevronDownIcon, ChevronLeftIcon } from '@chakra-ui/icons'; // Chakra UI icon
import NextLink from 'next/link'; // Link
import RequestStatusBadge from '@components/admin/RequestStatusBadge'; // Request status badge
import ShopifyBadge from '@components/admin/ShopifyBadge';
import PermitTypeBadge from '@components/admin/PermitTypeBadge';
import ConfirmDeleteRequestModal from './delete/ConfirmDeleteRequestModal';
import { ApplicationStatus, ApplicationType, PermitType } from '@lib/graphql/types';
import { titlecase } from '@tools/string';
import { formatDateYYYYMMDD, formatDateYYYYMMDDLocal } from '@lib/utils/date';
import { getPermanentPermitExpiryDate } from '@lib/utils/permit-expiry';
import { useEffect, useState } from 'react'; // React

type RequestHeaderProps = {
  readonly id: number;
  readonly applicationType: ApplicationType;
  readonly permitType: PermitType;
  readonly createdAt: Date;
  readonly applicationStatus?: ApplicationStatus;
  readonly paidThroughShopify?: boolean;
  readonly shopifyOrderID?: string;
  readonly shopifyOrderNumber?: string;
  readonly permitExpiry: Date | null;
  readonly temporaryPermitExpiry: Date | null;
  readonly reasonForRejection?: string;
};

/**
 * Header of View Request page
 * @param id Application id
 * @param applicationType Type of application
 * @param permitType Type of permit
 * @param createdAt Date permit was created at
 * @param applicationStatus Status of application
 * @param paidThroughShopify If the permit fee was paid through Shopify
 * @param shopifyOrderID Order ID of Shopify payment if paid through Shopify
 * @param shopifyOrderNumber Order number of Shopify payment if paid through Shopify
 * @param permitExpiry Permit expiry if application is complete
 * @param temporaryPermitExpiry Permit expiry if application is for a temporary permit
 * @param reasonForRejection Reason for rejecting application
 */
export default function RequestHeader({
  id,
  applicationType,
  permitType,
  createdAt,
  applicationStatus,
  paidThroughShopify,
  shopifyOrderID,
  shopifyOrderNumber,
  permitExpiry,
  temporaryPermitExpiry,
  reasonForRejection,
}: RequestHeaderProps) {
  const displayShopifyUrl = paidThroughShopify && shopifyOrderID && shopifyOrderNumber;
  const shopifyOrderUrl = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/admin/orders/${shopifyOrderID}`;

  let expiryDateText: string | null;
  if (applicationStatus === 'COMPLETED' && !!permitExpiry) {
    expiryDateText = `Expiry date: ${formatDateYYYYMMDD(permitExpiry)}`;
  } else if (permitType === 'TEMPORARY' && !!temporaryPermitExpiry) {
    expiryDateText = `This permit will expire: ${formatDateYYYYMMDD(temporaryPermitExpiry)}`;
  } else if (applicationType === 'REPLACEMENT' && !!permitExpiry) {
    expiryDateText = `This permit will expire: ${formatDateYYYYMMDD(permitExpiry)}`;
  } else if (permitType === 'PERMANENT') {
    expiryDateText = `This permit will expire: ${formatDateYYYYMMDD(
      getPermanentPermitExpiryDate()
    )} (expected)`;
  } else {
    expiryDateText = null;
  }

  const router = useRouter();

  const [backLink, setBackLink] = useState('/admin');
  const generateBackLink = () => {
    let status;
    const routerQuery = router.query;
    if (routerQuery === undefined || routerQuery.origin === undefined) {
      status = applicationStatus;
    } else {
      status = routerQuery.origin;
    }
    setBackLink(`/admin?tab=${status}`);
  };

  useEffect(() => {
    generateBackLink();
  }, []);

  // Delete application modal state
  const {
    isOpen: isDeleteApplicationModalOpen,
    onOpen: onOpenDeleteApplicationModal,
    onClose: onCloseDeleteApplicationModal,
  } = useDisclosure();

  return (
    <Box textAlign="left">
      <NextLink href={backLink} passHref>
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
                Received on {formatDateYYYYMMDDLocal(createdAt)} at{' '}
                {createdAt.toLocaleTimeString('en-CA')}
              </Text>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  height="30px"
                  bg="background.gray"
                  _hover={{ bg: 'background.grayHover' }}
                  color="black"
                >
                  <Text textStyle="caption">More Actions</Text>
                </MenuButton>
                <MenuList>
                  <MenuItem
                    color="text.critical"
                    textStyle="button-regular"
                    onClick={onOpenDeleteApplicationModal}
                  >
                    {'Delete Request'}
                  </MenuItem>
                </MenuList>
              </Menu>
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
          <VStack alignItems="flex-end" spacing="0">
            <Flex alignItems="center">
              <Text textStyle="heading" as="h3" marginRight={3} textTransform="capitalize">
                Permit Type:
              </Text>
              <PermitTypeBadge variant={permitType} />
            </Flex>
            <HStack justifyContent="flex-end">
              <Text textStyle="caption" as="p" mt="12px">
                {expiryDateText}
              </Text>
            </HStack>
          </VStack>
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
        <ConfirmDeleteRequestModal
          isOpen={isDeleteApplicationModalOpen}
          applicationId={id}
          refetch={() => {
            /* Do not refetch, redirect to main page */
          }}
          onClose={() => {
            onCloseDeleteApplicationModal();
            router.push('/admin');
          }}
        />
      </VStack>
    </Box>
  );
}
