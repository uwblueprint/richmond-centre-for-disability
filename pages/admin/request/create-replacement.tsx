import { useState, SyntheticEvent } from 'react'; // React
import { GetServerSideProps } from 'next';
import Link from 'next/link'; // Link component
import { getSession } from 'next-auth/client'; // Session management
import { authorize } from '@tools/authorization'; // Page authorization
import { Text, Box, Flex, Stack, Button, GridItem, useToast } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/admin/Layout'; // Layout component
import PermitHolderInformationForm from '@components/admin/requests/forms/PermitHolderInformationForm'; //Permit holder information form
import {
  PaymentDetails,
  PermitHolderInformation,
} from '@tools/components/admin/requests/forms/types'; //Permit holder information type
import PaymentDetailsForm from '@components/admin/requests/forms/PaymentDetailsForm'; //Payment details form
import { PaymentType, Province, Role } from '@lib/graphql/types'; //GraphQL types
import { ReasonForReplacement } from '@tools/components/admin/requests/forms/types';
import { ReasonForReplacement as ReasonForReplacementEnum } from '@lib/graphql/types'; // Reason For Replacement Enum
import ReasonForReplacementForm from '@components/admin/requests/forms/ReasonForReplacementForm';
import CancelCreateRequestModal from '@components/admin/requests/modals/CancelCreateRequestModal';
import PermitHolderTypeahead from '@components/admin/permit-holders/PermitHolderTypeahead';
import { PermitHolder } from '@tools/pages/admin/permit-holders/get-permit-holders'; // Permit holders GQL query}
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_APPLICANT_REPLACEMENT_QUERY } from '@tools/pages/admin/requests/queries';
import {
  GetApplicantReplacementRequest,
  GetApplicantReplacementResponse,
} from '@tools/pages/admin/requests/types';
import {
  CREATE_REPLACEMENT_APPLICATION_MUTATION,
  CreateReplacementApplicationRequest,
  CreateReplacementApplicationResponse,
} from '@tools/pages/applicant/replacements';
import { useRouter } from 'next/router'; // Router

