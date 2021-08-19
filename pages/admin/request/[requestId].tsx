// Keeping this to make future development easier
// TODO: Resolve unused variables post-MVP
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { GridItem, Stack } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/internal/Layout'; // Layout component
import { Role, ApplicationStatus } from '@lib/types'; // Enum types
import { authorize } from '@tools/authorization'; // Page authorization
import { useQuery, useMutation } from '@apollo/client'; // Apollo Client hooks
import { GET_APPLICATION } from '@tools/pages/request/queries'; // Request page GraphQL queries
import {
  UPDATE_APPLICATION,
  APPROVE_APPLICATION,
  REJECT_APPLICATION,
  COMPLETE_APPLICATION,
  UPDATE_APPLICATION_PROCESSING,
} from '@tools/pages/request/mutations'; // Request page GraphQL queries

import RequestHeader from '@components/requests/RequestHeader'; // Request header
import DoctorInformationCard from '@components/requests/DoctorInformationCard'; // Doctor information card
import PaymentInformationCard from '@components/requests/PaymentInformationCard'; // Payment information card
import PersonalInformationCard from '@components/requests/PersonalInformationCard'; // Personal information card
import ReasonForReplacementCard from '@components/requests/ReasonForReplacementCard'; // Reason for replacement card
import ProcessingTasksCard from '@components/requests/ProcessingTasksCard'; // Processing tasks card

type RequestProps = {
  requestId: number;
};

// Individual request page
export default function Request({ requestId }: RequestProps) {
  // QUERIES
  const { data: applicationData } = useQuery(GET_APPLICATION, {
    variables: { id: requestId },
  });

  // MUTATIONS
  const [updateApplication] = useMutation(UPDATE_APPLICATION, {
    refetchQueries: ['GetApplication'],
  });

  const [approveApplication] = useMutation(APPROVE_APPLICATION, {
    refetchQueries: ['GetApplication'],
  });

  const [rejectApplication] = useMutation(REJECT_APPLICATION, {
    refetchQueries: ['GetApplication'],
  });

  const [completeApplication] = useMutation(COMPLETE_APPLICATION, {
    refetchQueries: ['GetApplication'],
  });

  const [updateApplicationProcessing] = useMutation(UPDATE_APPLICATION_PROCESSING, {
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
    isRenewal,

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
    shippingCountry,
    shippingPostalCode,
    billingFullName,
    billingAddressLine1,
    billingAddressLine2,
    billingCity,
    billingProvince,
    billingCountry,
    billingPostalCode,

    processingFee,
    donationAmount,
    paymentMethod,

    createdAt,

    permit,
    replacement,
    applicationProcessing,
    applicant,
  } = applicationData?.application || {};

  const { rcdPermitId, expiryDate } = permit || {};

  const {
    id: applicationProcessingId,
    status: applicationProcessingStatus,
    appNumber,
    appHolepunched,
    walletCardCreated,
    invoiceNumber,
    documentUrls,
    appMailed,
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

  const paymentInformationData = {
    shippingAddressSameAsHomeAddress,
    billingAddressSameAsHomeAddress,
    shippingFullName,
    shippingAddressLine1,
    shippingAddressLine2,
    shippingCity,
    shippingProvince,
    shippingCountry,
    shippingPostalCode,
    billingFullName,
    billingAddressLine1,
    billingAddressLine2,
    billingCity,
    billingProvince,
    billingCountry,
    billingPostalCode,
    processingFee,
    donationAmount,
    paymentMethod,
  };

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
    completeApplication({ variables: { id: applicationId } });
  };

  // Wrapper function for updateApplication mutation
  const onUpdateApplication = (applicationData: any) => {
    updateApplication({ variables: { input: { id: applicationId, ...applicationData } } });
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
        // TODO: Make this actually upload a file
        updateApplicationProcessing({
          variables: {
            input: { id: applicationProcessingId, documentUrl: 'documentUrl' /* taskArgs */ },
          },
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
    appNumber !== null &&
    appHolepunched &&
    walletCardCreated &&
    invoiceNumber !== null &&
    documentUrls?.length &&
    appMailed;

  return (
    <Layout>
      {applicationData?.application && (
        <>
          <GridItem rowSpan={1} colSpan={12} marginTop={3}>
            <RequestHeader
              isRenewal={isRenewal}
              applicationStatus={applicationProcessingStatus}
              createdAt={new Date(createdAt).toDateString()}
              onApprove={onApprove}
              onReject={onReject}
              onComplete={onComplete}
              allStepsCompleted={allStepsCompleted}
            />
          </GridItem>
          <GridItem rowSpan={12} colSpan={5} marginTop={5} textAlign="left">
            <PersonalInformationCard
              applicant={applicantData}
              expirationDate={new Date(expiryDate).toDateString()}
              mostRecentAPP={rcdPermitId}
              handleName={() => {}}
              handleSave={onUpdateApplication}
            />
          </GridItem>
          <GridItem rowSpan={12} colSpan={7} marginTop={5} textAlign="left">
            <Stack spacing={5}>
              {applicationProcessingStatus === ApplicationStatus.Approved ? (
                <ProcessingTasksCard
                  applicationProcessingData={applicationProcessing}
                  onTaskComplete={onTaskComplete}
                />
              ) : isRenewal ? (
                <DoctorInformationCard physician={physicianData} handleSave={onUpdateApplication} />
              ) : (
                <ReasonForReplacementCard
                  replacement={replacement}
                  isUpdated={replacement?.isUpdated}
                />
              )}
              <PaymentInformationCard
                paymentInformation={paymentInformationData}
                handleSave={onUpdateApplication}
              />
            </Stack>
          </GridItem>
        </>
      )}
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
