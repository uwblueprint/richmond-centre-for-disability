import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { useRouter } from 'next/router'; // Next Router
import {
  Box,
  Flex,
  Text,
  GridItem,
  Button,
  Tabs,
  TabList,
  Tab,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  Input,
  InputLeftElement,
  Wrap,
  Tooltip,
  HStack,
  useDisclosure,
} from '@chakra-ui/react'; // Chakra UI
import { ChevronDownIcon, SearchIcon, AddIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import Layout from '@components/admin/Layout'; // Layout component
import { authorize } from '@tools/authorization'; // Page authorization
import Table from '@components/Table'; // Table component
import Pagination from '@components/Pagination'; // Pagination component
import RequestStatusBadge from '@components/admin/RequestStatusBadge'; //Status badge component
import { useQuery } from '@apollo/client'; //Apollo client
import { useEffect, useState } from 'react'; // React
import {
  GetApplicationsRequest,
  GetApplicationsResponse,
  GET_APPLICATIONS_QUERY,
} from '@tools/pages/admin'; //Applications queries
import { SortOptions, SortOrder } from '@tools/types'; //Sorting types
import { ApplicationStatus, PermitType, Role } from '@lib/graphql/types'; //GraphQL types
import useDebounce from '@tools/hooks/useDebounce'; // Debounce hook
import { Column } from 'react-table';
import { formatDateVerbose } from '@lib/utils/format'; // Verbose date formatter util
import GenerateReportModal from '@components/admin/reports/GenerateReportModal'; // Generate report modal
// Map uppercase enum strings to lowercase
const permitTypeString: Record<string, string> = {
  [PermitType.Permanent]: 'Permanent',
  [PermitType.Temporary]: 'Temporary',
};

// Placeholder columns
const COLUMNS: Column<any>[] = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ value }) => {
      const name = `${value.firstName} ${value.lastName}`;
      return (
        <div>
          <Tooltip label={name} placement="top-start">
            <Text maxWidth="280" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
              {name}
            </Text>
          </Tooltip>
          <Text textStyle="caption" textColor="secondary">
            ID: {value.rcdUserId ? `#${value.rcdUserId}` : 'N/A'}
          </Text>
        </div>
      );
    },
    minWidth: 240,
    width: 280,
  },
  {
    Header: 'Date Received',
    accessor: 'dateReceived',
    maxWidth: 240,
    width: 240,
    sortDescFirst: true,
    Cell: ({ value }) => {
      return <Text>{formatDateVerbose(value)}</Text>;
    },
  },
  {
    Header: 'Permit Type',
    accessor: 'permitType',
    disableSortBy: true,
    maxWidth: 180,
    width: 180,
    Cell: ({ value }) => {
      return <Text>{permitTypeString[value]}</Text>;
    },
  },
  {
    Header: 'Request Type',
    accessor: 'isRenewal',
    disableSortBy: true,
    maxWidth: 180,
    width: 180,
    Cell: ({ value }) => {
      return <Text>{value ? 'Renewal' : 'Replacement'}</Text>;
    },
  },
  {
    Header: 'Status',
    accessor: 'status',
    disableSortBy: true,
    Cell: ({ value }) => {
      return (
        <Wrap>
          <RequestStatusBadge variant={value}></RequestStatusBadge>
        </Wrap>
      );
    },
    maxWidth: 180,
    width: 100,
  },
];

// Application data for table
type ApplicationData = {
  name: {
    firstName: string;
    lastName: string;
    rcdUserId?: number;
  };
  dateReceived: Date;
  permitType: PermitType;
  isRenewal: boolean;
  status?: ApplicationStatus;
};

// Max number of entries in a page
const PAGE_SIZE = 20;

