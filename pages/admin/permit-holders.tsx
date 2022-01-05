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
  Tooltip,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react'; // Chakra UI
import { ChevronDownIcon, SearchIcon, WarningIcon, WarningTwoIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import Layout from '@components/admin/Layout'; // Layout component
import { Permit, PermitStatus, Role, UserStatus } from '@lib/types'; // Types
import { authorize } from '@tools/authorization'; // Page authorization
import Table from '@components/Table'; // Table component
import Pagination from '@components/Pagination'; // Pagination component
import { useState } from 'react'; // React
import {
  GET_PERMIT_HOLDERS_QUERY,
  GetPermitHoldersRequest,
  GetPermitHoldersResponse,
  PermitHolder,
} from '@tools/pages/admin/permit-holders/get-permit-holders'; // Permit Holders GQL Query
import { DateUtils } from 'react-day-picker'; // Date Utils
import DateRangePicker from '@components/DateRangePicker'; // Day Picker component
import useDateRangePicker from '@tools/hooks/useDateRangePicker'; // Day Picker hook
import { SortOptions, SortOrder } from '@tools/types'; // Sorting types
import { Column } from 'react-table'; // Column type for table
import useDebounce from '@tools/hooks/useDebounce'; // Debouncer
import { useEffect } from 'react'; // React
import { formatDate } from '@lib/utils/format'; // Date formatter util
import SetPermitHolderToInactiveModal from '@components/admin/permit-holders/table/ConfirmSetInactiveModal'; // Set Permit Holder To Inactive modal
import SetPermitHolderToActiveModal from '@components/admin/permit-holders/table/ConfirmSetActiveModal'; // Set Permit Holder To Active modal
import { PermitHolderToUpdateStatus } from '@tools/pages/admin/permit-holders/types'; // Type for data required in Set Permit Holder Status modal
import GenerateReportModal from '@components/admin/reports/GenerateReportModal'; // Generate report modal

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

// Union name and homeAddress column types to PermitHolder type
type PermitTableInputData = PermitHolder & {
  name: {
    firstName: string;
    lastName: string;
    middleName: string | null | undefined;
    rcdUserId?: number;
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
  const { dateRange, addDayToDateRange, dateRangeString } = useDateRangePicker();

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
  }, [permitStatusFilter, userStatusFilter, debouncedSearchFilter, dateRange]);

  // GQL Query
  useQuery<GetPermitHoldersResponse, GetPermitHoldersRequest>(GET_PERMIT_HOLDERS_QUERY, {
    variables: {
      filter: {
        userStatus: userStatusFilter,
        permitStatus: permitStatusFilter,
        expiryDateRangeFrom: dateRange.from?.getTime(),
        expiryDateRangeTo: dateRange.to?.getTime(),
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
          rcdUserId: record.rcdUserId || undefined,
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

  // Set Permit Holder Inactive/Active modal state
  const {
    isOpen: isSetPermitHolderStatusModalOpen,
    onOpen: onOpenSetPermitHolderStatusModal,
    onClose: onCloseSetPermitHolderStatusModal,
  } = useDisclosure();

  //Generate report modal
  const {
    isOpen: isGenerateReportModalOpen,
    onOpen: onOpenGenerateReportModal,
    onClose: onCloseGenerateReportModal,
  } = useDisclosure();

  // Sets the data required for the Set Permit Holder Inactive/Active modals
  const [permitHolderToUpdateStatus, setPermitHolderToUpdateStatus] =
    useState<PermitHolderToUpdateStatus>();

  const COLUMNS: Column<any>[] = [
    {
      Header: 'Name',
      accessor: 'name',
      width: 180,
      minWidth: 180,
      maxWidth: 180,
      sortDescFirst: true,
      Cell: ({ value }) => {
        const name = `${value.firstName} ${value.middleName || ''} ${value.lastName}`;
        return (
          <>
            <Tooltip label={name} placement="top-start">
              <Text
                maxWidth="180"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                overflow="hidden"
                mb="4px"
              >
                {name}
              </Text>
            </Tooltip>
            <Text textStyle="caption" textColor="secondary">
              ID: {value.rcdUserId ? `#${value.rcdUserId}` : 'N/A'}
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
        return <Text>{formatDate(value)}</Text>;
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
    {
      Header: 'Actions',
      Cell: ({
        row: {
          original: { id, status },
        },
      }: {
        row: { original: { id: number; status: UserStatus } };
      }) => {
        return (
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<img src="/assets/three-dots.svg" />}
              variant="outline"
              border="none"
              onClick={event => event.stopPropagation()}
            />
            <MenuList>
              <MenuItem>{'View Permit Holder'}</MenuItem>
              <MenuItem
                color={status === UserStatus.Active ? 'text.critical' : 'text.success'}
                textStyle="button-regular"
                onClick={event => {
                  event.stopPropagation();
                  setPermitHolderToUpdateStatus({ id, status });
                  onOpenSetPermitHolderStatusModal();
                }}
              >
                {`Set as ${status === UserStatus.Active ? 'Inactive' : 'Active'}`}
              </MenuItem>
            </MenuList>
          </Menu>
        );
      },
      disableSortBy: true,
      width: 120,
      maxWidth: 120,
    },
  ];

  return (
    <Layout>
      <GridItem colSpan={12}>
        <Flex justifyContent="space-between" alignItems="center" marginBottom="32px">
          <Text textStyle="display-xlarge">Permit Holders</Text>
          <Button variant="outline" onClick={onOpenGenerateReportModal}>
            Generate a Report
          </Button>
        </Flex>
        <Box
          border="1px solid"
          borderColor="border.secondary"
          borderRadius="12px"
          bg="background.white"
        >
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
                  <MenuText name={`Expiry date`} value={dateRangeString} />
                </MenuButton>
                <MenuList>
                  <DateRangePicker dateRange={dateRange} onDateChange={addDayToDateRange} />
                </MenuList>
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
      {permitHolderToUpdateStatus?.status === UserStatus.Active && (
        <SetPermitHolderToInactiveModal
          isOpen={isSetPermitHolderStatusModalOpen}
          onClose={onCloseSetPermitHolderStatusModal}
        />
      )}
      {permitHolderToUpdateStatus?.status === UserStatus.Inactive && (
        <SetPermitHolderToActiveModal
          isOpen={isSetPermitHolderStatusModalOpen}
          onClose={onCloseSetPermitHolderStatusModal}
        />
      )}
      <GenerateReportModal
        isOpen={isGenerateReportModalOpen}
        onClose={onCloseGenerateReportModal}
        page="permitHolders"
      />
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
