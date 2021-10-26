import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { Text, GridItem } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/admin/Layout'; // Layout component
import { Role } from '@lib/types'; // Role enum
import { authorize } from '@tools/authorization'; // Page authorization
// import { useState } from 'react';
import { ChevronDownIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import { Button, Box, Flex, Menu, MenuButton, MenuList } from '@chakra-ui/react'; // Chakra UI
// import useDateRangePicker from '@tools/hooks/useDateRangePicker';
import { DownloadIcon } from '@chakra-ui/icons'; // Chakra UI icons

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

// Internal home page
export default function Reports() {
  // const { dateRange, addDayToDateRange, dateRangeString } = useDateRangePicker();

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
          <Box padding="24px">
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
                  width="420px"
                >
                  <MenuText name={`Start date`} value={'YYYY-MM-DD'} />
                </MenuButton>
                <MenuList>{/* <DatePicker onDateChange={addDayToDateRange} /> */}</MenuList>
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
                  <MenuText name={`End date`} value={'YYYY-MM-DD'} />
                </MenuButton>
                <MenuList></MenuList>
              </Menu>
            </Flex>
            <Box padding="100px">
              <Text textStyle="display-large">Processing Date:</Text>
              <Text textStyle="display-large">01/01/2021 - 02/02/2021</Text>
              <Flex justify="center">
                <Text padding="16px" margin="auto" w="23em">
                  Accounting Report has been successfully generated. Please download the report as a
                  .csv by clicking the button below:
                </Text>
              </Flex>
              <Button leftIcon={<DownloadIcon />}>Export as .CSV</Button>
            </Box>
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
