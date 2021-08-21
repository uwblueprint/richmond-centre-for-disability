import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
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
} from '@chakra-ui/react'; // Chakra UI
import { ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import Layout from '@components/internal/Layout'; // Layout component
import { authorize } from '@tools/authorization'; // Page authorization
import Table from '@components/internal/Table'; // Table component
import Pagination from '@components/internal/Pagination'; // Pagination component
import RequestStatusBadge from '@components/internal/RequestStatusBadge'; //Status badge component
import { NetworkStatus, useQuery } from '@apollo/client'; //Apollo client
import { useEffect, useState } from 'react'; // React
import { FilterRequest, FilterResponse, FILTER_APPLICATIONS_QUERY } from '@tools/pages/admin'; //Applications queries
import { SortOptions, SortOrder } from '@tools/types'; //Sorting types
import { ApplicationStatus, PermitType, Role } from '@lib/graphql/types'; //GraphQL types
import useDebounce from '@tools/hooks/useDebounce';

type StatusProps = {
  readonly value:
    | 'COMPLETED'
    | 'INPROGRESS'
    | 'PENDING'
    | 'REJECTED'
    | 'EXPIRING'
    | 'EXPIRED'
    | 'ACTIVE';
};

function renderStatusBadge({ value }: StatusProps) {
  return (
    <Wrap>
      <RequestStatusBadge variant={value}></RequestStatusBadge>
    </Wrap>
  );
}

type NameProps = {
  readonly value: {
    name: string;
    rcdUserId: string;
  };
};

function renderName({ value }: NameProps) {
  return (
    <div>
      <Text>{value.name}</Text>
      {value.rcdUserId && (
        <Text textStyle="caption" textColor="secondary">
          ID: {value.rcdUserId}
        </Text>
      )}
    </div>
  );
}

// Placeholder columns
const COLUMNS = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: renderName,
    minWidth: 240,
    width: 280,
  },
  {
    Header: 'Date Received',
    accessor: 'dateReceived',
    maxWidth: 240,
    width: 240,
    sortDescFirst: true,
    Cell: ({ value }: any) => {
      return <Text>{new Date(value).toLocaleDateString('en-ZA')}</Text>;
    },
  },
  {
    Header: 'Permit Type',
    accessor: 'permitType',
    disableSortBy: true,
    maxWidth: 180,
    width: 180,
  },
  {
    Header: 'Request Type',
    accessor: 'requestType',
    disableSortBy: true,
    maxWidth: 180,
    width: 180,
  },
  {
    Header: 'Status',
    accessor: 'status',
    disableSortBy: true,
    Cell: renderStatusBadge,
    maxWidth: 180,
    width: 100,
  },
];

// Application data for table
type ApplicationData = {
  name: {
    name: string;
    rcdUserId: number | undefined;
  };
  dateReceived: Date;
  permitType: string;
  requestType: string;
  status: ApplicationStatus | undefined;
};

// Max number of entries in a page
const PAGE_SIZE = 20;

// Internal home page - view APP requests
export default function Requests() {
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
  const { loading, networkStatus } = useQuery<FilterResponse, FilterRequest>(
    FILTER_APPLICATIONS_QUERY,
    {
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
      notifyOnNetworkStatusChange: true,
      onCompleted: data => {
        setRequestsData(
          data.applications.result.map(record => ({
            name: {
              name: record.firstName + ' ' + record.lastName,
              rcdUserId: record.applicantId || undefined,
            },
            dateReceived: record.createdAt,
            permitType: permitTypeString[record.permitType],
            requestType: record.isRenewal ? 'Renewal' : 'Replacement',
            status: record.applicationProcessing?.status || undefined,
          }))
        );
        setRecordsCount(data.applications.totalCount);
      },
    }
  );

  // Map uppercase enum strings to lowercase
  const permitTypeString: Record<PermitType, string> = {
    [PermitType.Permanent]: 'Permanent',
    [PermitType.Temporary]: 'Temporary',
  };

  // Set page number to 0 after every filter or sort change
  useEffect(() => {
    setPageNumber(0);
  }, [statusFilter, permitTypeFilter, requestTypeFilter, debouncedSearchFilter, sortOrder]);

  return (
    <Layout>
      <GridItem colSpan={12}>
        <Flex justifyContent="space-between" alignItems="center" marginBottom="32px">
          <Text textStyle="display-xlarge">Requests</Text>
          {/* TODO: 'Create a new request' function is out of scope for this term's MVP
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
              <MenuItem>Replacement Request</MenuItem>
              <MenuItem>Renewal Request</MenuItem>
            </MenuList>
          </Menu> */}
        </Flex>
        <Box border="1px solid" borderColor="border.secondary" borderRadius="12px">
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
                  setStatusFilter(ApplicationStatus.Inprogress);
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
            {!loading && networkStatus !== NetworkStatus.refetch && (
              <Table
                columns={COLUMNS}
                data={requestsData || []}
                onChangeSortOrder={sortOrder => setSortOrder(sortOrder)}
              />
            )}
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
