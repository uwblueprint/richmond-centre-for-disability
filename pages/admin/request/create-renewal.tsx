import Layout from '@components/admin/Layout'; // Layout component
import { Text, Box, Flex, Stack, Button, GridItem, useToast } from '@chakra-ui/react'; // Chakra UI
import { useState } from 'react'; // React
import PermitHolderInformationForm from '@components/admin/requests/permit-holder-information/Form'; //Permit holder information form
import DoctorInformationForm from '@components/admin/requests/doctor-information/Form'; //Doctor information form
import AdditionalQuestionsForm from '@components/admin/requests/additional-questions/Form'; //Additional questions form
import PaymentDetailsForm from '@components/admin/requests/payment-information/Form'; //Payment details form
import { PaymentInformationFormData } from '@tools/admin/requests/payment-information';
import Link from 'next/link'; // Link
import { authorize } from '@tools/authorization';
import { getSession } from 'next-auth/client';
import { GetServerSideProps } from 'next';
import CancelCreateRequestModal from '@components/admin/requests/create/CancelModal';
import PermitHolderTypeahead from '@components/admin/permit-holders/Typeahead';
import { useLazyQuery, useMutation } from '@tools/hooks/graphql';
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
import { Form, Formik } from 'formik';
import { PermitHolderFormData } from '@tools/admin/requests/permit-holder-information';
import { renewalRequestFormSchema } from '@lib/applications/validation';
import {
  INITIAL_ADDITIONAL_QUESTIONS,
  INITIAL_PAYMENT_DETAILS,
} from '@tools/admin/requests/create-new';
import { AdditionalInformationFormData } from '@tools/admin/requests/additional-questions';
import { RequiresWiderParkingSpaceReason } from '@prisma/client';
import ValidationErrorAlert from '@components/form/ValidationErrorAlert';

export default function CreateRenewal() {
  const [currentPageState, setNewPageState] = useState<RequestFlowPageState>(
    RequestFlowPageState.SelectingPermitHolderPage
  );
  const [applicantId, setApplicantId] = useState<number | null>(null);

  /**  Backend form validation error */
  const [error, setError] = useState<string>('');

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
    mspNumber: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
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
        const { ok, applicationId, error } = data.createRenewalApplication;
        if (ok) {
          toast({
            status: 'success',
            description: 'Renewal application has been submitted!',
            isClosable: true,
          });

          if (applicationId) {
            router.push(`/admin/request/${data.createRenewalApplication.applicationId}`);
          }
        } else {
          setError(error ?? '');
        }
      }
    },
  });

  /**
   * Handle renewal request submission
   */
  const handleSubmit = async (values: {
    permitHolder: PermitHolderFormData;
    doctorInformation: DoctorFormData;
    additionalInformation: AdditionalInformationFormData;
    paymentInformation: PaymentInformationFormData;
  }) => {
    if (!applicantId) {
      toast({
        status: 'error',
        description: 'You must select a permit holder for a Renewal Request.',
        isClosable: true,
      });
      return;
    }

    const validatedValues = await renewalRequestFormSchema.validate(values);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type, ...permitHolder } = values.permitHolder;
    const additionalInformation = validatedValues.additionalInformation;

    await submitRenewalApplication({
      variables: {
        input: {
          applicantId,
          ...permitHolder,
          physicianFirstName: doctorInformation.firstName,
          physicianLastName: doctorInformation.lastName,
          physicianMspNumber: doctorInformation.mspNumber,
          physicianPhone: doctorInformation.phone,
          physicianAddressLine1: doctorInformation.addressLine1,
          physicianAddressLine2: doctorInformation.addressLine2,
          physicianCity: doctorInformation.city,
          physicianPostalCode: doctorInformation.postalCode,

          ...additionalInformation,
          accessibleConvertedVanLoadingMethod: additionalInformation.usesAccessibleConvertedVan
            ? additionalInformation.accessibleConvertedVanLoadingMethod
            : null,
          requiresWiderParkingSpaceReason: additionalInformation.requiresWiderParkingSpace
            ? additionalInformation.requiresWiderParkingSpaceReason
            : null,
          otherRequiresWiderParkingSpaceReason:
            additionalInformation.requiresWiderParkingSpace &&
            additionalInformation.requiresWiderParkingSpaceReason ===
              RequiresWiderParkingSpaceReason.OTHER
              ? additionalInformation.otherRequiresWiderParkingSpaceReason
              : null,

          ...validatedValues.paymentInformation,
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
                  <Link href={`/admin/permit-holder/${applicantId}`}>
                    <a target="_blank" rel="noopener noreferrer">
                      {applicantId}
                    </a>
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
          <Formik
            initialValues={{
              permitHolder: {
                ...permitHolderInformation,
                type: 'RENEWAL',
              },
              doctorInformation,
              additionalInformation: INITIAL_ADDITIONAL_QUESTIONS,
              paymentInformation: INITIAL_PAYMENT_DETAILS,
            }}
            validationSchema={renewalRequestFormSchema}
            onSubmit={handleSubmit}
          >
            {({ values, isValid }) => (
              <Form noValidate>
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
                      permitHolderInformation={{ ...values.permitHolder, type: 'RENEWAL' }}
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
                    <DoctorInformationForm />
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
                    <AdditionalQuestionsForm additionalInformation={values.additionalInformation} />
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
                  <ValidationErrorAlert error={error} />
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
                        <CancelCreateRequestModal type="RENEWAL">
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
