import {
  Box,
  Flex,
  HStack,
  Text,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Button,
  Link,
} from '@chakra-ui/react'; // Chakra UI
import { ChevronLeftIcon, ChevronDownIcon } from '@chakra-ui/icons'; // Chakra UI icon
import NextLink from 'next/link'; // Link
import RequestStatusBadge from '@components/admin/RequestStatusBadge'; // Request status badge
import ApproveRequestModal from '@components/admin/requests/processing/ApproveRequestModal'; // Approve button + modal
import RejectRequestModal from '@components/admin/requests/processing/RejectRequestModal'; // Reject button + modal
import ShopifyBadge from '@components/admin/ShopifyBadge';
import { ApplicationStatus, ApplicationType } from '@lib/graphql/types';
import ProcessingTasksFooter from './processing/ProcessingFooter';

type RequestHeaderProps = {
  readonly applicationId: number;
  readonly applicationStatus?: ApplicationStatus;
  readonly applicationType: ApplicationType;
  readonly createdAt: Date;
  readonly allStepsCompleted: boolean;
  readonly applicantId?: number;
  readonly paidThroughShopify?: boolean;
  readonly shopifyOrderID?: string;
  readonly shopifyOrderNumber?: string;
};

/**
 * Header of View Request page
 * @param applicationStatus Status of application
 * @param createdAt Date of application creation
 * @param allStepsCompleted Whether all processing tasks are complete
 */
export default function RequestHeader({
  applicationId,
  applicationStatus,
  createdAt,
  allStepsCompleted,
  applicationType,
  applicantId,
  paidThroughShopify,
  shopifyOrderID,
  shopifyOrderNumber,
}: RequestHeaderProps) {
  /**
   * Returns the appropriate header button(s) to be displayed depending on the current application status
   * @returns Rendered button component(s) or null.
   */
  const _renderActionButtons = () => {
    switch (applicationStatus) {
      case 'PENDING':
        return (
          <HStack spacing={3}>
            <RejectRequestModal applicationId={applicationId}>
              <Button bg="secondary.critical" _hover={{ bg: 'secondary.criticalHover' }}>
                Reject
              </Button>
            </RejectRequestModal>
            <ApproveRequestModal applicationId={applicationId}>
              <Button>Approve</Button>
            </ApproveRequestModal>
          </HStack>
        );
      case 'IN_PROGRESS':
        return (
          <ProcessingTasksFooter
            applicationId={applicationId}
            applicantId={applicantId}
            allStepsCompleted={allStepsCompleted}
          />
        );
      default:
        return null;
    }
  };

  /**
   * Returns the appropriate 'More Actions' dropdown to be displayed depending on the current application status
   * @returns Rendered 'More Actions' dropdown component or null
   */
  const _renderMoreActionsDropdown = () => {
    if (applicationStatus === 'IN_PROGRESS') {
      return (
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
            {applicationStatus === 'IN_PROGRESS' ? (
              <RejectRequestModal applicationId={applicationId}>
                <MenuItem>Reject request</MenuItem>
              </RejectRequestModal>
            ) : (
              <ApproveRequestModal applicationId={applicationId}>
                <MenuItem>Approve request</MenuItem>
              </ApproveRequestModal>
            )}
          </MenuList>
        </Menu>
      );
    }
    return null;
  };

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
      <Flex marginTop={5} alignItems="center">
        <Box>
          <Flex alignItems="center">
            <Text textStyle="display-large" as="h1" marginRight={3} textTransform="capitalize">
              {`${applicationType.toLowerCase()} Request`}
            </Text>
            <HStack spacing={3}>
              {applicationStatus && <RequestStatusBadge variant={applicationStatus} />}
              {paidThroughShopify && <ShopifyBadge />}
            </HStack>
          </Flex>
          <HStack spacing={3} marginTop={3}>
            <Text textStyle="caption" as="p">
              Received date: {createdAt.toDateString()}
            </Text>
            {_renderMoreActionsDropdown()}
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
        <Box marginLeft="auto">{_renderActionButtons()}</Box>
      </Flex>
    </Box>
  );
}
