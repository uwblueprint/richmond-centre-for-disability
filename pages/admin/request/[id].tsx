import { GetServerSideProps, NextPage } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { GridItem, VStack } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/admin/Layout'; // Layout component
import RequestHeader from '@components/admin/requests/Header'; // Request header
import RequestFooter from '@components/admin/requests/Footer'; // Request footer
import DoctorInformationCard from '@components/admin/requests/doctor-information/Card'; // Doctor information card
import PaymentInformationCard from '@components/admin/requests/payment-information/Card'; // Payment information card
import PersonalInformationCard from '@components/admin/requests/permit-holder-information/Card'; // Personal information card
import ProcessingTasksCard from '@components/admin/requests/processing/TasksCard'; // Processing tasks card
import PhysicianAssessmentCard from '@components/admin/requests/physician-assessment/Card'; // Physician assessment card
import AdditionalInformationCard from '@components/admin/requests/additional-questions/Card'; // Additional Information card
import { authorize } from '@tools/authorization'; // Page authorization
import { useQuery } from '@tools/hooks/graphql'; // Apollo Client hooks
import {
  GET_APPLICATION_QUERY,
  GetApplicationRequest,
  GetApplicationResponse,
} from '@tools/admin/requests/view-request'; // Request page GraphQL queries
import ReasonForReplacementCard from '@components/admin/requests/reason-for-replacement/Card';
import GuardianInformationCard from '@components/admin/requests/guardian-information/Card';

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
    permitType,
    temporaryPermitExpiry,
    processing: {
      status,
      rejectedReason,
      appNumber,
      appHolepunched,
      walletCardCreated,
      invoice,
      documentsUrl,
      appMailed,
      reviewRequestCompleted,
    },
    permit,
  } = data.application;

  // Get expiry date to display
  const mostRecentPermitExpiryDate = data.application.applicant?.mostRecentPermit?.expiryDate;
  const permitExpiry =
    type === 'REPLACEMENT' ? mostRecentPermitExpiryDate : permit ? permit.expiryDate : null;

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

  /** Whether application is rejected */
  const isRejected = status === 'REJECTED';

  return (
    <Layout>
      <GridItem rowSpan={1} colSpan={12} marginTop={3} marginBottom="12px">
        <RequestHeader
          applicationStatus={status}
          applicationType={type}
          permitType={permitType}
          createdAt={new Date(createdAt)}
          paidThroughShopify={paidThroughShopify}
          shopifyOrderID={shopifyConfirmationNumber || undefined}
          shopifyOrderNumber={shopifyOrderNumber || undefined}
          permitExpiry={permitExpiry}
          temporaryPermitExpiry={temporaryPermitExpiry || null}
          reasonForRejection={rejectedReason || undefined}
        />
      </GridItem>
      <GridItem colStart={1} colSpan={5} textAlign="left">
        <VStack width="100%" spacing="20px" align="stretch">
          <PersonalInformationCard
            applicationId={id}
            editDisabled={reviewRequestCompleted || isRejected}
          />
          {type !== 'REPLACEMENT' && (
            <DoctorInformationCard
              applicationId={id}
              applicationCompleted={status === 'COMPLETED'}
              applicantId={applicantId}
              editDisabled={reviewRequestCompleted || isRejected}
            />
          )}
          {type === 'NEW' && (
            <GuardianInformationCard
              applicationId={id}
              editDisabled={reviewRequestCompleted || isRejected}
            />
          )}
        </VStack>
      </GridItem>
      <GridItem colStart={6} colSpan={7}>
        <VStack width="100%" spacing="20px" align="stretch">
          {(status === 'IN_PROGRESS' || status === 'REJECTED') && (
            <ProcessingTasksCard applicationId={id} />
          )}
          {type === 'NEW' && (
            <PhysicianAssessmentCard
              applicationId={id}
              editDisabled={reviewRequestCompleted || isRejected}
            />
          )}
          {type === 'REPLACEMENT' && (
            <ReasonForReplacementCard
              applicationId={id}
              editDisabled={reviewRequestCompleted || isRejected}
            />
          )}
          {type !== 'REPLACEMENT' && (
            <AdditionalInformationCard
              applicationId={id}
              editDisabled={reviewRequestCompleted || isRejected}
            />
          )}
          <PaymentInformationCard
            applicationId={id}
            applicationCompleted={status === 'COMPLETED'}
            editDisabled={paidThroughShopify || reviewRequestCompleted}
          />
        </VStack>
      </GridItem>
      <RequestFooter
        applicationId={id}
        applicationStatus={status}
        allStepsCompleted={allStepsCompleted}
        applicantId={applicantId}
      />
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
