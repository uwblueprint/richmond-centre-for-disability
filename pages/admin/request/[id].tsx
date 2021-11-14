import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { GridItem, Stack } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/admin/Layout'; // Layout component
import RequestHeader from '@components/admin/requests/RequestHeader'; // Request header
import DoctorInformationCard from '@components/admin/requests/DoctorInformationCard'; // Doctor information card
import PaymentInformationCard from '@components/admin/requests/PaymentInformationCard'; // Payment information card
import PersonalInformationCard from '@components/admin/requests/PersonalInformationCard'; // Personal information card
import ProcessingTasksCard from '@components/admin/requests/ProcessingTasksCard'; // Processing tasks card
import { Role, ApplicationStatus, UpdateApplicationInput } from '@lib/graphql/types'; // Enum types
import { authorize } from '@tools/authorization'; // Page authorization
import { useQuery, useMutation } from '@apollo/client'; // Apollo Client hooks
import { GET_APPLICATION_QUERY } from '@tools/pages/admin/requests/queries'; // Request page GraphQL queries
import {
  UPDATE_APPLICATION_MUTATION,
  APPROVE_APPLICATION_MUTATION,
  REJECT_APPLICATION_MUTATION,
  COMPLETE_APPLICATION_MUTATION,
  UPDATE_APPLICATION_PROCESSING_MUTATION,
} from '@tools/pages/admin/requests/mutations'; // Request page GraphQL mutations
import {
  GetApplicationRequest,
  GetApplicationResponse,
  UpdateApplicationRequest,
  UpdateApplicationResponse,
  ApproveApplicationRequest,
  ApproveApplicationResponse,
  RejectApplicationRequest,
  RejectApplicationResponse,
  CompleteApplicationRequest,
  CompleteApplicationResponse,
  UpdateApplicationProcessingRequest,
  UpdateApplicationProcessingResponse,
} from '@tools/pages/admin/requests/types'; // Request query/mutation types

type Props = {
  readonly id: number;
};

/**
 * View Request page
 * @param id Request ID
 */
