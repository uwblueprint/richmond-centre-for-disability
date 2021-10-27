import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { Text, GridItem } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/admin/Layout'; // Layout component
import { Role } from '@lib/types'; // Role enum
import { authorize } from '@tools/authorization'; // Page authorization
import { Box, Flex, Input, Button, Spinner } from '@chakra-ui/react'; // Chakra UI
import { DownloadIcon, SearchIcon } from '@chakra-ui/icons'; // Chakra UI icons
import { useState } from 'react'; // React

// Internal home page
export default function Reports() {
  // const { dateRange, addDayToDateRange, dateRangeString } = useDateRangePicker();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  //TODO: Remove after API hookup
  function removeLoading() {
    setTimeout(function () {
      setLoading(false);
    }, 3000);
  }

  return (
    <Layout>
      <GridItem colSpan={12}>
        <Flex justifyContent="space-between" alignItems="center" marginBottom="32px">
          <Text textStyle="display-xlarge">Accountant Reports</Text>
        </Flex>
        <Box
          border="1px solid"
          borderColor="border.secondary"
          borderRadius="12px"
          bg="background.white"
        >
          <Box padding="24px" justifyContent="space-between">
            <Flex marginBottom="20px">
              <Box marginRight="10px">
                <Flex>
                  <Text textStyle="button-semibold" padding="8px 8px 0 0">
                    Start Date:{' '}
                  </Text>
                  <Input
                    type="date"
                    width="184px"
                    value={startDate}
                    onChange={event => setStartDate(event.target.value)}
                  />
                </Flex>
              </Box>
              <Text textStyle="button-semibold" padding="8px">
                {' '}
                -{' '}
              </Text>
              <Box marginLeft="10px">
                <Flex>
                  <Text textStyle="button-semibold" padding="8px 8px 0 0">
                    End Date:{' '}
                  </Text>
                  <Input
                    type="date"
                    placeholder="MM//DD/YYYY"
                    width="184px"
                    value={endDate}
                    onChange={event => {
                      setEndDate(event.target.value);
                      setLoading(true);
                      removeLoading();
                    }}
                  />
                </Flex>
              </Box>
            </Flex>
            {startDate && endDate && loading == false ? (
              <Box padding="153px">
                <Text textStyle="display-large">Processing Date:</Text>
                <Text textStyle="display-large">
                  {startDate} - {endDate}
                </Text>
                <Flex justify="center">
                  <Text padding="16px" margin="auto" w="23em">
                    Accounting Report has been successfully generated. Please download the report as
                    a .csv by clicking the button below:
                  </Text>
                </Flex>
                <Button leftIcon={<DownloadIcon />}>Export as .CSV</Button>
              </Box>
            ) : startDate && endDate && loading == true ? (
              <Box padding="218px">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                  paddingBottom="16px"
                />
                <Text textStyle="display-large">Fetching Data...</Text>
              </Box>
            ) : (
              <Box padding="180px">
                <SearchIcon w={20} h={20} color="#8C9196" />
                <Text padding="12px 0 12px" textStyle="display-large">
                  No Payments Found
                </Text>
                <Text fontSize="18px">Please select a date range</Text>
              </Box>
            )}
          </Box>
        </Box>
      </GridItem>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  // Only accounting and admins can access reports
  if (authorize(session, [Role.Accounting])) {
    return {
      props: {},
    };
  }

  // If user is not accounting or admin, redirect to login
  return {
    redirect: {
      destination: '/admin/login',
      permanent: false,
    },
  };
};
