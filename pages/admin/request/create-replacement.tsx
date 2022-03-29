import { useState } from 'react'; // React
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
import PermitHolderInformationForm from '@components/admin/requests/permit-holder-information/Form'; //Permit holder information form
import {
  GetSelectedApplicantRequest,
  GetSelectedApplicantResponse,
  GET_SELECTED_APPLICANT_QUERY,
  PermitHolderFormData,
} from '@tools/admin/requests/permit-holder-information';
import { PaymentInformationFormData } from '@tools/admin/requests/payment-information';
import PaymentDetailsForm from '@components/admin/requests/payment-information/Form'; //Payment details form
import { ReasonForReplacementFormData } from '@tools/admin/requests/reason-for-replacement';
import ReasonForReplacementForm from '@components/admin/requests/reason-for-replacement/Form';
import CancelCreateRequestModal from '@components/admin/requests/create/CancelModal';
import PermitHolderTypeahead from '@components/admin/permit-holders/Typeahead';
import { useLazyQuery, useMutation } from '@apollo/client';
import { RequestFlowPageState } from '@tools/admin/requests/types';
import {
  CREATE_REPLACEMENT_APPLICATION_MUTATION,
  CreateReplacementApplicationRequest,
  CreateReplacementApplicationResponse,
} from '@tools/admin/requests/create-replacement';
import { useRouter } from 'next/router'; // Router
import BackToSearchModal from '@components/admin/requests/create/BackToSearchModal';
import SelectedPermitHolderCard from '@components/admin/requests/create/SelectedPermitHolderCard';
import { ApplicantFormData } from '@tools/admin/permit-holders/permit-holder-information';
import { Form, Formik } from 'formik';
import { replacementFormSchema as replacementRequestFormSchema } from '@lib/applications/validation';

export default function CreateReplacement() {
  const [currentPageState, setNewPageState] = useState<RequestFlowPageState>(
    RequestFlowPageState.SelectingPermitHolderPage
  );
  const [applicantId, setApplicantId] = useState<number | null>(null);

  /** Permit holder information section */
  const [permitHolderInformation, setPermitHolderInformation] = useState<
    Omit<ApplicantFormData, 'dateOfBirth' | 'gender' | 'receiveEmailUpdates'>
  >({
    firstName: '',
    middleName: null,
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: null,
    city: '',
    postalCode: '',
  });

  /** Reason for replacement section */
  const [reasonForReplacement, setReasonForReplacement] = useState<ReasonForReplacementFormData>({
    reason: null,
    lostTimestamp: null,
    lostLocation: null,
    stolenJurisdiction: null,
    stolenPoliceOfficerName: null,
    stolenPoliceFileNumber: null,
    eventDescription: null,
  });

  /** Payment information section */
  const initialPaymentInformation: PaymentInformationFormData = {
    paymentMethod: null,
    donationAmount: '',
    shippingAddressSameAsHomeAddress: false,
    shippingFullName: '',
    shippingAddressLine1: '',
    shippingAddressLine2: null,
    shippingCity: '',
    shippingProvince: 'BC',
    shippingCountry: '',
    shippingPostalCode: '',
    billingAddressSameAsHomeAddress: false,
    billingFullName: '',
    billingAddressLine1: '',
    billingAddressLine2: null,
    billingCity: '',
    billingProvince: 'BC',
    billingCountry: '',
    billingPostalCode: '',
  };

  const toast = useToast();
  const router = useRouter();

  // Get applicant autofill information
  const [getApplicant] = useLazyQuery<GetSelectedApplicantResponse, GetSelectedApplicantRequest>(
    GET_SELECTED_APPLICANT_QUERY,
    {
      onCompleted: data => {
        if (data) {
          const {
            firstName,
            middleName,
            lastName,
            email,
            phone,
            addressLine1,
            addressLine2,
            city,
            postalCode,
          } = data.applicant;
          setPermitHolderInformation({
            firstName,
            middleName,
            lastName,
            email,
            phone,
            addressLine1,
            addressLine2,
            city,
            postalCode,
          });
        }
      },
    }
  );

  /** Update selected permit holder data on selecting option */
  const handleSelectPermitHolder = (applicantId: number) => {
    setApplicantId(applicantId);
    getApplicant({ variables: { id: applicantId } });
  };

  // Submit application mutation
  const [submitReplacementApplication, { loading: submitRequestLoading }] = useMutation<
    CreateReplacementApplicationResponse,
    CreateReplacementApplicationRequest
  >(CREATE_REPLACEMENT_APPLICATION_MUTATION, {
    onCompleted: data => {
      if (data) {
        const { ok, applicationId } = data.createReplacementApplication;
        if (ok) {
          toast({
            status: 'success',
            description: 'Your application has been submitted!',
            isClosable: true,
          });

          if (applicationId) {
            router.push(`/admin/request/${data.createReplacementApplication.applicationId}`);
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

  /** Handle replacement application submission */
  const handleSubmit = async (values: {
    permitHolder: PermitHolderFormData;
    paymentInformation: PaymentInformationFormData;
  }) => {
    if (applicantId === null) {
      toast({
        status: 'error',
        description: 'You must select a permit holder for a Replacement Request.',
        isClosable: true,
      });
      return;
    }

    if (!reasonForReplacement.reason) {
      toast({ status: 'error', description: 'Missing reason for replacement', isClosable: true });
      return;
    }

    if (!values.paymentInformation.paymentMethod) {
      toast({ status: 'error', description: 'Missing payment method', isClosable: true });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type, receiveEmailUpdates, ...permitHolder } = values.permitHolder;

    await submitReplacementApplication({
      variables: {
        input: {
          applicantId,
          ...permitHolder,
          ...reasonForReplacement,
          reason: reasonForReplacement.reason,
          ...values.paymentInformation,
          paymentMethod: values.paymentInformation.paymentMethod,
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
            {applicantId && (
              <>
                {` (User ID: `}
                <Box as="span" color="primary">
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

        {applicantId && currentPageState == RequestFlowPageState.SubmittingRequestPage && (
          <Formik
            initialValues={{
              permitHolder: {
                ...permitHolderInformation,
                type: 'REPLACEMENT',
                receiveEmailUpdates: false,
              },
              paymentInformation: { ...initialPaymentInformation },
            }}
            validationSchema={replacementRequestFormSchema}
            onSubmit={handleSubmit}
          >
            {({ values, isValid }) => (
              <Form noValidate>
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
                      permitHolderInformation={{
                        ...values.permitHolder,
                        type: 'REPLACEMENT',
                        receiveEmailUpdates: false,
                      }}
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
                      reasonForReplacement={reasonForReplacement}
                      onChange={setReasonForReplacement}
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
                    <PaymentDetailsForm paymentInformation={values.paymentInformation} />
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
                        <CancelCreateRequestModal type="REPLACEMENT">
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
                          isDisabled={submitRequestLoading || !isValid}
                        >
                          <Text textStyle="button-semibold">Create request</Text>
                        </Button>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Form>
            )}
          </Formik>
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
