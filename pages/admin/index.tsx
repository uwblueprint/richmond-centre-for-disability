import { GetServerSideProps, NextPage } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { useRouter } from 'next/router'; // Next Router
import Link from 'next/link';
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
  ApplicationRow,
  GetApplicationsRequest,
  GetApplicationsResponse,
  GET_APPLICATIONS_QUERY,
} from '@tools/admin/requests/requests-table';
import { SortOptions, SortOrder } from '@tools/types'; //Sorting types
import { ApplicationStatus, ApplicationType, PermitType } from '@lib/graphql/types'; //GraphQL types
import useDebounce from '@tools/hooks/useDebounce'; // Debounce hook
import { Column } from 'react-table';
import { formatDateVerbose, formatFullName } from '@lib/utils/format'; // Verbose date formatter util
import GenerateReportModal from '@components/admin/requests/reports/GenerateModal'; // Generate report modal
import EmptyStateComponent from '@components/EmptyMessage';

// Placeholder columns
const COLUMNS: Column<ApplicationRow>[] = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ value: { id, firstName, middleName, lastName } }) => {
      const name = formatFullName(firstName, middleName, lastName);
      return (
        <div>
          <Tooltip label={name} placement="top-start">
            <Text
              maxWidth="280"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              overflow="hidden"
              mb="4px"
            >
              {name}
            </Text>
          </Tooltip>
          <Text textStyle="caption" textColor="secondary">
            ID: {id ? `#${id}` : 'N/A'}
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
    Cell: ({ value }: { value: string }) => {
      return <Text textTransform="capitalize">{value.toLowerCase()}</Text>;
    },
  },
  {
    Header: 'Request Type',
    accessor: 'type',
    disableSortBy: true,
    maxWidth: 180,
    width: 180,
    Cell: ({ value }) => {
      return <Text textTransform="capitalize">{value.toLowerCase()}</Text>;
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

// Max number of entries in a page
const PAGE_SIZE = 20;

// Internal home page - view APP requests
const Requests: NextPage = () => {
  // Router
  const router = useRouter();

  //Generate report modal
  const {
    isOpen: isGenerateReportModalOpen,
    onOpen: onOpenGenerateReportModal,
    onClose: onCloseGenerateReportModal,
  } = useDisclosure();

  // Filters
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | null>(null);
  const [permitTypeFilter, setPermitTypeFilter] = useState<PermitType | null>(null);
  const [requestTypeFilter, setRequestTypeFilter] = useState<ApplicationType | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Sorting
  const [sortOrder, setSortOrder] = useState<SortOptions>([['dateReceived', SortOrder.DESC]]);

  // Debounce search filter so that it only gives us latest value if searchFilter has not been updated within last 500ms.
  // This will avoid firing a query for each key the user presses
  const debouncedSearchFilter = useDebounce<string>(searchFilter, 500);

  // Data & pagination
  const [requestsData, setRequestsData] = useState<Array<ApplicationRow>>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [recordsCount, setRecordsCount] = useState(0);

  // Make query to applications resolver
  const { refetch, loading } = useQuery<GetApplicationsResponse, GetApplicationsRequest>(
    GET_APPLICATIONS_QUERY,
    {
      variables: {
        filter: {
          order: sortOrder,
          permitType: permitTypeFilter || null,
          requestType: requestTypeFilter || null,
          status: statusFilter || null,
          search: debouncedSearchFilter,
          offset: pageNumber * PAGE_SIZE,
          limit: PAGE_SIZE,
        },
      },
      onCompleted: ({ applications: { result, totalCount } }) => {
        setRequestsData(
          result.map(
            ({
              id,
              firstName,
              middleName,
              lastName,
              createdAt,
              applicant,
              processing: { status },
              ...application
            }) => ({
              id,
              name: {
                id: applicant?.id || null,
                firstName,
                middleName,
                lastName,
              },
              dateReceived: createdAt,
              status,
              ...application,
            })
          )
        );
        setRecordsCount(totalCount);
      },
    }
  );

  // Set page number to 0 after every filter or sort change
  useEffect(() => {
    setPageNumber(0);
    refetch();
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
                <Link href="/admin/request/create-replacement">
                  <MenuItem>Replacement Request</MenuItem>
                </Link>
                <Link href="/admin/request/create-renewal">
                  <MenuItem>Renewal Request</MenuItem>
                </Link>
                <Link href="/admin/request/create-new">
                  <MenuItem>New APP Request</MenuItem>
                </Link>
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
                  setStatusFilter(null);
                }}
              >
                All
              </Tab>
              <Tab
                height="64px"
                onClick={() => {
                  setStatusFilter('PENDING');
                }}
              >
                Pending
              </Tab>
              <Tab
                height="64px"
                onClick={() => {
                  setStatusFilter('IN_PROGRESS');
                }}
              >
                In Progress
              </Tab>
              <Tab
                height="64px"
                onClick={() => {
                  setStatusFilter('COMPLETED');
                }}
              >
                Completed
              </Tab>
              <Tab
                height="64px"
                onClick={() => {
                  setStatusFilter('REJECTED');
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
                  <Text as="span" textStyle="button-regular" textTransform="capitalize">
                    {permitTypeFilter?.toLowerCase() || 'All'}
                  </Text>
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      setPermitTypeFilter(null);
                    }}
                  >
                    All
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setPermitTypeFilter('PERMANENT');
                    }}
                  >
                    Permanent
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setPermitTypeFilter('TEMPORARY');
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
                  <Text as="span" textStyle="button-regular" textTransform="capitalize">
                    {requestTypeFilter?.toLowerCase() || 'All'}
                  </Text>
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      setRequestTypeFilter(null);
                    }}
                  >
                    All
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setRequestTypeFilter('REPLACEMENT');
                    }}
                  >
                    Replacement
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setRequestTypeFilter('RENEWAL');
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
            {requestsData.length > 0 ? (
              <>
                <Table
                  columns={COLUMNS}
                  data={requestsData}
                  loading={loading}
                  onChangeSortOrder={setSortOrder}
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
              </>
            ) : (
              <EmptyStateComponent
                title="No Requests Found"
                message="Try changing the filter or search term"
              />
            )}
          </Box>
        </Box>
      </GridItem>
      <GenerateReportModal
        isOpen={isGenerateReportModalOpen}
        onClose={onCloseGenerateReportModal}
      />
    </Layout>
  );
};

export default Requests;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  // Only secretaries and admins can access APP requests
  if (authorize(session, ['SECRETARY'])) {
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
