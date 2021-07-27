import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import {
  Box,
  Flex,
  Text,
  GridItem,
  Button,
  Menu,
  MenuButton,
  InputGroup,
  Input,
  InputLeftElement,
  useControllableState,
  MenuList,
  MenuItem,
  Wrap,
  Badge,
} from '@chakra-ui/react'; // Chakra UI
import { ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import Layout from '@components/internal/Layout'; // Layout component
import { Role } from '@lib/types'; // Role enum
import { authorize } from '@tools/authorization'; // Page authorization
import Table from '@components/internal/Table'; // Table component
import Pagination from '@components/internal/Pagination'; // Pagination component
import { SetStateAction, Dispatch } from 'react'; // setState prop
import DayPicker, { DateUtils, DayPickerProps, RangeModifier } from 'react-day-picker'; // Date picker
import 'react-day-picker/lib/style.css'; // Date picker styling
import Helmet from 'react-helmet'; // Date picker inline styling for range

// Placeholder data

const DATA = Array(10).fill({
  name: {
    name: 'Charmaine Wang',
    id: 36565,
  },
  dateOfBirth: '2021/01/01',
  homeAddress: {
    address: '5300, No.3 Rd Lansdowne Centre',
    city: 'Richmond',
    postalCode: 'V2X 1E4',
  },
  email: 'charmainewang@rcd.org',
  phone: '000-000-0000',
  recentAPP: '#XXXXXX',
  userStatus: 'active',
});

const COLUMNS = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: renderName,
  },
  {
    Header: 'Date of Birth',
    accessor: 'dateOfBirth',
    disableSortBy: true,
  },
  {
    Header: 'Home Address',
    accessor: 'homeAddress',
    disableSortBy: true,
    Cell: renderAddress,
  },
  {
    Header: 'Email',
    accessor: 'email',
    disableSortBy: true,
  },
  {
    Header: 'Phone #',
    accessor: 'phone',
    disableSortBy: true,
  },
  {
    Header: 'Recent APP',
    accessor: 'recentAPP',
    disableSortBy: true,
  },
  {
    Header: 'User Status',
    accessor: 'userStatus',
    disableSortBy: true,
    Cell: renderStatusBadge,
  },
];

type StatusProps = {
  value: string;
};

function renderStatusBadge({ value }: StatusProps) {
  return (
    <Wrap>
      <Badge variant={value}>{value.toUpperCase()}</Badge>
    </Wrap>
  );
}

type AddressProps = {
  value: any;
};

function renderAddress({ value }: AddressProps) {
  return (
    <>
      <Text>{value.address}</Text>
      <Text textStyle="caption" textColor="secondary">
        {value.postalCode}
      </Text>
    </>
  );
}

type NameProps = {
  value: any;
};

function renderName({ value }: NameProps) {
  return (
    <>
      <Text>{value.name}</Text>
      <Text textStyle="caption" textColor="secondary">
        {value.id}
      </Text>
    </>
  );
}

type DropDownItemsProps = {
  readonly items: Array<string>;
  readonly setStateCallback: Dispatch<SetStateAction<string>>;
};

function DropDownItems({ items, setStateCallback }: DropDownItemsProps) {
  return (
    <>
      {items.map((value, i) => (
        <MenuItem
          key={`dropDownItem-${i}`}
          onClick={() => {
            setStateCallback(value);
          }}
        >
          {value}
        </MenuItem>
      ))}
    </>
  );
}

function DayPickerStyling() {
  return (
    <Helmet>
      <style>{`
        .Selectable .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
          background-color: #f0f8ff !important;
          color: #4a90e2;
        }
        .Selectable .DayPicker-Day {
          border-radius: 0 !important;
        }
        .Selectable .DayPicker-Day--start {
          border-top-left-radius: 50% !important;
          border-bottom-left-radius: 50% !important;
        }
        .Selectable .DayPicker-Day--end {
          border-top-right-radius: 50% !important;
          border-bottom-right-radius: 50% !important;
        }
      `}</style>
    </Helmet>
  );
}

// Internal home page
export default function PermitHolders() {
  const [permitStatusFilter, setPermitStatusFilter] = useControllableState({ defaultValue: 'All' });
  const [userStatusFilter, setUserStatusFilter] = useControllableState({ defaultValue: 'All' });
  const [range, setRange] = useControllableState<RangeModifier>({
    defaultValue: { from: undefined, to: undefined },
  });

  const permitStatusOptions = [
    'All',
    'In Progress',
    'Completed',
    'Pending',
    'Expiring Soon',
    'Expired',
    'Rejected',
  ];
  const userStatusOptions = ['All', 'Active', 'Inactive'];

  const handleDayClick: DayPickerProps['onDayClick'] = day => {
    setRange(DateUtils.addDayToRange(day, range));
  };

  const modifier = { start: range.from || undefined, end: range.to || undefined };

  return (
    <Layout>
      <GridItem colSpan={12}>
        <Flex align="left" marginBottom="32px">
          <Text textStyle="display-xlarge">Permit Holders</Text>
        </Flex>
        <Box border="1px solid" borderColor="border.secondary" borderRadius="12px">
          <Box padding="20px 24px">
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
                  Permit Status: {permitStatusFilter}
                </MenuButton>
                <MenuList>
                  <DropDownItems
                    items={permitStatusOptions}
                    setStateCallback={setPermitStatusFilter}
                  />
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
                >
                  User Status: {userStatusFilter}
                </MenuButton>
                <MenuList>
                  <DropDownItems items={userStatusOptions} setStateCallback={setUserStatusFilter} />
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
                >
                  Expiry date:
                  {!range.to && ' YYYY-MM-DD - YYYY-MM-DD'}
                  {range.from &&
                    range.to &&
                    ` ${range.from.toLocaleDateString('en-CA')} - ${range.to.toLocaleDateString(
                      'en-CA'
                    )}`}
                </MenuButton>
                <MenuList>
                  <DayPicker
                    className="Selectable"
                    numberOfMonths={2}
                    selectedDays={[range.from || undefined, range]}
                    modifiers={modifier}
                    onDayClick={handleDayClick}
                  />
                </MenuList>
                <DayPickerStyling />
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
              <Pagination pageSize={20} totalCount={150} />
            </Flex>
          </Box>
        </Box>
      </GridItem>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  // Only secretaries and admins can access permit holder information
  if (authorize(session, [Role.Secretary])) {
    return {
      props: {},
    };
  }

  // If user is not secretary or admin, redirect to login
  return {
    redirect: {
      destination: '/admin/login',
      permanent: false,
    },
  };
};
