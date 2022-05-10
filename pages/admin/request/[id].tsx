import { GetServerSideProps, NextPage } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { GridItem, VStack } from '@chakra-ui/react'; // Chakra UI
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
import LoadingSpinner from '@components/admin/LoadingSpinner';

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
  const { data, loading } = useQuery<GetApplicationResponse, GetApplicationRequest>(
    GET_APPLICATION_QUERY,
    {
      variables: { id },
    }
  );
  // Get Permit Holder ID from Application

  if (!data?.application) {
    return null;
  }

  const applicantId = data.application.applicant?.id;
  const {
    type,
    createdAt,
    paidThroughShopify,
    shopifyConfirmationNumber,
    shopifyOrderNumber,
    processing: {
      status,
      appNumber,
      appHolepunched,
      walletCardCreated,
      invoice,
      documentsUrl,
      appMailed,
      reviewRequestCompleted,
    },
  } = data.application;

  // Whether all application processing steps are completed
  const allStepsCompleted = !!(
    appNumber !== null &&
    appHolepunched &&
    walletCardCreated &&
    reviewRequestCompleted &&
    invoice !== null &&
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
          allStepsCompleted={allStepsCompleted}
          applicantId={applicantId}
          paidThroughShopify={paidThroughShopify}
          shopifyOrderID={shopifyConfirmationNumber || undefined}
          shopifyOrderNumber={shopifyOrderNumber || undefined}
        />
      </GridItem>
      {loading ? (
        <LoadingSpinner message={'Loading Data...'} />
      ) : (
        <>
          <GridItem colStart={1} colSpan={5} textAlign="left">
            <VStack width="100%" spacing="20px" align="stretch">
              <PersonalInformationCard applicationId={id} editDisabled={reviewRequestCompleted} />
              {type !== 'REPLACEMENT' && (
                <DoctorInformationCard applicationId={id} editDisabled={reviewRequestCompleted} />
              )}
            </VStack>
          </GridItem>
          <GridItem colStart={6} colSpan={7}>
            <VStack width="100%" spacing="20px" align="stretch">
              {status === 'IN_PROGRESS' && <ProcessingTasksCard applicationId={id} />}
              {type === 'REPLACEMENT' && (
                <ReasonForReplacementCard
                  applicationId={id}
                  editDisabled={reviewRequestCompleted}
                />
              )}
              <PaymentInformationCard
                applicationId={id}
                editDisabled={paidThroughShopify || reviewRequestCompleted}
              />
            </VStack>
          </GridItem>
        </>
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
