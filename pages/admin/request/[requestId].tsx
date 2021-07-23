import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { useState } from 'react'; // React
import { GridItem, Stack } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/internal/Layout'; // Layout component
import { Role } from '@lib/types'; // Role enum
import { authorize } from '@tools/authorization'; // Page authorization

import RequestHeader from '@components/requests/RequestHeader'; // Request header
import DoctorInformationCard from '@components/requests/DoctorInformationCard'; // Doctor information card
import PaymentInformationCard from '@components/requests/PaymentInformationCard'; // Payment information card
import PersonalInformationCard from '@components/requests/PersonalInformationCard'; // Personal information card
import ReasonForReplacementCard from '@components/requests/ReasonForReplacementCard'; // Reason for replacement card
import ProcessingTasksCard from '@components/requests/ProcessingTasksCard'; // Processing tasks card

// TEMPORARY MOCK DATA

// TODO: REMOVE THIS LATER. Need this to pass pipeline b/c mock applicant needs to satisfy the real Applicant type.
/* eslint-disable @typescript-eslint/no-empty-function */
import { Gender, Province, PhysicianStatus, PaymentType } from '@lib/types';

type ApplicationStatus =
  | 'COMPLETED'
  | 'INPROGRESS'
  | 'PENDING'
  | 'REJECTED'
  | 'EXPIRING'
  | 'EXPIRED'
  | 'ACTIVE';
const mockApplication = {
  applicant: {
    id: 1,
    rcdUserId: 1,
    mostRecentAPP: 12345,
    firstName: 'Applicant',
    lastName: 'One',
    gender: Gender.Female,
    dateOfBirth: 1,
    email: 'applicantone@email.com',
    phone: '1234567890',
    province: Province.Bc,
    city: 'Richmond',
    addressLine1: '123 Richmond St.',
    postalCode: 'X0X0X0',
  },
  physician: {
    id: 1,
    mspNumber: 123456789,
    firstName: 'Physician',
    lastName: 'One',
    phone: '1234567890',
    addressLine1: '123 Richmond St.',
    postalCode: 'X0X0X0',
    city: 'Richmond',
    province: Province.Bc,
    status: PhysicianStatus.Active,
  },
  replacement: {
    // Data will be queried from replacements table using relation from Application - Replacement
    cause: 'Stolen by goose',
    timestamp: new Date().toDateString(),
    locationLost: 'Waterloo, ON',
    description: 'A goose stole it from my wallet.',
    isUpdated: true,
  },
  createdAt: new Date().toDateString(),
  expirationDate: new Date().toDateString(),
  isRenewal: true,
  applicationStatus: 'PENDING' as ApplicationStatus, // Will be updated in the future as we'll be able to reference ApplicationStatus enum in types.ts
  permitFee: 5,
  donation: 10,
  paymentType: PaymentType.Visa,
  applicationProcessingStepsCompleted: [] as number[], // The format of this will change. For now, 6 steps is complete.
};

// Individual request page
export default function Request() {
  const [application, setApplication] = useState(mockApplication);

  const {
    applicant,
    physician,
    replacement,
    createdAt,
    expirationDate,
    isRenewal,
    applicationStatus,
    permitFee,
    donation,
    paymentType,
    applicationProcessingStepsCompleted,
  } = application;

  // Approve modal
  const onApprove = () => {
    // TODO: Make mutation call to modify Application's status to ApplicationStatus.INPROGRESS
    setApplication({ ...application, applicationStatus: 'INPROGRESS' });
  };

  // Reject modal
  const onReject = () => {
    // TODO: Make mutation call to modify Application's status to ApplicationStatus.REJECTED
    setApplication({ ...application, applicationStatus: 'REJECTED' });
  };

  // Edit personal information modal
  const onComplete = () => {
    // TODO: Make mutation call to modify Application's status to ApplicationStatus.COMPLETED
    setApplication({ ...application, applicationStatus: 'COMPLETED' });
  };

  // Edit doctor information/reason for replacement modal

  // Edit payment information modal

  // Processing tasks completion handler
  const onTaskComplete = (taskNum: number) => {
    // TODO: Update the appropriate table
    setApplication({
      ...application,
      applicationProcessingStepsCompleted: [...applicationProcessingStepsCompleted, taskNum],
    });
  };

  // Removes the taskNum from the list of completed tasks
  const onTaskUndo = (taskNum: number) => {
    // TODO: Update the appropriate table by NULLing the appropriate columns
    setApplication({
      ...application,
      applicationProcessingStepsCompleted: applicationProcessingStepsCompleted.filter(
        _taskNum => _taskNum !== taskNum
      ),
    });
  };

  const areAllStepsComplete = applicationProcessingStepsCompleted.length === 6;

  return (
    <Layout>
      <GridItem rowSpan={1} colSpan={12} marginTop={16}>
        <RequestHeader
          isRenewal={isRenewal}
          applicationStatus={applicationStatus}
          createdAt={createdAt}
          onApprove={onApprove}
          onReject={onReject}
          onComplete={onComplete}
          areAllStepsComplete={areAllStepsComplete}
        />
      </GridItem>
      <GridItem rowSpan={12} colSpan={5} marginTop={7} textAlign="left">
        <PersonalInformationCard
          applicant={applicant}
          expirationDate={expirationDate}
          mostRecentAPP={applicant.mostRecentAPP}
          handleName={() => {}}
        />
      </GridItem>
      <GridItem rowSpan={12} colSpan={7} marginTop={7} textAlign="left">
        <Stack spacing={5}>
          {applicationStatus === 'INPROGRESS' ? (
            <ProcessingTasksCard
              applicationProcessingStepsCompleted={applicationProcessingStepsCompleted}
              onTaskComplete={onTaskComplete}
              onTaskUndo={onTaskUndo}
            />
          ) : isRenewal ? (
            <DoctorInformationCard physician={physician} />
          ) : (
            <ReasonForReplacementCard
              cause={replacement.cause}
              timestamp={replacement.timestamp}
              locationLost={replacement.locationLost}
              description={replacement.description}
              isUpdated={replacement.isUpdated}
            />
          )}
          <PaymentInformationCard
            permitFee={permitFee}
            donation={donation}
            paymentType={paymentType}
            shippingCountry="Canada"
            shippingAddress={applicant.addressLine1}
            shippingCity={applicant.city}
            shippingProvince={applicant.province}
            shippingPostalCode={applicant.postalCode}
            billingCountry="Canada"
            billingAddress={applicant.addressLine1}
            billingCity={applicant.city}
            billingProvince={applicant.province}
            billingPostalCode={applicant.postalCode}
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
    // TODO: get request/application information
    // const requestId = context?.params?.requestId;

    return {
      props: {},
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
