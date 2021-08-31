import { GetServerSideProps } from 'next'; // Get server side props
import { useRouter } from 'next/router'; // Next router
import { getSession } from 'next-auth/client'; // Session management
import { useQuery } from '@apollo/client';
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
import { Permit, PermitStatus, Role, UserStatus } from '@lib/types'; // Role enum
import { authorize } from '@tools/authorization'; // Page authorization
import Table from '@components/internal/Table'; // Table component
import Pagination from '@components/internal/Pagination'; // Pagination component
import { useState } from 'react'; // React
import {
  GET_PERMIT_HOLDERS_QUERY,
  GetPermitHoldersRequest,
  GetPermitHoldersResponse,
  PermitHolder,
} from '@tools/pages/permit-holders/permit-holders-table';
import DayPicker, { DateUtils, DayPickerProps, RangeModifier } from 'react-day-picker'; // Date picker
import 'react-day-picker/lib/style.css'; // Date picker styling
import Helmet from 'react-helmet'; // Date picker inline styling for select range functionality
import { SortOptions, SortOrder } from '@tools/types'; // Sorting types
import { Column } from 'react-table'; // Column type for table
import useDebounce from '@tools/hooks/useDebounce';
import { useEffect } from 'react';

const COLUMNS: Column<any>[] = [
  {
    Header: 'Name',
    accessor: 'name',
    width: 180,
    minWidth: 180,
    sortDescFirst: true,
    Cell: ({ value }) => {
      return (
        <>
          <Text>
            {value.firstName} {value.middleName || ''} {value.lastName}
          </Text>
          <Text textStyle="caption" textColor="secondary">
            ID: {value.rcdUserId}
          </Text>
        </>
      );
    },
  },
  {
    Header: 'Date of Birth',
    accessor: 'dateOfBirth',
    disableSortBy: true,
    width: 140,
    maxWidth: 140,
    Cell: ({ value }) => {
      return <Text>{new Date(value).toLocaleDateString('en-ZA')}</Text>;
    },
  },
  {
    Header: 'Home Address',
    accessor: 'homeAddress',
    disableSortBy: true,
    width: 240,
    minWidth: 240,
    Cell: ({ value }) => {
      return (
        <>
          <Text>{value.address}</Text>
          <Text textStyle="caption" textColor="secondary">
            {value.city}, {value.postalCode}
          </Text>
        </>
      );
    },
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
    accessor: 'mostRecentPermit',
    disableSortBy: true,
    width: 140,
    maxWidth: 140,
    Cell: renderMostRecentPermit,
  },
  {
    Header: 'User Status',
    accessor: 'status',
    disableSortBy: true,
    width: 120,
    maxWidth: 120,
    Cell: ({ value }) => {
      return (
        value && (
          <Wrap>
            <Badge variant={value}>{value.toUpperCase()}</Badge>
          </Wrap>
        )
      );
    },
  },
];

const PAGE_SIZE = 20;

type RecentPermitProps = {
  value: Permit;
};

// Most Recent Permit cell in table
function renderMostRecentPermit({ value }: RecentPermitProps) {
  const today = new Date();
  const expiryDate = new Date(value.expiryDate);
  const expired = DateUtils.isPastDay(expiryDate);
  const expiresSoon = DateUtils.isDayInRange(expiryDate, {
    from: today,
    to: DateUtils.addMonths(today, 1),
  });
  return (
    <Flex>
      <Text as="span" mr="9px">
        #{value.rcdPermitId}
      </Text>
      {expired && <WarningTwoIcon color="secondary.critical" />}
      {expiresSoon && <WarningIcon color="secondary.caution" />}
    </Flex>
  );
}

// Map uppercase enum to lowercase
const permitStatusText: Record<PermitStatus, string> = {
  [PermitStatus.Valid]: 'Valid',
  [PermitStatus.Expired]: 'Expired',
  [PermitStatus.ExpiringInThirtyDays]: 'Expiring Soon',
};

// Map uppercase enum to lowercase
const userStatusText: Record<UserStatus, string> = {
  [UserStatus.Active]: 'Active',
  [UserStatus.Inactive]: 'Inactive',
};

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
        {value || 'All'}
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

// Table data input will be of Applicant type as well as two combined fields
type PermitTableInputData = PermitHolder & {
  name: {
    firstName: string;
    lastName: string;
    middleName: string | null | undefined;
    rcdUserId: number;
  };
  homeAddress: {
    address: string;
    city: string;
    postalCode: string;
  };
};

