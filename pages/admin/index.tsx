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
  useControllableState,
  Wrap,
} from '@chakra-ui/react'; // Chakra UI
import { ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import Layout from '@components/internal/Layout'; // Layout component
import { Role } from '@lib/types'; // Role enum
import { authorize } from '@tools/authorization'; // Page authorization
import Table from '@components/internal/Table'; // Table component
import Pagination from '@components/internal/Pagination'; // Pagination component
import RequestStatusBadge from '@components/internal/RequestStatusBadge'; //Status badge component

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
    id: string;
  };
};

function renderName({ value }: NameProps) {
  return (
    <div>
      <Text>{value.name}</Text>
      <Text textStyle="caption" textColor="secondary">
        ID: {value.id}
      </Text>
    </div>
  );
}

// Placeholder columns
// TODO: accessors should be the accessors for these fields in the DB
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

// Placeholder data
const DATA = [
  {
    name: {
      name: 'Steve Rogers',
      id: '36565',
    },
    dateReceived: 'Dec 21 2021, 8:30 pm',
    permitType: 'Permanent',
    requestType: 'Replacement',
    status: 'PENDING',
  },
  {
    name: {
      name: 'Steve Rogers',
      id: '36565',
    },
    dateReceived: 'Dec 21 2021, 8:30 pm',
    permitType: 'Permanent',
    requestType: 'Replacement',
    status: 'INPROGRESS',
  },
  {
    name: {
      name: 'Steve Rogers',
      id: '36565',
    },
    dateReceived: 'Dec 21 2021, 8:30 pm',
    permitType: 'Permanent',
    requestType: 'Replacement',
    status: 'COMPLETED',
  },
];

// Internal home page - view APP requests
export default function Requests() {
  const [permitTypeFilter, setPermitTypeFilter] = useControllableState({ defaultValue: 'All' });
  const [requestTypeFilter, setRequestTypeFilter] = useControllableState({ defaultValue: 'All' });

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
              <Tab height="64px">All</Tab>
              <Tab height="64px">Pending</Tab>
              <Tab height="64px">In Progress</Tab>
              <Tab height="64px">Completed</Tab>
              <Tab height="64px">Rejected</Tab>
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
                    {permitTypeFilter}
                  </Text>
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      setPermitTypeFilter('All');
                    }}
                  >
                    All
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setPermitTypeFilter('Permanent');
                    }}
                  >
                    Permanent
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setPermitTypeFilter('Temporary');
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
                    {requestTypeFilter}
                  </Text>
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      setRequestTypeFilter('All');
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
                  <Input placeholder="Search by first name, last name or user ID" />
                </InputGroup>
              </Box>
            </Flex>
            <Table columns={COLUMNS} data={DATA} />
            <Flex justifyContent="flex-end">
              <Pagination /* eslint-disable @typescript-eslint/no-empty-function */
                pageNumber={0}
                onPageChange={() => {}}
                pageSize={20}
                totalCount={150}
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
