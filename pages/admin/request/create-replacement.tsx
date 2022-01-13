import { useState, SyntheticEvent } from 'react'; // React
import { GetServerSideProps } from 'next';
import Link from 'next/link'; // Link component
import { getSession } from 'next-auth/client'; // Session management
import { authorize } from '@tools/authorization'; // Page authorization
import {
  Text,
  Box,
  Flex,
  Stack,
  Button,
  GridItem,
  useToast,
  HStack,
  Spacer,
} from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/admin/Layout'; // Layout component
import PermitHolderInformationForm from '@components/admin/requests/applicant-information/Form'; //Permit holder information form
import { PermitHolderInformation } from '@tools/admin/requests/permit-holder-information';
import { PaymentInformation } from '@tools/admin/requests/payment-information';
import PaymentDetailsForm from '@components/admin/requests/payment-information/Form'; //Payment details form
import { ReasonForReplacement } from '@tools/admin/requests/reason-for-replacement';
import ReasonForReplacementForm from '@components/admin/requests/reason-for-replacement/Form';
import CancelCreateRequestModal from '@components/admin/requests/create/CancelModal';
import PermitHolderTypeahead from '@components/admin/permit-holders/Typeahead';
import { PermitHolder } from '@tools/admin/permit-holders/graphql/get-permit-holders'; // Permit holders GQL query}
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  GET_APPLICANT_REPLACEMENT_QUERY,
  GetApplicantReplacementRequest,
  GetApplicantReplacementResponse,
} from '@tools/admin/requests/graphql/create/get-replacement-applicant';
import { RequestFlowPageState } from '@tools/admin/requests/types';
import {
  CREATE_REPLACEMENT_APPLICATION_MUTATION,
  CreateReplacementApplicationRequest,
  CreateReplacementApplicationResponse,
} from '@tools/applicant/replacements';
import { useRouter } from 'next/router'; // Router
import BackToSearchModal from '@components/admin/requests/create/BackToSearchModal';
import SelectedPermitHolderCard from '@components/admin/requests/create/SelectedPermitHolderCard';
import { ApplicantData } from '@tools/admin/permit-holders/types';

export default function CreateReplacement() {
  const [currentPageState, setNewPageState] = useState<RequestFlowPageState>(
    RequestFlowPageState.SelectingPermitHolderPage
  );
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
    receiveEmailUpdates: false,
  });
  const [personalInformationCard, setPermitInformationCard] = useState<ApplicantData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    rcdUserId: 0,
    id: 0,
    dateOfBirth: '',
    status: ApplicantStatus.Active,
    gender: Gender.Other,
    province: Province.On,
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

  const [paymentDetails, setPaymentDetails] = useState<PaymentInformation>({
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

  const [getApplicant, { loading: getApplicantLoading }] = useLazyQuery<
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
        receiveEmailUpdates: false,
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
      setPermitInformationCard({
        id: +applicant.id,
        rcdUserId: applicant.rcdUserId || 0,
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        gender: applicant.gender,
        dateOfBirth: applicant.dateOfBirth,
        email: applicant.email,
        phone: applicant.phone,
        province: applicant.province,
        city: applicant.city,
        addressLine1: applicant.addressLine1,
        addressLine2: applicant.addressLine2,
        status: applicant.status,
        postalCode: applicant.postalCode,
      });
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
  const [submitReplacementApplication, { loading: submitRequestLoading }] = useMutation<
    CreateReplacementApplicationResponse,
    CreateReplacementApplicationRequest
  >(CREATE_REPLACEMENT_APPLICATION_MUTATION, {
    onCompleted: data => {
      if (data.createReplacementApplication.ok) {
        toast({
          status: 'success',
          description: 'Your application has been submitted!',
          isClosable: true,
        });
        router.push(`/admin/request/${data.createReplacementApplication.applicationId}`);
      }
    },
    onError: error => {
      toast({
        status: 'error',
        description: error.message,
        isClosable: true,
      });
    },
  });

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (applicantId === undefined) {
      toast({
        status: 'error',
        description: 'You must select a permit holder for a Replacement Request.',
        isClosable: true,
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
        {currentPageState == RequestFlowPageState.SelectingPermitHolderPage && (
          <>
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
            <GridItem paddingTop="32px">
              {(applicantId !== undefined || getApplicantLoading) && (
                <SelectedPermitHolderCard
                  applicant={personalInformationCard}
                  loading={getApplicantLoading}
                />
              )}
            </GridItem>
          </>
        )}

        {applicantId !== undefined &&
          currentPageState == RequestFlowPageState.SubmittingRequestPage && (
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
                    type="replacement"
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
                    <Button
                      bg="background.gray"
                      _hover={{ bg: 'background.grayHover' }}
                      marginRight="20px"
                      height="48px"
                      width="180px"
                      isDisabled={submitRequestLoading}
                    >
                      <BackToSearchModal
                        onGoBack={() => {
                          setApplicantID(undefined);
                          setPermitHolderID(undefined);
                          setNewPageState(RequestFlowPageState.SelectingPermitHolderPage);
                        }}
                      >
                        <Text textStyle="button-semibold" color="text.default">
                          Back to search
                        </Text>
                      </BackToSearchModal>
                    </Button>
                  </Box>
                  <Box>
                    <Stack direction="row" justifyContent="space-between">
                      <CancelCreateRequestModal type="replacement">
                        <Button
                          bg="secondary.critical"
                          _hover={{ bg: 'secondary.criticalHover' }}
                          marginRight="20px"
                          height="48px"
                          width="188px"
                          isDisabled={submitRequestLoading}
                        >
                          <Text textStyle="button-semibold">Discard request</Text>
                        </Button>
                      </CancelCreateRequestModal>
                      <Button
                        bg="primary"
                        height="48px"
                        width="180px"
                        type="submit"
                        isLoading={submitRequestLoading}
                      >
                        <Text textStyle="button-semibold">Create request</Text>
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </form>
          )}
        {/* Footer on Permit Search*/}
        {currentPageState == RequestFlowPageState.SelectingPermitHolderPage && (
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
            <HStack alignItems="right">
              <Spacer />
              <Box>
                <Stack direction="row" justifyContent="space-between">
                  <Link href={`/admin`}>
                    <a>
                      <Button
                        bg="background.gray"
                        _hover={{ bg: 'background.grayHover' }}
                        marginRight="20px"
                        height="48px"
                        width="149px"
                      >
                        <Text textStyle="button-semibold" color="text.default">
                          Cancel
                        </Text>
                      </Button>
                    </a>
                  </Link>
                  <Link href="#">
                    <a>
                      <Button
                        bg="primary"
                        height="48px"
                        width="217px"
                        type="submit"
                        isDisabled={applicantId == undefined}
                        onClick={() => setNewPageState(RequestFlowPageState.SubmittingRequestPage)}
                      >
                        <Text textStyle="button-semibold">Proceed to request</Text>
                      </Button>
                    </a>
                  </Link>
                </Stack>
              </Box>
            </HStack>
          </Box>
        )}
      </GridItem>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  // Only secretaries and admins can access APP requests
  if (authorize(session, ['SECRETARY'])) {
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
