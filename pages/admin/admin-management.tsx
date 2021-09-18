import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import Layout from '@components/internal/Layout'; // Layout component
import { authorize } from '@tools/authorization'; // Page authorization
import Table from '@components/internal/Table'; // Table component

import {
  Flex,
  Text,
  GridItem,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react'; // Chakra UI
// Internal home page

const COLUMNS = [
  {
    Header: 'Name',
    accessor: 'name',
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
    maxWidth: 180,
    width: 100,
  },
];

// Placeholder data
const DATA = [
  {
    name: 'Steve Rogers',
    dateReceived: 'Dec 21 2021, 8:30 pm',
    permitType: 'Permanent',
    requestType: 'Replacement',
    status: 'PENDING',
  },
  {
    name: 'Steve Rogers',
    dateReceived: 'Dec 21 2021, 8:30 pm',
    permitType: 'Permanent',
    requestType: 'Replacement',
    status: 'INPROGRESS',
  },
  {
    name: 'Steve Rogers',
    dateReceived: 'Dec 21 2021, 8:30 pm',
    permitType: 'Permanent',
    requestType: 'Replacement',
    status: 'COMPLETED',
  },
];

export default function AdminManagement() {
  return (
    <Layout>
      <GridItem colSpan={12}>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<img src="/assets/three-dots.svg" />}
            variant="outline"
            border="none"
          />
          <MenuList>
            <MenuItem>New Tab</MenuItem>
            <MenuItem>New Window</MenuItem>
            <MenuItem>Open Closed Tab</MenuItem>
            <MenuItem>Open File...</MenuItem>
          </MenuList>
        </Menu>
        <Flex justifyContent="space-between" alignItems="center" marginBottom="32px">
          <Text textStyle="display-xlarge">Admin Management</Text>
        </Flex>
        <Table columns={COLUMNS} data={DATA} />
        <Flex justifyContent="flex-end">{/*<Pagination pageSize={20} totalCount={150} />*/}</Flex>
      </GridItem>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  // Only admins can access this page
  if (authorize(session, [])) {
    return {
      props: {},
    };
  }

  // If user is not admin, redirect to login
  return {
    redirect: {
      destination: '/admin/login',
      permanent: false,
    },
  };
};
