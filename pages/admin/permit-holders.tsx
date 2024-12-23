import { GetServerSideProps, NextPage } from 'next'; // Get server side props
import { useRouter } from 'next/router'; // Next router
import { getSession } from 'next-auth/client'; // Session management
import { useQuery } from '@tools/hooks/graphql';
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
  VStack,
  HStack,
} from '@chakra-ui/react'; // Chakra UI
import { ChevronDownIcon, SearchIcon, WarningIcon, WarningTwoIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import Layout from '@components/admin/Layout'; // Layout component
import { ApplicantStatus, PermitStatus } from '@lib/graphql/types'; // Types
import { authorize } from '@tools/authorization'; // Page authorization
import Table from '@components/Table'; // Table component
import Pagination from '@components/Pagination'; // Pagination component
import { useState, useMemo } from 'react'; // React
import {
  GET_PERMIT_HOLDERS_QUERY,
  GetPermitHoldersRequest,
  GetPermitHoldersResponse,
  PermitHolderRow,
  PERMIT_STATUSES,
  USER_STATUSES,
  PermitHolderToUpdateStatus,
} from '@tools/admin/permit-holders/permit-holders-table';
import { CurrentApplication } from '@tools/admin/permit-holders/current-application';
import DateRangePicker from '@components/DateRangePicker'; // Day Picker component
import useDateRangePicker from '@tools/hooks/useDateRangePicker'; // Day Picker hook
import { SortOptions, SortOrder } from '@tools/types'; // Sorting types
import { Column } from 'react-table'; // Column type for table
import useDebounce from '@tools/hooks/useDebounce'; // Debouncer
import { useEffect } from 'react'; // React
import { formatFullName, formatPhoneNumber } from '@lib/utils/format'; // String formatter util
import { formatDateYYYYMMDD } from '@lib/utils/date'; // Date formatter util
import ConfirmDeleteApplicantModal from '@components/admin/permit-holders/table/ConfirmDeleteApplicantModal';
import SetPermitHolderToInactiveModal from '@components/admin/permit-holders/table/ConfirmSetInactiveModal'; // Set Permit Holder To Inactive modal
import SetPermitHolderToActiveModal from '@components/admin/permit-holders/table/ConfirmSetActiveModal'; // Set Permit Holder To Active modal
import GenerateReportModal from '@components/admin/permit-holders/reports/GenerateModal'; // Generate report modal
import { getPermitExpiryStatus } from '@lib/utils/permit-expiry';
import FilterMenuSelectedText from '@components/admin/permit-holders/table/FilterMenuSelectedText';
import EmptyMessage from '@components/EmptyMessage';

const PAGE_SIZE = 20;

// Internal permit holders page
const PermitHolders: NextPage = () => {
  const router = useRouter();

  // Filters
  const [permitStatusFilter, setPermitStatusFilter] = useState<PermitStatus | null>(null);
  const [userStatusFilter, setUserStatusFilter] = useState<ApplicantStatus | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const { dateRange, addDayToDateRange, dateRangeString } = useDateRangePicker();
  const [dateOfBirthFilter, setDateOfBirthFilter] = useState('');
  const [permitIdFilter, setPermitIdFilter] = useState<number | null>(null);

  // Pagination
  const [sortOrder, setSortOrder] = useState<SortOptions>([['name', SortOrder.ASC]]);

  // Data
  const [permitHolderData, setPermitHolderData] = useState<Array<PermitHolderRow>>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [recordsCount, setRecordsCount] = useState<number>(0);

  // Debounce search filter so that it only gives us latest value if searchFilter has not been updated within last 500ms.
  // This will avoid firing a query for each key the user presses
  const debouncedSearchFilter = useDebounce<string>(searchFilter, 500);

  // GQL Query
  const { refetch, loading } = useQuery<GetPermitHoldersResponse, GetPermitHoldersRequest>(
    GET_PERMIT_HOLDERS_QUERY,
    {
      variables: {
        filter: {
          userStatus: userStatusFilter,
          permitStatus: permitStatusFilter,
          expiryDateRangeFrom: dateRange.from?.getTime(),
          expiryDateRangeTo: dateRange.to?.getTime(),
          search: debouncedSearchFilter,
          dateOfBirth: dateOfBirthFilter || null,
          permitId: permitIdFilter,
          offset: pageNumber * PAGE_SIZE,
          limit: PAGE_SIZE,
          order: sortOrder,
        },
      },
      // ! Temporary fix to force permit holder row updates when navigating (skip cache)
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
      onCompleted: ({ applicants: { result, totalCount } }) => {
        setPermitHolderData(
          result.map(
            ({
              id,
              firstName,
              middleName,
              lastName,
              addressLine1,
              addressLine2,
              city,
              postalCode,
              ...applicant
            }) => ({
              id,
              name: {
                id,
                firstName,
                lastName,
                middleName,
              },
              homeAddress: {
                addressLine1,
                addressLine2,
                city,
                postalCode,
              },
              ...applicant,
            })
          )
        );
        setRecordsCount(totalCount);
      },
    }
  );

  // Set page number to 0 after every filter or sort change
  useEffect(() => {
    setPageNumber(0);
    refetch();
  }, [permitStatusFilter, userStatusFilter, debouncedSearchFilter, dateRange]);

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

  // Delete applicant modal state
  const {
    isOpen: isDeleteApplicantModalOpen,
    onOpen: onOpenDeleteApplicantModal,
    onClose: onCloseDeleteApplicantModal,
  } = useDisclosure();

  // Sets the data required for the Set Permit Holder Inactive/Active modals
  const [permitHolderToUpdateStatus, setPermitHolderToUpdateStatus] =
    useState<PermitHolderToUpdateStatus>();

  // Applicant ID of the permit holder to delete
  const [permitHolderToDelete, setPermitHolderToDelete] = useState<number>();

  const COLUMNS = useMemo<Column<PermitHolderRow>[]>(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        sortDescFirst: true,
        Cell: ({ value: { id, firstName, middleName, lastName } }) => {
          const name = formatFullName(firstName, middleName, lastName);
          return (
            <>
              <Tooltip label={name} placement="top-start">
                <Text
                  maxWidth="180"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  overflow="clip visible"
                  mb="4px"
                >
                  {name}
                </Text>
              </Tooltip>
              <Text textStyle="caption" textColor="secondary">
                ID: #{id}
              </Text>
            </>
          );
        },
      },
      {
        Header: 'Date of Birth',
        accessor: 'dateOfBirth',
        disableSortBy: true,
        Cell: ({ value }) => {
          return <Text>{formatDateYYYYMMDD(value)}</Text>;
        },
      },
      {
        Header: 'Home Address',
        accessor: 'homeAddress',
        disableSortBy: true,
        Cell: ({ value: { addressLine1, addressLine2, city, postalCode } }) => {
          return (
            <>
              <Text>{addressLine2 ? `${addressLine2} - ${addressLine1}` : addressLine1}</Text>
              <Text textStyle="caption" textColor="secondary">
                {city}, {postalCode}
              </Text>
            </>
          );
        },
      },
      {
        Header: 'Phone #',
        accessor: 'phone',
        disableSortBy: true,

        Cell: ({ value }) => formatPhoneNumber(value),
      },
      {
        Header: 'Recent APP',
        accessor: 'mostRecentPermit',
        disableSortBy: true,
        Cell: ({ value }) => {
          if (!value) {
            return 'N/A';
          }

          const { expiryDate, rcdPermitId } = value;
          const permitStatus = getPermitExpiryStatus(new Date(expiryDate));
          return (
            <Flex>
              <Text as="span" mr="9px">
                #{rcdPermitId}
              </Text>
              {permitStatus === 'EXPIRED' ? (
                <WarningTwoIcon color="secondary.critical" />
              ) : permitStatus === 'EXPIRING' ? (
                <WarningIcon color="secondary.caution" />
              ) : null}
            </Flex>
          );
        },
      },
      {
        Header: 'User Status',
        accessor: 'status',
        disableSortBy: true,
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
            original: { id, status, mostRecentApplication },
          },
        }: {
          row: {
            original: {
              id: number;
              status: ApplicantStatus;
              mostRecentApplication: CurrentApplication | null;
            };
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
                onClick={event => event.stopPropagation()}
              />
              <MenuList>
                <MenuItem>{'View Permit Holder'}</MenuItem>
                <MenuItem
                  color={status === 'ACTIVE' ? 'text.critical' : 'text.success'}
                  textStyle="button-regular"
                  onClick={event => {
                    event.stopPropagation();
                    setPermitHolderToUpdateStatus({ id, status });
                    onOpenSetPermitHolderStatusModal();
                  }}
                >
                  {`Set as ${status === 'ACTIVE' ? 'Inactive' : 'Active'}`}
                </MenuItem>
                {mostRecentApplication?.processing?.status == 'COMPLETED' ? null : (
                  <MenuItem
                    color="text.critical"
                    textStyle="button-regular"
                    onClick={event => {
                      event.stopPropagation();
                      setPermitHolderToDelete(id);
                      onOpenDeleteApplicantModal();
                    }}
                  >
                    {'Delete Permit Holder'}
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          );
        },
        disableSortBy: true,
        width: 120,
        maxWidth: 120,
      },
    ],
    [
      setPermitHolderToUpdateStatus,
      onOpenSetPermitHolderStatusModal,
      setPermitHolderToDelete,
      onOpenDeleteApplicantModal,
    ]
  );

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
            <VStack align="stretch" marginBottom="20px">
              <HStack>
                <InputGroup flex={1}>
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
                <HStack
                  spacing="-12px"
                  height="2.5rem"
                  paddingLeft="16px"
                  border="1px solid"
                  borderColor="border.secondary"
                  borderRadius="6px"
                >
                  <Text as="span" textStyle="button-semibold">
                    Date of birth:
                  </Text>
                  <Input
                    type="date"
                    placeholder="Date of birth"
                    fontSize="18px"
                    width="184px"
                    value={dateOfBirthFilter}
                    onChange={event => setDateOfBirthFilter(event.target.value)}
                    border="none"
                    _focus={{ border: 'none' }}
                  />
                </HStack>
                <HStack
                  spacing="-12px"
                  height="2.5rem"
                  paddingLeft="16px"
                  border="1px solid"
                  borderColor="border.secondary"
                  borderRadius="6px"
                >
                  <Text as="span" textStyle="button-semibold">
                    Permit ID:
                  </Text>
                  <Input
                    type="number"
                    placeholder="Permit ID"
                    fontSize="18px"
                    width="184px"
                    value={permitIdFilter !== null ? permitIdFilter : ''}
                    onChange={event => setPermitIdFilter(event.target.valueAsNumber)}
                    border="none"
                    _focus={{ border: 'none' }}
                  />
                </HStack>
              </HStack>
              <HStack>
                <Menu>
                  <MenuButton
                    as={Button}
                    flex={1}
                    variant="outline"
                    rightIcon={<ChevronDownIcon />}
                    color="text.secondary"
                    borderColor="border.secondary"
                    textAlign="left"
                  >
                    <FilterMenuSelectedText
                      name={`Permit Status`}
                      value={permitStatusFilter?.toLowerCase() || 'All'}
                    />
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        setPermitStatusFilter(null);
                      }}
                    >
                      All
                    </MenuItem>
                    {PERMIT_STATUSES.map(({ name, value }, i) => (
                      <MenuItem
                        key={`dropDownItem-${i}`}
                        onClick={() => {
                          setPermitStatusFilter(value);
                        }}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuButton
                    as={Button}
                    flex={1}
                    variant="outline"
                    rightIcon={<ChevronDownIcon />}
                    color="text.secondary"
                    borderColor="border.secondary"
                    textAlign="left"
                  >
                    <FilterMenuSelectedText
                      name={`User Status`}
                      value={userStatusFilter?.toLowerCase() || 'All'}
                    />
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        setUserStatusFilter(null);
                      }}
                    >
                      All
                    </MenuItem>
                    {USER_STATUSES.map(({ name, value }, i) => (
                      <MenuItem
                        key={`dropDownItem-${i}`}
                        onClick={() => {
                          setUserStatusFilter(value);
                        }}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuButton
                    as={Button}
                    flex={2}
                    variant="outline"
                    rightIcon={<ChevronDownIcon />}
                    color="text.secondary"
                    borderColor="border.secondary"
                    textAlign="left"
                  >
                    <FilterMenuSelectedText name={`Expiry date`} value={dateRangeString} />
                  </MenuButton>
                  <MenuList>
                    <DateRangePicker dateRange={dateRange} onDateChange={addDayToDateRange} />
                  </MenuList>
                </Menu>
              </HStack>
            </VStack>
            {permitHolderData && permitHolderData.length > 0 ? (
              <>
                <Flex justifyContent="flex-end">
                  <Pagination
                    pageNumber={pageNumber}
                    pageSize={PAGE_SIZE}
                    totalCount={recordsCount}
                    onPageChange={setPageNumber}
                  />
                </Flex>
                <Table
                  columns={COLUMNS}
                  data={permitHolderData || []}
                  loading={loading}
                  initialSort={sortOrder}
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
              </>
            ) : (
              <EmptyMessage
                title="No Permit Holders Found"
                message="Try changing the filter or search term"
              />
            )}
          </Box>
        </Box>
      </GridItem>
      {permitHolderToUpdateStatus?.status === 'ACTIVE' && (
        <SetPermitHolderToInactiveModal
          isOpen={isSetPermitHolderStatusModalOpen}
          applicantId={permitHolderToUpdateStatus.id}
          refetch={refetch}
          onClose={onCloseSetPermitHolderStatusModal}
        />
      )}
      {permitHolderToUpdateStatus?.status === 'INACTIVE' && (
        <SetPermitHolderToActiveModal
          isOpen={isSetPermitHolderStatusModalOpen}
          applicantId={permitHolderToUpdateStatus.id}
          refetch={refetch}
          onClose={onCloseSetPermitHolderStatusModal}
        />
      )}
      {permitHolderToDelete !== undefined && (
        <ConfirmDeleteApplicantModal
          isOpen={isDeleteApplicantModalOpen}
          applicantId={permitHolderToDelete}
          refetch={refetch}
          onClose={onCloseDeleteApplicantModal}
        />
      )}
      <GenerateReportModal
        isOpen={isGenerateReportModalOpen}
        onClose={onCloseGenerateReportModal}
      />
    </Layout>
  );
};

export default PermitHolders;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  // Only secretaries and admins can access permit holder information
  if (authorize(session, ['SECRETARY'])) {
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
