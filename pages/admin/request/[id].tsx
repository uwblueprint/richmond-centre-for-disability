import { GetServerSideProps, NextPage } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { GridItem, VStack, Box, Stack, Button, Text } from '@chakra-ui/react'; // Chakra UI
import Link from 'next/link'; // Next Link
import Layout from '@components/admin/Layout'; // Layout component
import RequestHeader from '@components/admin/requests/Header'; // Request header
import DoctorInformationCard from '@components/admin/requests/doctor-information/Card'; // Doctor information card
import PaymentInformationCard from '@components/admin/requests/payment-information/Card'; // Payment information card
import PersonalInformationCard from '@components/admin/requests/permit-holder-information/Card'; // Personal information card
import ProcessingTasksCard from '@components/admin/requests/processing/TasksCard'; // Processing tasks card
import { authorize } from '@tools/authorization'; // Page authorization
import { useQuery } from '@apollo/client'; // Apollo Client hooks
import {
  GET_APPLICATION_QUERY,
  GetApplicationRequest,
  GetApplicationResponse,
} from '@tools/admin/requests/view-request'; // Request page GraphQL queries
import ReasonForReplacementCard from '@components/admin/requests/reason-for-replacement/Card';
import CompleteRequestModal from '@components/admin/requests/processing/CompleteModal'; // Mark as complete button + modal

type Props = {
  readonly id: string;
};

/**
 * View Request page
 * @param id Request ID
 */
const Request: NextPage<Props> = ({ id: idString }: Props) => {
  const id = parseInt(idString);

  // Get request data query
  const { data } = useQuery<GetApplicationResponse, GetApplicationRequest>(GET_APPLICATION_QUERY, {
    variables: { id },
  });

  if (!data?.application) {
    return null;
  }

  const {
    type,
    createdAt,
    processing: {
      status,
      appNumber,
      appHolepunched,
      walletCardCreated,
      invoiceNumber,
      documentsUrl,
      appMailed,
    },
  } = data.application;

  // Whether all application processing steps are completed
  const allStepsCompleted = !!(
    appNumber !== null &&
    appHolepunched &&
    walletCardCreated &&
    invoiceNumber !== null &&
    documentsUrl !== null &&
    appMailed
  );

  return (
    <Layout>
      <GridItem rowSpan={1} colSpan={12} marginTop={3} marginBottom="12px">
        <RequestHeader
          applicationId={id}
          applicationStatus={status}
          applicationType={type}
          createdAt={new Date(createdAt)}
        />
      </GridItem>
      <GridItem colStart={1} colSpan={5} textAlign="left">
        <VStack width="100%" spacing="20px" align="stretch">
          <PersonalInformationCard applicationId={id} />
          {type !== 'REPLACEMENT' && <DoctorInformationCard applicationId={id} />}
        </VStack>
      </GridItem>
      <GridItem colStart={6} colSpan={7}>
        <VStack width="100%" spacing="20px" align="stretch">
          {status === 'IN_PROGRESS' && <ProcessingTasksCard applicationId={id} />}
          {type === 'REPLACEMENT' && <ReasonForReplacementCard applicationId={id} />}
          <PaymentInformationCard applicationId={id} />
        </VStack>
      </GridItem>
      {status == 'IN_PROGRESS' && (
          <Box
            position="fixed"
            left="0"
            bottom="0"
            right="0"
            paddingY="20px"
            paddingX="150px"
            bgColor="white"
            boxShadow="dark-lg"
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
              <Stack direction="row" justifyContent="space-between">
                  <Link href={`/admin`}>
                    <a>
                      <Button
                        bg="background.gray"
                        _hover={{ bg: 'background.grayHover' }}
                        marginRight="20px"
                        height="48px"
                        width="280px"
                      >
                        <Text textStyle="button-semibold" color="text.default">
                          View permit holder page
                        </Text>
                      </Button>
                    </a>
                  </Link>
                </Stack>
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between">
                  <CompleteRequestModal isDisabled={allStepsCompleted} applicationId={id}>
                    <Button
                      bg="primary"
                      height="48px"
                      width="217px"
                      type="submit"
                      disabled={!allStepsCompleted}
                      onClick={() => console.log(1)}
                    >
                      <Text textStyle="button-semibold">Complete request</Text>
                    </Button>
                  </CompleteRequestModal>
                </Stack>
              </Box>
            </Stack>
          </Box>
        )}
    </Layout>
  );
};

export default Request;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  // Only secretaries and admins can access application information
  if (authorize(session, ['SECRETARY'])) {
    const id = context?.params?.id;

    return {
      props: { id },
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
