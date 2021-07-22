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
  InputGroup,
  Input,
  InputLeftElement,
} from '@chakra-ui/react'; // Chakra UI
import { AddIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import Layout from '@components/internal/Layout'; // Layout component
import { Role } from '@lib/types'; // Role enum
import { authorize } from '@tools/authorization'; // Page authorization
import Table from '@components/internal/Table'; // Table component

// Placeholder columns
// TODO: accessors should be the accessors for these fields in the DB
const COLUMNS = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Date Received',
    accessor: 'dateReceived',
  },
  {
    Header: 'Permit Type',
    accessor: 'permitType',
    disableSortBy: true,
  },
  {
    Header: 'Request Type',
    accessor: 'requestType',
    disableSortBy: true,
  },
  {
    Header: 'Status',
    accessor: 'status',
    disableSortBy: true,
  },
];

// Placeholder data
const DATA = [
  {
    name: 'Steve Rogers',
    dateReceived: 'Dec 21 2021, 8:30 pm',
    permitType: 'Permanent',
    requestType: 'Replacement',
    status: 'In progress',
  },
  {
    name: 'Steve Rogers',
    dateReceived: 'Dec 21 2021, 8:30 pm',
    permitType: 'Permanent',
    requestType: 'Replacement',
    status: 'In progress',
  },
  {
    name: 'Steve Rogers',
    dateReceived: 'Dec 21 2021, 8:30 pm',
    permitType: 'Permanent',
    requestType: 'Replacement',
    status: 'In progress',
  },
];

// Internal home page - view APP requests
export default function Requests() {
  return (
    <Layout>
      <GridItem colSpan={12} marginTop="64px">
        <Flex justifyContent="space-between" alignItems="center" marginBottom="32px">
          <Text textStyle="display-xlarge">Requests</Text>
          <Button leftIcon={<AddIcon />} height="48px" padding="24px">
            Create a request
          </Button>
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
                >
                  Permit type: Permanent
                </MenuButton>
              </Menu>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="outline"
                  rightIcon={<ChevronDownIcon />}
                  marginRight="12px"
                  color="text.secondary"
                  borderColor="border.secondary"
                >
                  Request type: Replacement
                </MenuButton>
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
