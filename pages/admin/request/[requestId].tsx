/* eslint-disable @typescript-eslint/no-unused-vars */ // Keeping this to make future development easier
import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { GridItem, Stack } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/internal/Layout'; // Layout component
import { Role, ApplicationStatus } from '@lib/types'; // Enum types
import { authorize } from '@tools/authorization'; // Page authorization
import { useQuery, useMutation } from '@apollo/client'; // Apollo Client hooks
import { GET_APPLICATION } from '@tools/pages/request/queries'; // Request page GraphQL queries
import {
  APPROVE_APPLICATION,
  REJECT_APPLICATION,
  UPDATE_APPLICATION_PROCESSING,
} from '@tools/pages/request/mutations'; // Request page GraphQL queries

import RequestHeader from '@components/requests/RequestHeader'; // Request header
import DoctorInformationCard from '@components/requests/DoctorInformationCard'; // Doctor information card
import PaymentInformationCard from '@components/requests/PaymentInformationCard'; // Payment information card
import PersonalInformationCard from '@components/requests/PersonalInformationCard'; // Personal information card
import ReasonForReplacementCard from '@components/requests/ReasonForReplacementCard'; // Reason for replacement card
import ProcessingTasksCard from '@components/requests/ProcessingTasksCard'; // Processing tasks card

// TODO: REMOVE THIS LATER. Need this to pass pipeline b/c mock applicant needs to satisfy the real Applicant type.
/* eslint-disable @typescript-eslint/no-empty-function */
import { PhysicianStatus } from '@lib/types';

type RequestProps = {
  requestId: number;
};

