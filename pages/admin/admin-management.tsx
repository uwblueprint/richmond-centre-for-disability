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
  Button,
} from '@chakra-ui/react'; // Chakra UI
// Internal home page
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import Pagination from '@components/internal/Pagination'; // Pagination component

function renderActionsMenu() {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<img src="/assets/three-dots.svg" />}
        variant="outline"
        border="none"
      />
      <MenuList>
        <MenuItem>Edit User</MenuItem>
        <MenuItem color="text.critical">Delete User</MenuItem>
      </MenuList>
    </Menu>
  );
}

function renderRoleMenu() {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        Actions
      </MenuButton>
      <MenuList>
        <MenuItem>Download</MenuItem>
        <MenuItem>Create a Copy</MenuItem>
        <MenuItem>Mark as Draft</MenuItem>
        <MenuItem>Delete</MenuItem>
        <MenuItem>Attend a Workshop</MenuItem>
      </MenuList>
    </Menu>
  );
}

const COLUMNS = [
  {
    Header: 'Name',
    accessor: 'name',
    minWidth: 150,
    width: 190,
  },
  {
    Header: 'Email',
    accessor: 'email',
    minWidth: 200,
    width: 240,
  },
  {
    Header: 'Role',
    accessor: 'role',
    Cell: renderRoleMenu,
    disableSortBy: true,
    maxWidth: 180,
    width: 180,
  },
  {
    Header: 'Actions',
    Cell: renderActionsMenu,
    disableSortBy: true,
    minWidth: 120,
    width: 120,
  },
];

// Placeholder data
const DATA = [
  {
    name: 'Steve Rogers',
    email: 'steverogers@uwblueprint.org',
  },
  {
    name: 'Tony Stark',
    email: 'tstark@avengers.inc',
  },
  {
    name: 'Hulk',
    email: 'incrediblehulk@smash.com',
  },
];

export default function AdminManagement() {
  return (
    <Layout>
      <GridItem colSpan={12}>
        <Flex justifyContent="space-between" alignItems="center" marginBottom="32px">
          <Text textStyle="display-xlarge">Admin Management</Text>
          <Button leftIcon={<AddIcon />}>Add an RCD User</Button>
        </Flex>
        <Table columns={COLUMNS} data={DATA} />
        <Flex justifyContent="flex-end">
          <Pagination pageNumber={0} pageSize={20} totalCount={100} />
        </Flex>
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
