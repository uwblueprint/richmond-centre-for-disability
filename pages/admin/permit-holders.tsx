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
  MenuList,
  MenuItem,
  Wrap,
  Badge,
} from '@chakra-ui/react'; // Chakra UI
import { ChevronDownIcon, SearchIcon, WarningIcon, WarningTwoIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import Layout from '@components/internal/Layout'; // Layout component
import { Role } from '@lib/types'; // Role enum
import { authorize } from '@tools/authorization'; // Page authorization
import Table from '@components/internal/Table'; // Table component
import Pagination from '@components/internal/Pagination'; // Pagination component
import { useState, SetStateAction, Dispatch } from 'react'; // React
import DayPicker, { DateUtils, DayPickerProps, RangeModifier } from 'react-day-picker'; // Date picker
import 'react-day-picker/lib/style.css'; // Date picker styling
import Helmet from 'react-helmet'; // Date picker inline styling for select range functionality

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
  recentAPP: {
    appNumber: '#XXXXXX',
    expiryDate: new Date(),
  },
  userStatus: 'active',
});

const COLUMNS = [
  {
    Header: 'Name',
    accessor: 'name',
    width: 180,
    minWidth: 180,
    Cell: renderName,
  },
  {
    Header: 'Date of Birth',
    accessor: 'dateOfBirth',
    disableSortBy: true,
    width: 140,
    maxWidth: 140,
  },
  {
    Header: 'Home Address',
    accessor: 'homeAddress',
    disableSortBy: true,
    width: 240,
    minWidth: 240,
    Cell: renderAddress,
  },
  {
    Header: 'Email',
    accessor: 'email',
    disableSortBy: true,
    width: 240,
    minWidth: 240,
  },
  {
    Header: 'Phone #',
    accessor: 'phone',
    disableSortBy: true,
    width: 140,
    maxWidth: 140,
  },
  {
    Header: 'Recent APP',
    accessor: 'recentAPP',
    disableSortBy: true,
    width: 140,
    maxWidth: 140,
    Cell: renderRecentAPP,
  },
  {
    Header: 'User Status',
    accessor: 'userStatus',
    disableSortBy: true,
    width: 120,
    maxWidth: 120,
    Cell: renderUserStatusBadge,
  },
];

type NameProps = {
  value: {
    name: string;
    id: number;
  };
};

function renderName({ value }: NameProps) {
  return (
    <>
      <Text>{value.name}</Text>
      <Text textStyle="caption" textColor="secondary">
        ID: {value.id}
      </Text>
    </>
  );
}

type AddressProps = {
  value: {
    address: string;
    city: string;
    postalCode: string;
  };
};

function renderAddress({ value }: AddressProps) {
  return (
    <>
      <Text>{value.address}</Text>
      <Text textStyle="caption" textColor="secondary">
        {value.city}, {value.postalCode}
      </Text>
    </>
  );
}

type UserStatusProps = {
  value: 'active' | 'inactive';
};

function renderUserStatusBadge({ value }: UserStatusProps) {
  return (
    <Wrap>
      <Badge variant={value}>{value.toUpperCase()}</Badge>
    </Wrap>
  );
}

type RecentAPPProps = {
  value: {
    appNumber: 'string';
    expiryDate: Date;
  };
};

function renderRecentAPP({ value }: RecentAPPProps) {
  const today = new Date();
  const expired = DateUtils.isPastDay(value.expiryDate);
  const expiresSoon = DateUtils.isDayInRange(today, {
    from: today,
    to: DateUtils.addMonths(today, 1),
  });
  return (
    <Flex>
      <Text as="span" mr="9px">
        {value.appNumber}
      </Text>
      {expired && <WarningTwoIcon color="secondary.critical" />}
      {expiresSoon && <WarningIcon color="secondary.caution" />}
    </Flex>
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

type MenuTextProps = {
  readonly name: string;
  readonly value?: string;
};

function MenuText({ name, value }: MenuTextProps) {
  return (
    <>
      <Text as="span" textStyle="button-semibold">
        {`${name}: `}
      </Text>
      <Text as="span" textStyle="button-regular">
        {value}
      </Text>
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
  const [permitStatusFilter, setPermitStatusFilter] = useState('All');
  const [userStatusFilter, setUserStatusFilter] = useState('All');
  const [range, setRange] = useState<RangeModifier>({ from: undefined, to: undefined });

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

  const dateRangeString = () => {
    if (!range.to) {
      return 'YYYY-MM-DD - YYYY-MM-DD';
    }
    if (range.from && range.to) {
      return `${range.from.toLocaleDateString('en-CA')} - ${range.to.toLocaleDateString('en-CA')}`;
    }
  };

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
                  textAlign="left"
                  width="320px"
                >
                  <MenuText name={`Permit Status`} value={permitStatusFilter} />
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
                  textAlign="left"
                  width="260px"
                >
                  <MenuText name={`User Status`} value={userStatusFilter} />
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
                  textAlign="left"
                  width="420px"
                >
                  <MenuText name={`Expiry date`} value={dateRangeString()} />
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