// Individual request page
export default function Request({ requestId }: RequestProps) {
  const {
    loading: applicationLoading,
    error: applicationError,
    data: applicationData,
  } = useQuery(GET_APPLICATION, {
    variables: { id: requestId },
  });

  const [
    approveApplication,
    { approveApplicationData, approveApplicationLoading, approveApplicationError },
  ] = useMutation(APPROVE_APPLICATION, {
    refetchQueries: ['GetApplication'],
  });
  const [
    rejectApplication,
    { rejectApplicationData, rejectApplicationLoading, rejectApplicationError },
  ] = useMutation(REJECT_APPLICATION, {
    refetchQueries: ['GetApplication'],
  });
  const [
    updateApplicationProcessing,
    {
      updateApplicationProcessingData,
      updateApplicationProcessingLoading,
      updateApplicationProcessingError,
    },
  ] = useMutation(UPDATE_APPLICATION_PROCESSING, {
    refetchQueries: ['GetApplication'],
  });

  const {
    id: applicationId,
    rcdUserId,
    firstName,
    lastName,
    gender,
    customGender,
    dateOfBirth,
    email,
    phone,
    province,
    city,
    addressLine1,
    addressLine2,
    postalCode,
    notes,
    isRenewal,

    disability,
    affectsMobility,
    mobilityAidRequired,
    cannotWalk100m,

    physicianName,
    physicianMspNumber,
    physicianAddressLine1,
    physicianAddressLine2,
    physicianCity,
    physicianProvince,
    physicianPostalCode,
    physicianPhone,
    physicianNotes,

    processingFee,
    donationAmount,
    paymentMethod,
    shopifyConfirmationNumber,

    createdAt,

    replacement,
    applicationProcessing,
    applicant,
  } = applicationData?.application || {};

  const {
    id: applicationProcessingId,
    status: applicationProcessingStatus,
    appNumber,
    appHolepunched,
    walletCardCreated,
    invoiceNumber,
    documentUrls,
    appMailed,
    updatedAt: applicationProcessingUpdatedAt,
  } = applicationProcessing || {};

  const applicantData = {
    id: applicant?.id,
    rcdUserId,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    customGender,
    email,
    phone,
    province,
    city,
    addressLine1,
    addressLine2,
    postalCode,
  };

  const physicianData = {
    firstName: physicianName, // NOTE: We need to add physicianFirstName and physicianLastName to Application Model in DB
    lastName: physicianName,
    mspNumber: physicianMspNumber,
    addressLine1: physicianAddressLine1,
    addressLine2: physicianAddressLine2,
    city: physicianCity,
    province: physicianProvince,
    postalCode: physicianPostalCode,
    phone: physicianPhone,
    status: PhysicianStatus.Active, // NOTE: We need to add physicianStatus to Application Model in DB
    notes: physicianNotes,
  };

  // Approve modal
  const onApprove = () => {
    approveApplication({ variables: { id: applicationProcessingId } });
  };

  // Reject modal
  const onReject = () => {
    rejectApplication({ variables: { id: applicationProcessingId } });
  };

  // Edit personal information modal
  const onComplete = () => {
    // TODO: Make mutation call to modify Application's status to ApplicationStatus.Completed
    // setApplication({ ...application, applicationStatus: ApplicationStatus.Completed });
  };

  // Edit doctor information/reason for replacement modal

  // Edit payment information modal

  // Processing tasks completion handler
  const onTaskComplete = (taskNum: number, taskArgs?: number | string) => {
    switch (taskNum) {
      case 1:
        updateApplicationProcessing({
          variables: { input: { id: applicationProcessingId, appNumber: taskArgs } },
        });
        break;
      case 2:
        updateApplicationProcessing({
          variables: { input: { id: applicationProcessingId, appHolepunched: !appHolepunched } },
        });
        break;
      case 3:
        updateApplicationProcessing({
          variables: {
            input: { id: applicationProcessingId, walletCardCreated: !walletCardCreated },
          },
        });
        break;
      case 4:
        updateApplicationProcessing({
          variables: { input: { id: applicationProcessingId, invoiceNumber: taskArgs } },
        });
        break;
      case 5:
        updateApplicationProcessing({
          variables: { input: { id: applicationProcessingId, documentUrl: taskArgs } },
        });
        break;
      case 6:
        updateApplicationProcessing({
          variables: { input: { id: applicationProcessingId, appMailed: !appMailed } },
        });
        break;
    }
  };

  const allStepsCompleted =
    !isNaN(appNumber) &&
    appHolepunched &&
    walletCardCreated &&
    !isNaN(invoiceNumber) &&
    documentUrls?.length &&
    appMailed;

  return (
    <Layout>
      <GridItem rowSpan={1} colSpan={12} marginTop={3}>
        <RequestHeader
          isRenewal={isRenewal}
          applicationStatus={applicationProcessingStatus}
          createdAt={createdAt}
          onApprove={onApprove}
          onReject={onReject}
          onComplete={onComplete}
          allStepsCompleted={allStepsCompleted}
        />
      </GridItem>
      <GridItem rowSpan={12} colSpan={5} marginTop={5} textAlign="left">
        <PersonalInformationCard
          applicant={applicantData}
          expirationDate={'August 30 2021'} // ???
          mostRecentAPP={12345} // ???
          handleName={() => {}}
        />
      </GridItem>
      <GridItem rowSpan={12} colSpan={7} marginTop={5} textAlign="left">
        <Stack spacing={5}>
          {applicationProcessingStatus === ApplicationStatus.Approved ? (
            <ProcessingTasksCard
              applicationProcessingData={applicationProcessing}
              onTaskComplete={onTaskComplete}
              APPNumber={appNumber}
              invoiceNumber={invoiceNumber}
            />
          ) : isRenewal ? (
            <DoctorInformationCard physician={physicianData} />
          ) : (
            <ReasonForReplacementCard
              cause={replacement?.reason}
              timestamp={replacement?.lostTimestamp}
              locationLost={replacement?.locationLost}
              description={replacement?.description}
              isUpdated={replacement?.isUpdated}
            />
          )}
          <PaymentInformationCard
            permitFee={processingFee}
            donation={donationAmount}
            paymentType={paymentMethod}
            shippingCountry="Canada"
            shippingAddress={addressLine1}
            shippingCity={city}
            shippingProvince={province}
            shippingPostalCode={postalCode}
            billingCountry="Canada"
            billingAddress={addressLine1}
            billingCity={city}
            billingProvince={province}
            billingPostalCode={postalCode}
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
    const requestId = context?.params?.requestId;

    return {
      props: { requestId },
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
