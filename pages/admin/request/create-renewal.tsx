import Layout from '@components/admin/Layout'; // Layout component
import { Text, Box, Flex, Stack, Button, GridItem, useToast } from '@chakra-ui/react'; // Chakra UI
import { SyntheticEvent, useState } from 'react'; // React
import PermitHolderInformationForm from '@components/admin/requests/permit-holder-information/Form'; //Permit holder information form
import DoctorInformationForm from '@components/admin/requests/doctor-information/Form'; //Doctor information form
import AdditionalQuestionsForm from '@components/admin/requests/additional-questions/Form'; //Additional questions form
import { AdditionalInformationFormData } from '@tools/admin/requests/additional-questions'; //Additional questions type
import PaymentDetailsForm from '@components/admin/requests/payment-information/Form'; //Payment details form
import { PaymentInformationFormData } from '@tools/admin/requests/payment-information';
import Link from 'next/link'; // Link
import { authorize } from '@tools/authorization';
import { getSession } from 'next-auth/client';
import { GetServerSideProps } from 'next';
import CancelCreateRequestModal from '@components/admin/requests/create/CancelModal';
import PermitHolderTypeahead from '@components/admin/permit-holders/Typeahead';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  CreateRenewalApplicationRequest,
  CreateRenewalApplicationResponse,
  CREATE_RENEWAL_APPLICATION_MUTATION,
} from '@tools/admin/requests/create-renewal';
import { RequestFlowPageState } from '@tools/admin/requests/types';
import { useRouter } from 'next/router';
import BackToSearchModal from '@components/admin/requests/create/BackToSearchModal';
import SelectedPermitHolderCard from '@components/admin/requests/create/SelectedPermitHolderCard';
import { DoctorFormData } from '@tools/admin/requests/doctor-information';
import {
  GetRenewalApplicantRequest,
  GetRenewalApplicantResponse,
  GET_RENEWAL_APPLICANT,
} from '@tools/admin/requests/create-renewal';
import { ApplicantFormData } from '@tools/admin/permit-holders/permit-holder-information';