export default function Request({ id }: Props) {
  // Get request data query
  const { data } = useQuery<GetApplicationResponse, GetApplicationRequest>(GET_APPLICATION_QUERY, {
    variables: { id },
  });

  // Update application mutation
  const [updateApplication] = useMutation<UpdateApplicationResponse, UpdateApplicationRequest>(
    UPDATE_APPLICATION_MUTATION,
    {
      refetchQueries: ['GetApplication'],
    }
  );

  // Approve application mutation
  const [approveApplication] = useMutation<ApproveApplicationResponse, ApproveApplicationRequest>(
    APPROVE_APPLICATION_MUTATION,
    {
      refetchQueries: ['GetApplication'],
    }
  );

  // Reject application mutation
  const [rejectApplication] = useMutation<RejectApplicationResponse, RejectApplicationRequest>(
    REJECT_APPLICATION_MUTATION,
    {
      refetchQueries: ['GetApplication'],
    }
  );

  // Complete application mutation
  const [completeApplication] = useMutation<
    CompleteApplicationResponse,
    CompleteApplicationRequest
  >(COMPLETE_APPLICATION_MUTATION, {
    refetchQueries: ['GetApplication'],
  });

  // Update application processing mutation
  const [updateApplicationProcessing] = useMutation<
    UpdateApplicationProcessingResponse,
    UpdateApplicationProcessingRequest
  >(UPDATE_APPLICATION_PROCESSING_MUTATION, {
    refetchQueries: ['GetApplication'],
  });

  // If application is not retrieved or applicantId is not defined, do not render page
  // ! This works for renewal applications only, since they must have applicantId defined
  // TODO: Modify logic to handle new applications
  if (!data?.application || data.application.applicantId === null) {
    return null;
  }

  const {
    id: applicationId,
    applicantId,
    rcdUserId,
    firstName,
    middleName,
    lastName,
    email,
    phone,
    province,
    city,
    addressLine1,
    addressLine2,
    postalCode,

    physicianName,
    physicianMspNumber,
    physicianAddressLine1,
    physicianAddressLine2,
    physicianCity,
    physicianProvince,
    physicianPostalCode,
    physicianPhone,
    physicianNotes,

    shippingAddressSameAsHomeAddress,
    billingAddressSameAsHomeAddress,
    shippingFullName,
    shippingAddressLine1,
    shippingAddressLine2,
    shippingCity,
    shippingProvince,
    shippingPostalCode,
    billingFullName,
    billingAddressLine1,
    billingAddressLine2,
    billingCity,
    billingProvince,
    billingPostalCode,

    donationAmount,
    paymentMethod,

    createdAt,

    applicationProcessing,
    applicant: {
      mostRecentPermit: { rcdPermitId, expiryDate },
    },
  } = data.application;

  // Applicant data for Personal Information Card
  const applicantData = {
    id: applicantId,
    firstName,
    middleName,
    lastName,
    rcdUserId,
    email,
    phone,
    addressLine1,
    addressLine2,
    city,
    province,
    postalCode,
    // TODO: Integrate with most recent APP API
    mostRecentAppNumber: rcdPermitId,
    mostRecentAppExpiryDate: new Date(expiryDate),
  };

  // Physician data for Doctor Information Card
  const physicianData = {
    name: physicianName,
    mspNumber: physicianMspNumber,
    addressLine1: physicianAddressLine1,
    addressLine2: physicianAddressLine2,
    city: physicianCity,
    province: physicianProvince,
    postalCode: physicianPostalCode,
    phone: physicianPhone,
    notes: physicianNotes,
  };

  // Payment data
  const paymentInformation = {
    paymentMethod,
    donationAmount,
    shippingAddressSameAsHomeAddress,
    shippingFullName,
    shippingAddressLine1,
    shippingAddressLine2,
    shippingCity,
    shippingProvince,
    shippingPostalCode,
    billingAddressSameAsHomeAddress,
    billingFullName,
    billingAddressLine1,
    billingAddressLine2,
    billingCity,
    billingProvince,
    billingPostalCode,
  };

  /**
   * Approve application handler
   */
  const handleApproveApplication = () => {
    approveApplication({ variables: { applicationId } });
  };

  /**
   * Reject application handler
   */
  const handleRejectApplication = () => {
    rejectApplication({ variables: { applicationId } });
  };

  /**
   * Complete application handler
   */
  const handleCompleteApplication = () => {
    completeApplication({ variables: { applicationId } });
  };

  /**
   * Update application handler
   * @param applicationData Updated application data
   */
  const handleUpdateApplication = (applicationData: Omit<UpdateApplicationInput, 'id'>) => {
    updateApplication({ variables: { input: { id: applicationId, ...applicationData } } });
  };

  /**
   * Update application processing after task complete/incomplete
   * @param args Additional arguments to pass to mutation
   */
  const onTaskUpdate = (args: Record<string, any>) => {
    updateApplicationProcessing({
      variables: {
        input: {
          applicationId,
          ...args,
        },
      },
    });
  };

  // Whether all application processing steps are completed
  const allStepsCompleted =
    applicationProcessing !== null &&
    !!(
      applicationProcessing.appNumber !== null &&
      applicationProcessing.appHolepunched &&
      applicationProcessing.walletCardCreated &&
      applicationProcessing.invoiceNumber !== null &&
      applicationProcessing.documentUrls?.length &&
      applicationProcessing.appMailed
    );

  return (
    <Layout>
      <GridItem rowSpan={1} colSpan={12} marginTop={3}>
        <RequestHeader
          applicationStatus={
            applicationProcessing === null ? undefined : applicationProcessing.status
          }
          createdAt={new Date(createdAt)}
          allStepsCompleted={allStepsCompleted}
          onApprove={handleApproveApplication}
          onReject={handleRejectApplication}
          onComplete={handleCompleteApplication}
        />
      </GridItem>
      <GridItem rowSpan={12} colSpan={5} marginTop={5} textAlign="left">
        <PersonalInformationCard applicant={applicantData} onSave={handleUpdateApplication} />
      </GridItem>
      <GridItem rowSpan={12} colSpan={7} marginTop={5} textAlign="left">
        <Stack spacing={5}>
          {applicationProcessing !== null &&
          applicationProcessing.status === ApplicationStatus.Approved ? (
            <ProcessingTasksCard
              applicationProcessing={applicationProcessing}
              onTaskUpdate={onTaskUpdate}
            />
          ) : (
            <DoctorInformationCard physician={physicianData} onSave={handleUpdateApplication} />
          )}
          <PaymentInformationCard
            paymentInformation={paymentInformation}
            onSave={handleUpdateApplication}
          />
        </Stack>
      </GridItem>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  // Only secretaries and admins can access application information
  if (authorize(session, [Role.Secretary])) {
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
