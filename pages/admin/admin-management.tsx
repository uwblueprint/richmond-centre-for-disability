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
import { AddIcon } from '@chakra-ui/icons'; // Chakra UI icons
import Pagination from '@components/internal/Pagination'; // Pagination component
import { Role } from '@lib/graphql/types';
import { SortOptions, SortOrder } from '@tools/types'; //Sorting types
import { useQuery } from '@apollo/client'; //Apollo client
import { useState } from 'react'; // React
import {
  GetEmployeesResponse,
  GET_EMPLOYEES_QUERY,
  GetEmployeesRequest,
} from '@tools/pages/admin/admin-management/get-employees';

// Table columns
const COLUMNS = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ value }) => {
      return (
        <div>
          <Text>{`${value.firstName} ${value.lastName}`}</Text>
        </div>
      );
    },
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
          <option value="SECRETARY">Front Desk</option>
          <option value="ACCOUNTING">Accountant</option>
          <option value="ADMIN">Admin</option>
        </Select>
      );
    },
    disableSortBy: true,
    minWidth: 240,
  },
  {
    Header: 'Actions',
    Cell: () => {
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
    },
    disableSortBy: true,
    width: 120,
  },
];

type EmployeeData = {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  role: Role;
};

export default function AdminManagement() {
  const [sortOrder, setSortOrder] = useState<SortOptions>([['name', SortOrder.ASC]]);
  const [requestsData, setRequestsData] = useState<EmployeeData[]>();

  useQuery<GetEmployeesResponse, GetEmployeesRequest>(GET_EMPLOYEES_QUERY, {
    variables: {
      filter: {
        order: sortOrder,
      },
    },
    onCompleted: data => {
      setRequestsData(
        data.employees?.result.map(employee => ({
          name: {
            firstName: employee.firstName,
            lastName: employee.lastName,
          },
          email: employee.email,
          role: employee.role,
        }))
      );
    },
  });

  return (
    <Layout>
      <GridItem colSpan={12}>
        <Flex justifyContent="space-between" alignItems="center" marginBottom="32px">
          <Text textStyle="display-xlarge">Admin Management</Text>
          <Button leftIcon={<AddIcon />}>Add an RCD User</Button>
        </Flex>
        <Box border="1px solid" borderColor="border.secondary" borderRadius="12px">
          <Box padding="20px 24px 0">
            <Table
              columns={COLUMNS}
              data={requestsData || []}
              onChangeSortOrder={sortOrder => setSortOrder(sortOrder)}
            />
          </Box>
          <Flex justifyContent="flex-end" padding="12px 24px">
            <Pagination pageNumber={0} pageSize={20} totalCount={100} onPageChange={() => {}} />
          </Flex>
        </Box>
      </GridItem>{' '}
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
