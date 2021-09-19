/* eslint-disable @typescript-eslint/no-empty-function */
// Eslint Disable Temporarily for Pagination since API hookup not complete.
import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import Layout from '@components/internal/Layout'; // Layout component
import { authorize } from '@tools/authorization'; // Page authorization
import Table from '@components/internal/Table'; // Table component

import {
  Flex,
  Text,
  Box,
  GridItem,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Button,
  Select,
} from '@chakra-ui/react'; // Chakra UI
// Internal home page
import { AddIcon } from '@chakra-ui/icons'; // Chakra UI icons
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
        <MenuItem color="text.critical" textStyle="button-regular">
          Delete User
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

// Render the roles menu
function renderRoleMenu({ value }: { value: string }) {
  return (
    <Select defaultValue={value} width={190}>
      <option value="frontDesk">Front Desk</option>
      <option value="accountant">Accountant</option>
      <option value="admin">Admin</option>
    </Select>
  );
}

const COLUMNS = [
  {
    Header: 'Name',
    accessor: 'name',
    sortDescFirst: true,
    minWidth: 240,
  },
  {
    Header: 'Email',
    accessor: 'email',
    disableSortBy: true,
    minWidth: 270,
  },
  {
    Header: 'Role',
    accessor: 'role',
    Cell: renderRoleMenu,
    disableSortBy: true,
    minWidth: 240,
  },
  {
    Header: 'Actions',
    Cell: renderActionsMenu,
    disableSortBy: true,
    width: 120,
  },
];

// Placeholder data
const DATA = [
  {
    name: 'Steve Rogers',
    email: 'steverogers@uwblueprint.org',
    role: 'frontDesk',
  },
  {
    name: 'Tony Stark',
    email: 'tstark@avengers.inc',
    role: 'accountant',
  },
  {
    name: 'Hulk',
    email: 'incrediblehulk@smash.com',
    role: 'admin',
  },
  {
    name: 'Doctor Strange',
    email: 'strange@uwblueprint.org',
    role: 'frontDesk',
  },
  {
    name: 'Spiderman',
    email: 'spider@avengers.inc',
    role: 'accountant',
  },
  {
    name: 'Thor',
    email: 'thegodthor@asgard.odin',
    role: 'admin',
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
        <Box border="1px solid" borderColor="border.secondary" borderRadius="12px">
          <Box padding="20px 24px 0">
            <Table columns={COLUMNS} data={DATA} />
          </Box>
          <Flex justifyContent="flex-end" padding="12px 24px">
            <Pagination pageNumber={0} pageSize={20} totalCount={100} onPageChange={() => {}} />
          </Flex>
        </Box>
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
