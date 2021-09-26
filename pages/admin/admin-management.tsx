/* eslint-disable @typescript-eslint/no-empty-function */
// Eslint Disable Temporarily for Pagination since API hookup not complete.
import { useState } from 'react'; // React
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
  useDisclosure,
} from '@chakra-ui/react'; // Chakra UI
import { AddIcon } from '@chakra-ui/icons'; // Chakra UI icons
import Pagination from '@components/internal/Pagination'; // Pagination component
import ConfirmDeleteAdminModal from '@components/admin-management/ConfirmDeleteAdminModal'; // Confirm Delete Admin modal
import { UserToDelete } from '@tools/pages/admin-management/types'; // Admin management types
import AdminModal from '@components/admin-management/AdminModal'; // Admin modal component
import { Employee, Role } from '@lib/graphql/types'; // GraphQL types



/**
 * Admin management page
 */
export default function AdminManagement() {
  // Deletion modal state
  const {
    isOpen: isConfirmDeleteModalOpen,
    onOpen: onOpenConfirmDeleteModal,
    onClose: onCloseConfirmDeleteModal,
  } = useDisclosure();

  // State for admin to delete
  const [userToDelete, setUserToDelete] = useState<UserToDelete>();

  //New user modal state
  const {
    isOpen: isNewUserModalOpen,
    onOpen: onOpenNewUserModal,
    onClose: onCloseNewUserModal,
  } = useDisclosure();

  //Edit user modal state
  const {
    isOpen: isEditUserModalOpen,
    onOpen: onOpenEditUserModal,
    onClose: onCloseEditUserModal,
  } = useDisclosure();

  // State for admin to update
  const [userToUpdate, setUserToUpdate] = useState<Omit<Employee, 'id' | 'active'>>();

  // Table columns
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
      Cell: ({ value }: { value: string }) => {
        return (
          <Select defaultValue={value} width={190}>
            <option value={Role.Secretary}>Front Desk</option>
            <option value={Role.Accounting}>Accountant</option>
            <option value={Role.Admin}>Admin</option>
          </Select>
        );
      },
      disableSortBy: true,
      minWidth: 240,
    },
    {
      Header: 'Actions',
      Cell: ({
        row: {
          original: { id, firstName, lastName, email, role },
        },
      }: {
        row: {
          original: { id: number; firstName: string; lastName: string; email: string; role: Role };
        };
      }) => {
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
              <MenuItem
                onClick={() => {
                  setUserToUpdate({
                    firstName,
                    lastName,
                    email,
                    role,
                  });
                  onOpenEditUserModal();
                }}
              >
                Edit User
              </MenuItem>
              <MenuItem 
                color="text.critical" 
                textStyle="button-regular"
                onClick={() => {
                  setUserToDelete({ 
                    id, 
                    name: `${firstName} ${lastName}`
                  });
                  onOpenConfirmDeleteModal();
                }}
              >
                Delete User
              </MenuItem>
            </MenuList>
          </Menu>
        );
      },
      disableSortBy: true,
      width: 120,
    },
  ];

    // Placeholder data
    const DATA = [
      {
        name: 'Steve Rogers',
        email: 'steverogers@uwblueprint.org',
        role: Role.Secretary,
      },
      {
        name: 'Tony Stark',
        email: 'tstark@avengers.inc',
        role: Role.Accounting,
      },
      {
        name: 'Hulk',
        email: 'incrediblehulk@smash.com',
        role: Role.Admin,
      },
      {
        name: 'Doctor Strange',
        email: 'strange@uwblueprint.org',
        role: Role.Secretary,
      },
      {
        name: 'Spiderman',
        email: 'spider@avengers.inc',
        role: Role.Accounting,
      },
      {
        name: 'Thor',
        email: 'thegodthor@asgard.odin',
        role: Role.Admin,
      },
    ];

  return (
    <Layout>
      <GridItem colSpan={12}>
        <Flex justifyContent="space-between" alignItems="center" marginBottom="32px">
          <Text textStyle="display-xlarge">Admin Management</Text>
          <Button
            leftIcon={<AddIcon />}
            onClick={() => {
              onOpenNewUserModal();
            }}
          >
            Add an RCD User
          </Button>
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
      {userToDelete && (
        <ConfirmDeleteAdminModal
          isOpen={isConfirmDeleteModalOpen}
          onClose={onCloseConfirmDeleteModal}
          user={userToDelete}
          // TODO: Replace onDelete handler during API hookup
          onDelete={onCloseConfirmDeleteModal}
        />
      )}
      <AdminModal
        isOpen={isNewUserModalOpen}
        title="Add New User"
        onClose={onCloseNewUserModal}
        onSave={() => {}}
      />
      <AdminModal
        isOpen={isEditUserModalOpen}
        title="Edit User"
        admin={userToUpdate}
        onClose={onCloseEditUserModal}
        onSave={() => {}}
      />
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
