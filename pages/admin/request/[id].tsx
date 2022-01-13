import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { GridItem, Stack } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/admin/Layout'; // Layout component
import RequestHeader from '@components/admin/requests/Header'; // Request header
import DoctorInformationCard from '@components/admin/requests/doctor-information/Card'; // Doctor information card
import PaymentInformationCard from '@components/admin/requests/payment-information/Card'; // Payment information card
import PersonalInformationCard from '@components/admin/requests/permit-holder-information/Card'; // Personal information card
import ProcessingTasksCard from '@components/admin/requests/processing/TasksCard'; // Processing tasks card
import { UpdateApplicationInput } from '@lib/graphql/types'; // Enum types
import { authorize } from '@tools/authorization'; // Page authorization
import { useQuery, useMutation } from '@apollo/client'; // Apollo Client hooks
import {
  GET_APPLICATION_QUERY,
  GetApplicationRequest,
  GetApplicationResponse,
} from '@tools/admin/requests/view-request'; // Request page GraphQL queries
import {
  UPDATE_APPLICATION_MUTATION,
  UpdateApplicationRequest,
  UpdateApplicationResponse,
} from '@tools/admin/requests/graphql/update-application';

import {
  UPDATE_APPLICATION_PROCESSING_MUTATION,
  UpdateApplicationProcessingRequest,
  UpdateApplicationProcessingResponse,
} from '@tools/admin/requests/graphql/update-application-processing';

type Props = {
  readonly id: string;
};

/**
 * View Request page
 * @param id Request ID
 */
export default function Request({ id: idString }: Props) {
  const id = parseInt(idString);

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
  if (!data?.application) {
    return null;
  }

  const {
    firstName,
    middleName,
    lastName,
    phone,
    email,
    addressLine1,
    addressLine2,
    city,
    province,
    country,
    postalCode,
    permitType,
    paymentMethod,
    processingFee,
    donationAmount,
    paidThroughShopify,
    shopifyPaymentStatus,
    shopifyConfirmationNumber,
    shippingAddressSameAsHomeAddress,
    shippingFullName,
    shippingAddressLine1,
    shippingAddressLine2,
    shippingCity,
    shippingProvince,
    shippingCountry,
    shippingPostalCode,
    billingAddressSameAsHomeAddress,
    billingFullName,
    billingAddressLine1,
    billingAddressLine2,
    billingCity,
    billingProvince,
    billingCountry,
    billingPostalCode,
    type,
    createdAt,
    processing: { status },
  } = data.application;

  // Applicant data for Personal Information Card
  const applicantData = {
    id,
    firstName,
    middleName,
    lastName,
    email,
    phone,
    addressLine1,
    addressLine2,
    city,
    province,
    postalCode,
    // TODO: Integrate with most recent APP API
    // mostRecentAppNumber: rcdPermitId,
    // mostRecentAppExpiryDate: new Date(expiryDate),
  };

  // // Physician data for Doctor Information Card
  // const physicianData = {
  //   name: physicianName,
  //   mspNumber: physicianMspNumber,
  //   addressLine1: physicianAddressLine1,
  //   addressLine2: physicianAddressLine2,
  //   city: physicianCity,
  //   province: physicianProvince,
  //   postalCode: physicianPostalCode,
  //   phone: physicianPhone,
  //   notes: physicianNotes,
  // };

  // // Payment data
  // const paymentInformation = {
  //   paymentMethod,
  //   donationAmount,
  //   shippingAddressSameAsHomeAddress,
  //   shippingFullName,
  //   shippingAddressLine1,
  //   shippingAddressLine2,
  //   shippingCity,
  //   shippingProvince,
  //   shippingPostalCode,
  //   billingAddressSameAsHomeAddress,
  //   billingFullName,
  //   billingAddressLine1,
  //   billingAddressLine2,
  //   billingCity,
  //   billingProvince,
  //   billingPostalCode,
  // };

  /**
   * Update application handler
   * @param applicationData Updated application data
   */
  const handleUpdateApplication = (applicationData: Omit<UpdateApplicationInput, 'id'>) => {
    updateApplication({ variables: { input: { id, ...applicationData } } });
  };

  /**
   * Update application processing after task complete/incomplete
   * @param args Additional arguments to pass to mutation
   */
  const onTaskUpdate = (args: Record<string, any>) => {
    updateApplicationProcessing({
      variables: {
        input: {
          applicationId: id,
          ...args,
        },
      },
    });
  };

  // Whether all application processing steps are completed
  // const allStepsCompleted =
  //   applicationProcessing !== null &&
  //   !!(
  //     applicationProcessing.appNumber !== null &&
  //     applicationProcessing.appHolepunched &&
  //     applicationProcessing.walletCardCreated &&
  //     applicationProcessing.invoiceNumber !== null &&
  //     applicationProcessing.documentUrls?.length &&
  //     applicationProcessing.appMailed
  //   );

  return (
    <Layout>
      <GridItem rowSpan={1} colSpan={12} marginTop={3}>
        <RequestHeader
          applicationId={id}
          applicationStatus={status}
          applicationType={type}
          createdAt={new Date(createdAt)}
          allStepsCompleted={false}
        />
      </GridItem>
      <GridItem rowSpan={12} colSpan={5} marginTop={5} textAlign="left">
        <PersonalInformationCard applicationId={id} />
      </GridItem>
      {/* <GridItem rowSpan={12} colSpan={7} marginTop={5} textAlign="left">
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
      </GridItem> */}
    </Layout>
  );
}

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
