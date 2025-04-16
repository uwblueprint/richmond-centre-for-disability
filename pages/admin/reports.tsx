import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import {
  Text,
  GridItem,
  Box,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/admin/Layout'; // Layout component
import { authorize } from '@tools/authorization'; // Page authorization
// import { DownloadIcon } from '@chakra-ui/icons'; // Chakra UI icons
import { useState } from 'react'; // React
// import { useLazyQuery } from '@tools/hooks/graphql';
// import {
//   GENERATE_ACCOUNTANT_REPORT_QUERY,
//   GenerateAccountantReportRequest,
//   GenerateAccountantReportResponse,
// } from '@tools/admin/permit-holders/graphql/generate-report';
// import EmptyMessage from '@components/EmptyMessage';
// import GenerateReportModal from '@components/admin/requests/reports/GenerateModal'; // Generate report modal
import AccountantReports from '@components/admin/reports/AccountantReport';
import PermitReports from '@components/admin/reports/PermitReport'; // Generate report

// Internal home page
export default function Reports() {
  //Generate report modal
  // const {
  //   isOpen: isGenerateReportModalOpen,
  //   onOpen: onOpenGenerateReportModal,
  //   onClose: onCloseGenerateReportModal,
  // } = useDisclosure();
  // const { dateRange, addDayToDateRange, dateRangeString } = useDateRangePicker();
  // const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');

  const [tabIndex, setTabIndex] = useState(0);

  // Export csv query
  // const [exportCSV, { loading: queryLoading }] = useLazyQuery<
  //   GenerateAccountantReportResponse,
  //   GenerateAccountantReportRequest
  // >(GENERATE_ACCOUNTANT_REPORT_QUERY, {
  //   fetchPolicy: 'network-only',
  //   onCompleted: data => {
  //     if (data.generateAccountantReport.ok && !!data.generateAccountantReport.url) {
  //       const link = document.createElement('a');
  //       link.setAttribute('href', data.generateAccountantReport.url);
  //       link.style.visibility = 'hidden';
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);

  //       toast({
  //         status: 'success',
  //         description: `A CSV permit holders report has been successfully generated.`,
  //       });
  //     }
  //   },
  // });

  /**
   * Handle CSV export
   */
  // const handleSubmit = async () => {
  //   await exportCSV({
  //     variables: {
  //       input: {
  //         startDate,
  //         endDate,
  //       },
  //     },
  //   });
  // };

  return (
    <Layout>
      <GridItem colSpan={12}>
        <Flex justifyContent="space-between" alignItems="center" marginBottom="32px">
          <Text textStyle="display-xlarge">Generate Reports</Text>
        </Flex>
        <Box border="1px solid" borderColor="border.secondary" borderRadius="12px" bgColor="white">
          <Tabs
            marginBottom="20px"
            index={tabIndex}
            onChange={index => {
              setTabIndex(index);
            }}
          >
            <TabList paddingX="24px" defaultIndex={1}>
              <Tab height="64px">Accountant Report</Tab>
              <Tab height="64px">Requests Report</Tab>
              <Tab height="64px">Permit Report</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>{<AccountantReports />}</TabPanel>
              <TabPanel>
                <p>two!</p>
              </TabPanel>
              <TabPanel>{<PermitReports />}</TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </GridItem>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  // Only accounting and admins can access reports
  if (authorize(session, ['ACCOUNTING'])) {
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
