import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { Text, GridItem } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/admin/Layout'; // Layout component
import { Role } from '@lib/types'; // Role enum
import { authorize } from '@tools/authorization'; // Page authorization
// import { useState } from 'react';
import { ChevronDownIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import { Button, Box, Flex, Menu, MenuButton, MenuList } from '@chakra-ui/react'; // Chakra UI

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
  // const [startDate, setStartDate] = useState<Date>();
  // const [endDate, setEndDate] = useState<Date>();

  return (
    <Layout>
      <GridItem colSpan={12}>
        <Text textStyle="display-xlarge">Reports</Text>
      </GridItem>
      <GridItem colSpan={12}>
        <Box
          border="1px solid"
          borderColor="border.secondary"
          borderRadius="12px"
          bg="background.white"
        >
          <Box padding="24px 24px 0 24px">
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
                  <MenuText name={`Start date`} />
                </MenuButton>
                <MenuList>
                  {/* <DateRangePicker dateRange={dateRange} onDateChange={addDayToDateRange} /> */}
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
                  <MenuText name={`End date`} />
                </MenuButton>
                <MenuList></MenuList>
              </Menu>
            </Flex>
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