export default function CreateReplacement() {
  const [applicantId, setApplicantID] = useState<number | undefined>(undefined);
  const [permitHolderID, setPermitHolderID] = useState<number | undefined>(undefined);
  const [permitHolderInformation, setPermitHolderInformation] = useState<PermitHolderInformation>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
  });

  const [reasonDetails, setReason] = useState<ReasonForReplacement>({
    reason: ReasonForReplacementEnum.Other,
    lostTimestamp: null,
    lostLocation: null,
    description: null,
    stolenJurisdiction: null,
    stolenPoliceFileNumber: null,
    stolenPoliceOfficerName: null,
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    paymentMethod: PaymentType.Mastercard,
    donationAmount: 25,
    shippingAddressSameAsHomeAddress: false,
    shippingFullName: '',
    shippingAddressLine1: '',
    shippingAddressLine2: '',
    shippingCity: '',
    shippingProvince: Province.Bc,
    shippingPostalCode: '',
    billingAddressSameAsHomeAddress: false,
    billingFullName: '',
    billingAddressLine1: '',
    billingAddressLine2: '',
    billingCity: '',
    billingProvince: Province.Bc,
    billingPostalCode: '',
  });

  const toast = useToast();
  const router = useRouter();

  const [getApplicant] = useLazyQuery<
    GetApplicantReplacementResponse,
    GetApplicantReplacementRequest
  >(GET_APPLICANT_REPLACEMENT_QUERY, {
    onCompleted: ({ applicant }) => {
      setPermitHolderInformation({
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        email: applicant.email,
        phone: applicant.phone,
        addressLine1: applicant.addressLine1,
        addressLine2: applicant.addressLine2,
        city: applicant.city,
        postalCode: applicant.postalCode,
      });

      const lastApplication = applicant.mostRecentApplication;
      if (lastApplication) {
        setPaymentDetails({
          ...paymentDetails,
          shippingAddressSameAsHomeAddress: lastApplication.shippingAddressSameAsHomeAddress,
          shippingFullName: lastApplication.shippingFullName,
          shippingAddressLine1: lastApplication.shippingAddressLine1,
          shippingAddressLine2: lastApplication.shippingAddressLine2,
          shippingCity: lastApplication.shippingCity,
          shippingProvince: lastApplication.shippingProvince,
          shippingPostalCode: lastApplication.shippingPostalCode,
        });
      }

      setPermitHolderID(applicant.rcdUserId || 0);
      setApplicantID(+applicant.id);
    },
  });

  const handleSelectPermitHolder = (permitHolder: PermitHolder | undefined) => {
    if (permitHolder && permitHolder.id) {
      getApplicant({ variables: { id: permitHolder.id } });
    }
  };

  // Submit application mutation
  const [submitReplacementApplication, { loading }] = useMutation<
    CreateReplacementApplicationResponse,
    CreateReplacementApplicationRequest
  >(CREATE_REPLACEMENT_APPLICATION_MUTATION, {
    onCompleted: data => {
      if (data.createReplacementApplication.ok) {
        toast({
          status: 'success',
          description: 'Your application has been submitted!',
        });
        router.push(`/admin/request/${data.createReplacementApplication.applicationId}`);
      }
    },
    onError: error => {
      toast({
        status: 'error',
        description: error.message,
      });
    },
  });

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (applicantId === undefined) {
      toast({
        status: 'error',
        description: 'You must select a permit holder for a Replacement Request.',
      });
      return;
    }
    await submitReplacementApplication({
      variables: {
        input: {
          applicantId,
          firstName: permitHolderInformation.firstName,
          lastName: permitHolderInformation.lastName,
          phone: permitHolderInformation.phone,
          email: permitHolderInformation.email,
          addressLine1: permitHolderInformation.addressLine1,
          addressLine2: permitHolderInformation.addressLine2,
          city: permitHolderInformation.city,
          postalCode: permitHolderInformation.postalCode,
          reason: reasonDetails.reason,
          lostTimestamp: reasonDetails.lostTimestamp,
          lostLocation: reasonDetails.lostLocation || '',
          description: reasonDetails.description || '',
          paymentMethod: paymentDetails.paymentMethod,
          donationAmount: paymentDetails.donationAmount,
          shippingAddressSameAsHomeAddress: paymentDetails.shippingAddressSameAsHomeAddress,
          shippingFullName: paymentDetails.shippingFullName,
          shippingAddressLine1: paymentDetails.shippingAddressLine1,
          shippingAddressLine2: paymentDetails.shippingAddressLine2,
          shippingCity: paymentDetails.shippingCity,
          shippingProvince: paymentDetails.shippingProvince,
          shippingPostalCode: paymentDetails.shippingPostalCode,
          billingAddressSameAsHomeAddress: paymentDetails.billingAddressSameAsHomeAddress,
          billingFullName: paymentDetails.billingFullName,
          billingAddressLine1: paymentDetails.billingAddressLine1,
          billingAddressLine2: paymentDetails.billingAddressLine2,
          billingCity: paymentDetails.billingCity,
          billingProvince: paymentDetails.billingProvince,
          billingPostalCode: paymentDetails.billingPostalCode,
        },
      },
    });
  };

  return (
    <Layout>
      <GridItem display="flex" flexDirection="column" colSpan={12} paddingX="108px">
        <Flex>
          <Text textStyle="display-large">
            {`New Replacement Request`}
            {applicantId !== undefined && (
              <>
                {` (User ID: `}
                <Box as="span" color="primary">
                  <Link href={`/admin/permit-holder/${applicantId}`}>
                    <a>{permitHolderID}</a>
                  </Link>
                </Box>
                {`)`}
              </>
            )}
          </Text>
        </Flex>
        {/* Typeahead component */}
        <GridItem paddingTop="32px">
          <Box
            border="1px solid"
            borderColor="border.secondary"
            borderRadius="12px"
            bgColor="white"
            paddingTop="32px"
            paddingBottom="40px"
            paddingX="40px"
            align="left"
          >
            <Text textStyle="display-small-semibold" paddingBottom="20px">
              {`Search Permit Holder`}
            </Text>
            <PermitHolderTypeahead onSelect={handleSelectPermitHolder} />
          </Box>
        </GridItem>

        {applicantId !== undefined && (
          <form onSubmit={handleSubmit}>
            {/* Permit Holder Information Form */}
            <GridItem paddingTop="32px">
              <Box
                border="1px solid"
                borderColor="border.secondary"
                borderRadius="12px"
                bgColor="white"
                paddingTop="32px"
                paddingBottom="40px"
                paddingX="40px"
                align="left"
              >
                <Text textStyle="display-small-semibold" paddingBottom="20px">
                  {`Permit Holder's Information`}
                </Text>
                <PermitHolderInformationForm
                  permitHolderInformation={permitHolderInformation}
                  onChange={setPermitHolderInformation}
                />
              </Box>
            </GridItem>
            {/* Reason For Replacement Form */}
            <GridItem paddingTop="32px">
              <Box
                border="1px solid"
                borderColor="border.secondary"
                borderRadius="12px"
                bgColor="white"
                paddingTop="32px"
                paddingBottom="40px"
                paddingX="40px"
                align="left"
              >
                <Text textStyle="display-small-semibold" paddingBottom="20px">
                  {`Reason for Replacement`}
                </Text>
                <ReasonForReplacementForm
                  reasonForReplacement={reasonDetails}
                  onChange={setReason}
                />
              </Box>
            </GridItem>
            {/* Payment Details Form */}
            <GridItem paddingTop="32px" paddingBottom="68px">
              <Box
                border="1px solid"
                borderColor="border.secondary"
                borderRadius="12px"
                bgColor="white"
                paddingTop="32px"
                paddingBottom="40px"
                paddingX="40px"
                align="left"
              >
                <Text textStyle="display-small-semibold" paddingBottom="20px">
                  {`Payment, Shipping, and Billing Information`}
                </Text>
                <PaymentDetailsForm
                  paymentInformation={paymentDetails}
                  onChange={setPaymentDetails}
                />
              </Box>
            </GridItem>
            {/* Footer */}
            <Box
              position="fixed"
              left="0"
              bottom="0"
              right="0"
              paddingY="20px"
              paddingX="188px"
              bgColor="white"
              boxShadow="dark-lg"
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Text textStyle="body-bold">
                    User ID:{' '}
                    <Box as="span" color="primary">
                      <Link href={`/admin/permit-holder/${applicantId}`}>
                        <a>{permitHolderID}</a>
                      </Link>
                    </Box>
                  </Text>
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between">
                    <CancelCreateRequestModal type="renewal">
                      <Button
                        bg="secondary.critical"
                        _hover={{ bg: 'secondary.criticalHover' }}
                        marginRight="20px"
                        height="48px"
                        width="149px"
                      >
                        <Text textStyle="button-semibold">Discard request</Text>
                      </Button>
                    </CancelCreateRequestModal>
                    <Link href="#">
                      <Button
                        bg="primary"
                        height="48px"
                        width="180px"
                        type="submit"
                        loading={loading}
                      >
                        <Text textStyle="button-semibold">Create request</Text>
                      </Button>
                    </Link>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </form>
        )}
      </GridItem>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  // Only secretaries and admins can access APP requests
  if (authorize(session, [Role.Secretary])) {
    return {
      props: {},
    };
  }

  // Redirect to login if roles requirement not satisfied
  return {
    redirect: {
      destination: '/admin/login',
      permanent: false,
    },
  };
};