// Internal permit holders page
export default function PermitHolders() {
  const router = useRouter();

  // Filters
  const [permitStatusFilter, setPermitStatusFilter] = useState<PermitStatus>();
  const [userStatusFilter, setUserStatusFilter] = useState<UserStatus>();
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [range, setRange] = useState<RangeModifier>({ from: undefined, to: undefined });

  // Pagination
  const [sortOrder, setSortOrder] = useState<SortOptions>([['name', SortOrder.ASC]]);

  // Data
  const [permitHolderData, setPermitHolderData] = useState<PermitTableInputData[]>();
  const [pageNumber, setPageNumber] = useState(0);
  const [recordsCount, setRecordsCount] = useState<number>(0);

  // Debounce search filter so that it only gives us latest value if searchFilter has not been updated within last 500ms.
  // This will avoid firing a query for each key the user presses
  const debouncedSearchFilter = useDebounce<string>(searchFilter, 500);

  // Set page number to 0 after every filter or sort change
  useEffect(() => {
    setPageNumber(0);
  }, [permitStatusFilter, userStatusFilter, debouncedSearchFilter, range]);

  // GQL Query
  useQuery<GetPermitHoldersResponse, GetPermitHoldersRequest>(GET_PERMIT_HOLDERS_QUERY, {
    variables: {
      filter: {
        userStatus: userStatusFilter,
        permitStatus: permitStatusFilter,
        expiryDateRangeFrom: range.from?.getTime(),
        expiryDateRangeTo: range.to?.getTime(),
        search: debouncedSearchFilter,
        offset: pageNumber * PAGE_SIZE,
        limit: PAGE_SIZE,
        order: sortOrder,
      },
    },
    onCompleted: ({ applicants: { result, totalCount } }) => {
      const tableData: PermitTableInputData[] = result.map(record => ({
        name: {
          firstName: record.firstName,
          lastName: record.lastName,
          middleName: record.middleName || undefined,
          rcdUserId: record.id,
        },
        homeAddress: {
          address: record.addressLine1,
          city: record.city,
          postalCode: record.postalCode,
        },
        ...record,
      }));
      setPermitHolderData(tableData);
      setRecordsCount(totalCount);
    },
  });

  // Drop down filter options
  const permitStatusOptions = [
    PermitStatus.Valid,
    PermitStatus.Expired,
    PermitStatus.ExpiringInThirtyDays,
  ];
  const userStatusOptions = [UserStatus.Active, UserStatus.Inactive];

  // Day Picker handler
  const handleDayClick: DayPickerProps['onDayClick'] = day => {
    setRange(DateUtils.addDayToRange(day, range));
  };

  const modifier = { start: range.from || undefined, end: range.to || undefined };

  // Logic for displaying date picker text
  const dateRangeText = () => {
    if (!range.from && !range.to) {
      return 'YYYY-MM-DD - YYYY-MM-DD';
    }
    if (range.from && !range.to) {
      return `${range.from.toLocaleDateString('en-CA')} - YYYY-MM-DD`;
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
                  <MenuText
                    name={`Permit Status`}
                    value={permitStatusFilter && permitStatusText[permitStatusFilter]}
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      setPermitStatusFilter(undefined);
                    }}
                  >
                    All
                  </MenuItem>
                  {permitStatusOptions.map((value, i) => (
                    <MenuItem
                      key={`dropDownItem-${i}`}
                      onClick={() => {
                        setPermitStatusFilter(value);
                      }}
                    >
                      {permitStatusText[value]}
                    </MenuItem>
                  ))}
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
                  <MenuText
                    name={`User Status`}
                    value={userStatusFilter && userStatusText[userStatusFilter]}
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      setUserStatusFilter(undefined);
                    }}
                  >
                    All
                  </MenuItem>
                  {userStatusOptions.map((value, i) => (
                    <MenuItem
                      key={`dropDownItem-${i}`}
                      onClick={() => {
                        setUserStatusFilter(value);
                      }}
                    >
                      {userStatusText[value]}
                    </MenuItem>
                  ))}
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
                  <MenuText name={`Expiry date`} value={dateRangeText()} />
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
                  <Input
                    placeholder="Search by first name, last name or user ID"
                    onChange={event => {
                      setSearchFilter(event.target.value);
                    }}
                  />
                </InputGroup>
              </Box>
            </Flex>
            <Table
              columns={COLUMNS}
              data={permitHolderData || []}
              onChangeSortOrder={sortOrder => {
                setSortOrder(sortOrder);
              }}
              onRowClick={({ id }) => router.push(`/admin/permit-holder/${id}`)}
            />
            <Flex justifyContent="flex-end">
              <Pagination
                pageNumber={pageNumber}
                pageSize={PAGE_SIZE}
                totalCount={recordsCount}
                onPageChange={setPageNumber}
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
