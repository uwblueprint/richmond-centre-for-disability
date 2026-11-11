import { GetServerSideProps } from 'next'; // Get server side props
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { ComponentType } from 'react';
import {
  Text,
  GridItem,
  Box,
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/admin/Layout'; // Layout component
import { authorize } from '@tools/authorization'; // Page authorization
import { Role } from '@lib/graphql/types';
import AccountantReport from '@components/admin/reports/AccountantReport';
import RequestsReport from '@components/admin/reports/RequestsReport';
import RenewalsReport from '@components/admin/reports/RenewalsReport';

const REPORT_TABS: ReadonlyArray<{
  key: string;
  label: string;
  roles: ReadonlyArray<Role>;
  Report: ComponentType;
}> = [
  { key: 'accountant', label: 'Accountant', roles: ['ACCOUNTING'], Report: AccountantReport },
  { key: 'requests', label: 'Requests', roles: ['SECRETARY'], Report: RequestsReport },
  { key: 'renewals', label: 'Renewals', roles: ['SECRETARY'], Report: RenewalsReport },
];

export default function Reports() {
  const router = useRouter();
  const [session] = useSession();

  const tabs = REPORT_TABS.filter(({ roles }) => authorize(session, roles));
  const tabIndex = Math.max(
    tabs.findIndex(({ key }) => key === router.query.tab),
    0
  );

  return (
    <Layout>
      <GridItem colSpan={12}>
        <Flex justifyContent="space-between" alignItems="center" marginBottom="32px">
          <Text textStyle="display-xlarge">Reports</Text>
        </Flex>
        <Box border="1px solid" borderColor="border.secondary" borderRadius="12px" bgColor="white">
          <Tabs
            index={tabIndex}
            onChange={index =>
              router.replace({ query: { tab: tabs[index].key } }, undefined, { shallow: true })
            }
          >
            <TabList paddingX="24px">
              {tabs.map(({ key, label }) => (
                <Tab key={key} height="64px">
                  {label}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              {tabs.map(({ key, Report }) => (
                <TabPanel key={key} padding="0">
                  <Report />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      </GridItem>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  // Secretaries generate request and renewal reports, accounting generates accountant reports
  if (authorize(session, ['SECRETARY', 'ACCOUNTING'])) {
    return {
      props: {},
    };
  }

  return {
    redirect: {
      destination: '/admin/login',
      permanent: false,
    },
  };
};