export default function CreateRenewal() {
  const [currentPageState, setNewPageState] = useState<RequestFlowPageState>(
    RequestFlowPageState.SelectingPermitHolderPage
  );
  const [applicantId, setApplicantId] = useState<number | null>(null);

  /** Permit holder information section */
  const [permitHolderInformation, setPermitHolderInformation] = useState<
    Omit<ApplicantFormData, 'dateOfBirth' | 'gender'> & { receiveEmailUpdates: boolean }
  >({
    firstName: '',
    middleName: null,
    lastName: '',
    email: '',
    phone: '',
    receiveEmailUpdates: false,
    addressLine1: '',
    addressLine2: null,
    city: '',
    postalCode: '',
  });

  /** Doctor information section */
  const [doctorInformation, setDoctorInformation] = useState<DoctorFormData>({
    firstName: '',
    lastName: '',
    mspNumber: null,
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
  });

  /** Additional information section */
  const [additionalInformation, setAdditionalInformation] = useState<AdditionalInformationFormData>(
    {
      usesAccessibleConvertedVan: false,
      accessibleConvertedVanLoadingMethod: null,
      requiresWiderParkingSpace: false,
      requiresWiderParkingSpaceReason: null,
      otherRequiresWiderParkingSpaceReason: null,
    }
  );

  /** Payment information section */
  const [paymentInformation, setPaymentInformation] = useState<PaymentInformationFormData>({
    paymentMethod: null,
    donationAmount: '',
    shippingAddressSameAsHomeAddress: false,
    shippingFullName: '',
    shippingAddressLine1: '',
    shippingAddressLine2: '',
    shippingCity: '',
    shippingProvince: 'BC',
    shippingCountry: '',
    shippingPostalCode: '',
    billingAddressSameAsHomeAddress: false,
    billingFullName: '',
    billingAddressLine1: '',
    billingAddressLine2: '',
    billingCity: '',
    billingProvince: 'BC',
    billingCountry: '',
    billingPostalCode: '',
  });

  // Toast message
  const toast = useToast();

  // Router
  const router = useRouter();

  /**
   * Get information about applicant to pre-populate form
   */
  const [getApplicant] = useLazyQuery<GetRenewalApplicantResponse, GetRenewalApplicantRequest>(
    GET_RENEWAL_APPLICANT,
    {
      onCompleted: data => {
        if (data) {
          const {
            firstName,
            middleName,
            lastName,
            email,
            phone,
            receiveEmailUpdates,
            addressLine1,
            addressLine2,
            city,
            postalCode,
            medicalInformation: { physician },
          } = data.applicant;
          setPermitHolderInformation({
            firstName,
            middleName,
            lastName,
            email,
            phone,
            receiveEmailUpdates,
            addressLine1,
            addressLine2,
            city,
            postalCode,
          });
          setDoctorInformation({
            firstName: physician.firstName,
            lastName: physician.lastName,
            mspNumber: physician.mspNumber,
            phone: physician.phone,
            addressLine1: physician.addressLine1,
            addressLine2: physician.addressLine2,
            city: physician.city,
            postalCode: physician.postalCode,
          });
        }
      },
    }
  );

  /**
   * Set and fetch data about applicant when permit holder is selected
   */
  const handleSelectPermitHolder = async (applicantId: number) => {
    setApplicantId(applicantId);
    getApplicant({ variables: { id: applicantId } });
  };

  /**
   * Submit application mutation
   */
  const [submitRenewalApplication, { loading: submitRequestLoading }] = useMutation<
    CreateRenewalApplicationResponse,
    CreateRenewalApplicationRequest
  >(CREATE_RENEWAL_APPLICATION_MUTATION, {
    onCompleted: data => {
      if (data) {
        const { ok, applicationId } = data.createRenewalApplication;
        if (ok) {
          toast({
            status: 'success',
            description: 'Renewal application has been submitted!',
            isClosable: true,
          });

          if (applicationId) {
            router.push(`/admin/request/${data.createRenewalApplication.applicationId}`);
          }
        }
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

  /**
   * Handle renewal request submission
   */
  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (applicantId === null) {
      toast({
        status: 'error',
        description: 'You must select a permit holder for a Renewal Request.',
        isClosable: true,
      });
      return;
    }

    if (doctorInformation.mspNumber === null) {
      toast({ status: 'error', description: 'Missing physician MSP number', isClosable: true });
      return;
    }

    if (paymentInformation.paymentMethod === null) {
      toast({ status: 'error', description: 'Missing payment method', isClosable: true });
      return;
    }

    await submitRenewalApplication({
      variables: {
        input: {
          applicantId,
          ...permitHolderInformation,
          physicianFirstName: doctorInformation.firstName,
          physicianLastName: doctorInformation.lastName,
          physicianMspNumber: doctorInformation.mspNumber,
          physicianPhone: doctorInformation.phone,
          physicianAddressLine1: doctorInformation.addressLine1,
          physicianAddressLine2: doctorInformation.addressLine2,
          physicianCity: doctorInformation.city,
          physicianPostalCode: doctorInformation.postalCode,
          ...additionalInformation,
          ...paymentInformation,
          paymentMethod: paymentInformation.paymentMethod,
          // TODO: Replace with dynamic values
          paidThroughShopify: false,
          shopifyPaymentStatus: null,
          shopifyConfirmationNumber: null,
        },
      },
    });
  };

  return (
    <Layout>
      <GridItem display="flex" flexDirection="column" colSpan={12} paddingX="108px">
        <Flex>
          <Text textStyle="display-large">
            {`New Renewal Request`}
            {applicantId && (
              <>
                {` (User ID: `}
                <Box as="span" color="primary">
                  {/* TODO: make sure we're showing the right id here */}
                  <Link href={`/admin/permit-holder/${applicantId}`}>
                    <a>{applicantId}</a>
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
              {applicantId && <SelectedPermitHolderCard applicantId={applicantId} />}
            </GridItem>
          </>
        )}
        {/* Permit Holder Information Form */}
        {applicantId && currentPageState == RequestFlowPageState.SubmittingRequestPage && (
          <form onSubmit={handleSubmit}>
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
                  permitHolderInformation={{ type: 'RENEWAL', ...permitHolderInformation }}
                  onChange={updatedPermitHolder => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { type, ...permitHolder } = updatedPermitHolder;
                    setPermitHolderInformation(permitHolder);
                  }}
                />
              </Box>
            </GridItem>
            {/* Doctor's Information Form */}
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
                  {`Doctor's Information`}
                </Text>
                <DoctorInformationForm
                  doctorInformation={doctorInformation}
                  onChange={setDoctorInformation}
                />
              </Box>
            </GridItem>
            {/* Additional Quesitons Form */}
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
                  {`Additional Information`}
                </Text>
                <AdditionalQuestionsForm
                  data={additionalInformation}
                  onChange={setAdditionalInformation}
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
                  paymentInformation={paymentInformation}
                  onChange={setPaymentInformation}
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
                        setApplicantId(null);
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
                    <CancelCreateRequestModal type="renewal">
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
        {/* Footer on Permit Searcher Page*/}
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
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box />
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
                        isDisabled={!applicantId}
                        onClick={() => setNewPageState(RequestFlowPageState.SubmittingRequestPage)}
                      >
                        <Text textStyle="button-semibold">Proceed to request</Text>
                      </Button>
                    </a>
                  </Link>
                </Stack>
              </Box>
            </Stack>
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