// Internal home page - view APP requests
export default function Requests() {
  // Router
  const router = useRouter();

  //Generate report modal
  const {
    isOpen: isGenerateReportModalOpen,
    onOpen: onOpenGenerateReportModal,
    onClose: onCloseGenerateReportModal,
  } = useDisclosure();

  //Filters
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus>();
  const [permitTypeFilter, setPermitTypeFilter] = useState<PermitType>();
  const [requestTypeFilter, setRequestTypeFilter] = useState<string>();
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Sorting
  const [sortOrder, setSortOrder] = useState<SortOptions>([['dateReceived', SortOrder.DESC]]);

  // Debounce search filter so that it only gives us latest value if searchFilter has not been updated within last 500ms.
  // This will avoid firing a query for each key the user presses
  const debouncedSearchFilter = useDebounce<string>(searchFilter, 500);

  // Data & pagination
  const [requestsData, setRequestsData] = useState<ApplicationData[]>();
  const [pageNumber, setPageNumber] = useState(0);
  const [recordsCount, setRecordsCount] = useState(0);

  // Make query to applications resolver
  useQuery<GetApplicationsResponse, GetApplicationsRequest>(GET_APPLICATIONS_QUERY, {
    variables: {
      filter: {
        order: sortOrder,
        permitType: permitTypeFilter,
        requestType: requestTypeFilter,
        status: statusFilter,
        search: debouncedSearchFilter,
        offset: pageNumber * PAGE_SIZE,
        limit: PAGE_SIZE,
      },
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onCompleted: data => {
      setRequestsData(
        data.applications?.result.map(record => ({
          id: record.id,
          name: {
            firstName: record.firstName,
            lastName: record.lastName,
            rcdUserId: record.rcdUserId || undefined,
          },
          dateReceived: record.createdAt,
          permitType: record.permitType,
          isRenewal: record.isRenewal,
          status: record.applicationProcessing?.status,
        }))
      );
      setRecordsCount(data.applications.totalCount);
    },
  });

  // Set page number to 0 after every filter or sort change
  useEffect(() => {
    setPageNumber(0);
  }, [statusFilter, permitTypeFilter, requestTypeFilter, debouncedSearchFilter, sortOrder]);

  return (
    <Layout>
      <GridItem colSpan={12}>
        <Flex justifyContent="space-between" alignItems="center" marginBottom="32px">
          <Text textStyle="display-xlarge">Requests</Text>
          <HStack spacing="12px">
            <Button height="48px" variant="outline" onClick={onOpenGenerateReportModal}>
              Generate a Report
            </Button>
            <Menu>
              <MenuButton
                as={Button}
                leftIcon={<AddIcon width="14px" height="14px" />}
                height="48px"
                pl="24px"
                pr="24px"
              >
                Create a request
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => router.push('/admin/request/create-replacement')}>
                  Replacement Request
                </MenuItem>
                <MenuItem onClick={() => router.push('/admin/request/create-renewal')}>
                  Renewal Request
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
        <Box border="1px solid" borderColor="border.secondary" borderRadius="12px" bgColor="white">
          <Tabs marginBottom="20px">
            <TabList paddingX="24px">
              <Tab
                height="64px"
                onClick={() => {
                  setStatusFilter(undefined);
                }}
              >
                All
              </Tab>
              <Tab
                height="64px"
                onClick={() => {
                  setStatusFilter(ApplicationStatus.Pending);
                }}
              >
                Pending
              </Tab>
              <Tab
                height="64px"
                onClick={() => {
                  setStatusFilter(ApplicationStatus.Approved);
                }}
              >
                In Progress
              </Tab>
              <Tab
                height="64px"
                onClick={() => {
                  setStatusFilter(ApplicationStatus.Completed);
                }}
              >
                Completed
              </Tab>
              <Tab
                height="64px"
                onClick={() => {
                  setStatusFilter(ApplicationStatus.Rejected);
                }}
              >
                Rejected
              </Tab>
            </TabList>
          </Tabs>
          <Box padding="0 24px">
            <Flex marginBottom="20px">
              <Menu>
                <MenuButton
                  as={Button}
                  variant="outline"
                  rightIcon={<ChevronDownIcon />}
                  marginRight="12px"
                  color="text.secondary"
                  borderColor="border.secondary"
                  width="275px"
                  textAlign="left"
                >
                  <Text as="span" textStyle="button-semibold">
                    Permit type:{' '}
                  </Text>
                  <Text as="span" textStyle="button-regular">
                    {permitTypeFilter ? permitTypeString[permitTypeFilter] : 'All'}
                  </Text>
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      setPermitTypeFilter(undefined);
                    }}
                  >
                    All
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setPermitTypeFilter(PermitType.Permanent);
                    }}
                  >
                    Permanent
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setPermitTypeFilter(PermitType.Temporary);
                    }}
                  >
                    Temporary
                  </MenuItem>
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="outline"
                  rightIcon={<ChevronDownIcon />}
                  marginRight="12px"
                  color="text.secondary"
                  borderColor="border.secondary"
                  width="300px"
                  textAlign="left"
                >
                  <Text as="span" textStyle="button-semibold">
                    Request type:{' '}
                  </Text>
                  <Text as="span" textStyle="button-regular">
                    {requestTypeFilter || 'All'}
                  </Text>
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      setRequestTypeFilter(undefined);
                    }}
                  >
                    All
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setRequestTypeFilter('Replacement');
                    }}
                  >
                    Replacement
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setRequestTypeFilter('Renewal');
                    }}
                  >
                    Renewal
                  </MenuItem>
                </MenuList>
              </Menu>
              <Box flexGrow={1}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="text.filler" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search by name or user ID"
                    onChange={event => setSearchFilter(event.target.value)}
                  />
                </InputGroup>
              </Box>
            </Flex>
            <Table
              columns={COLUMNS}
              data={requestsData || []}
              onChangeSortOrder={sortOrder => setSortOrder(sortOrder)}
              onRowClick={({ id }) => router.push(`/admin/request/${id}`)}
            />
            <Flex justifyContent="flex-end">
              <Pagination
                pageNumber={pageNumber}
                pageSize={PAGE_SIZE}
                totalCount={recordsCount}
                onPageChange={setPageNumber}
              />
            </Flex>
          </Box>
        </Box>
      </GridItem>
      <GenerateReportModal
        isOpen={isGenerateReportModalOpen}
        onClose={onCloseGenerateReportModal}
        page="requests"
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  // Only secretaries and admins can access APP requests
  if (authorize(session, [Role.Secretary])) {
    return {
      props: {},
    };
  }

  // Redirect to login if roles requirement not satisfied
  return {
    redirect: {
      destination: '/admin/login',
      permanent: false,
    },
  };
};
