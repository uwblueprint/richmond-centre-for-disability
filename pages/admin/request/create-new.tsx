import { useState, useCallback, SyntheticEvent } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import {
  GridItem,
  Flex,
  Text,
  Box,
  VStack,
  Radio,
  RadioGroup,
  Button,
  Spinner,
  useToast,
  Stack,
} from '@chakra-ui/react';
import { getSession } from 'next-auth/client';
import { useLazyQuery, useMutation } from '@apollo/client';

import Layout from '@components/admin/Layout';
import PermitHolderTypeahead from '@components/admin/permit-holders/Typeahead';
import SelectedPermitHolderCard from '@components/admin/requests/create/SelectedPermitHolderCard';
import PermitHolderInformationForm from '@components/admin/requests/permit-holder-information/Form';
import PhysicianAssessmentForm from '@components/admin/requests/physician-assessment/Form';
import DoctorInformationForm from '@components/admin/requests/doctor-information/Form';
import GuardianInformationForm from '@components/admin/requests/guardian-information/Form';
import AdditionalQuestionsForm from '@components/admin/requests/additional-questions/Form';
import PaymentDetailsForm from '@components/admin/requests/payment-information/Form';
import BackToSearchModal from '@components/admin/requests/create/BackToSearchModal';
import CancelCreateRequestModal from '@components/admin/requests/create/CancelModal';

import { authorize } from '@tools/authorization';
import { PhysicianAssessment } from '@tools/admin/requests/physician-assessment';
import { DoctorFormData } from '@tools/admin/requests/doctor-information';
import { GuardianInformation } from '@tools/admin/requests/guardian-information';
import { RequestFlowPageState } from '@tools/admin/requests/types';
import { PaymentInformationFormData } from '@tools/admin/requests/payment-information';
import { AdditionalInformationFormData } from '@tools/admin/requests/additional-questions';
import { NewApplicationPermitHolderInformation } from '@tools/admin/requests/permit-holder-information';
import {
  CreateNewApplicationRequest,
  CreateNewApplicationResponse,
  CREATE_NEW_APPLICATION_MUTATION,
  GetApplicantNewRequestInfoRequest,
  GetApplicantNewRequestInfoResponse,
  GET_APPLICANT_NEW_REQUEST_INFO_QUERY,
  INITIAL_ADDITIONAL_QUESTIONS,
  INITIAL_DOCTOR_INFORMATION,
  INITIAL_GUARDIAN_INFORMATION,
  INITIAL_PAYMENT_DETAILS,
  INITIAL_PERMIT_HOLDER_INFORMATION,
  INITIAL_PHYSICIAN_ASSESSMENT,
} from '@tools/admin/requests/create-new';
import { useRouter } from 'next/router';
import { formatDateYYYYMMDD } from '@lib/utils/format';

/** Create New APP page */
export default function CreateNew() {
  const [step, setStep] = useState<RequestFlowPageState>(
    RequestFlowPageState.SelectingPermitHolderPage
  );
  const [permitHolderExists, setPermitHolderExists] = useState(true);

  const [applicantId, setApplicantId] = useState<number | null>(null); // RCD user id

  // General information
  const [permitHolderInformation, setPermitHolderInformation] =
    useState<NewApplicationPermitHolderInformation>(INITIAL_PERMIT_HOLDER_INFORMATION);
  // Physician assessment
  const [physicianAssessment, setPhysicianAssessment] = useState<PhysicianAssessment>(
    INITIAL_PHYSICIAN_ASSESSMENT
  );
  // Doctor information
  const [doctorInformation, setDoctorInformation] = useState<DoctorFormData>(
    INITIAL_DOCTOR_INFORMATION
  );
  // Guardian/POA information
  const [guardianInformation, setGuardianInformation] = useState<GuardianInformation>(
    INITIAL_GUARDIAN_INFORMATION
  );
  // Guardian/POA File
  const [guardianPOAFile, setGuardianPOAFile] = useState<File | null>(null);
  // Additional questions
  const [additionalQuestions, setAdditionalQuestions] = useState<AdditionalInformationFormData>(
    INITIAL_ADDITIONAL_QUESTIONS
  );
  // Payment information
  const [paymentDetails, setPaymentDetails] =
    useState<PaymentInformationFormData>(INITIAL_PAYMENT_DETAILS);

  // Toast message
  const toast = useToast();

  // Router
  const router = useRouter();

  // Reset all fields when application is discarded
  const resetAllFields = () => {
    setApplicantId(null);
    setPermitHolderExists(true);
    setPermitHolderInformation(INITIAL_PERMIT_HOLDER_INFORMATION);
    setPhysicianAssessment(INITIAL_PHYSICIAN_ASSESSMENT);
    setDoctorInformation(INITIAL_DOCTOR_INFORMATION);
    setGuardianInformation(INITIAL_GUARDIAN_INFORMATION);
    setGuardianPOAFile(null);
    setAdditionalQuestions(INITIAL_ADDITIONAL_QUESTIONS);
    setPaymentDetails(INITIAL_PAYMENT_DETAILS);
  };

  /**
   * Get information about applicant to pre-populate form
   */
  const [getApplicant, { loading: getApplicantLoading }] = useLazyQuery<
    GetApplicantNewRequestInfoResponse,
    GetApplicantNewRequestInfoRequest
  >(GET_APPLICANT_NEW_REQUEST_INFO_QUERY, {
    fetchPolicy: 'network-only',
    onCompleted: data => {
      if (data) {
        const {
          firstName,
          middleName,
          lastName,
          dateOfBirth,
          gender,
          otherGender,
          phone,
          email,
          receiveEmailUpdates,
          addressLine1,
          addressLine2,
          city,
          postalCode,
          medicalInformation: { physician },
          guardian,
        } = data.applicant;

        // set permitHolderInformation
        setPermitHolderInformation({
          firstName,
          middleName,
          lastName,
          dateOfBirth: formatDateYYYYMMDD(new Date(dateOfBirth)),
          gender,
          otherGender,
          email,
          phone,
          receiveEmailUpdates,
          addressLine1,
          addressLine2,
          city,
          postalCode,
        });

        // set doctorInformation
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

        // set guardianInformation
        if (guardian) {
          setGuardianInformation({
            omitGuardianPoa: false,
            firstName: guardian.firstName,
            middleName: guardian.middleName,
            lastName: guardian.lastName,
            phone: guardian.phone,
            relationship: guardian.relationship,
            addressLine1: guardian.addressLine1,
            addressLine2: guardian.addressLine2,
            city: guardian.city,
            postalCode: guardian.postalCode,
            poaFormUrl: '', //TODO
          });
        } else {
          setGuardianInformation({
            omitGuardianPoa: false,
            firstName: '',
            middleName: '',
            lastName: '',
            phone: '',
            relationship: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            postalCode: '',
            poaFormUrl: '', //TODO
          });
        }
      }
    },
  });

  /**
   * Sets and fetches permit holder data when selected from typeahead
   */
  const handleSelectPermitHolder = useCallback((applicantId: number) => {
    setApplicantId(applicantId);
    getApplicant({
      variables: {
        id: applicantId,
      },
    });
  }, []);

  /**
   * Submit application mutation
   */
  const [submitNewApplication, { loading: submitRequestLoading }] = useMutation<
    CreateNewApplicationResponse,
    CreateNewApplicationRequest
  >(CREATE_NEW_APPLICATION_MUTATION, {
    onCompleted: data => {
      if (data) {
        const { ok, applicationId } = data.createNewApplication;
        if (ok) {
          toast({
            status: 'success',
            description: 'New application has been submitted!',
            isClosable: true,
          });

          if (applicationId) {
            router.push(`/admin/request/${applicationId}`);
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
   * Handle new APP request submission
   */
  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    if (!permitHolderInformation.gender) {
      toast({ status: 'error', description: 'Missing gender', isClosable: true });
      return;
    }

    if (!physicianAssessment.patientCondition) {
      toast({ status: 'error', description: 'Missing patient condition', isClosable: true });
      return;
    }

    if (!physicianAssessment.permitType) {
      toast({ status: 'error', description: 'Missing permit type', isClosable: true });
      return;
    }

    if (additionalQuestions.usesAccessibleConvertedVan === null) {
      toast({
        status: 'error',
        description: 'Missing if patient uses accessible converted van',
        isClosable: true,
      });
      return;
    }

    if (additionalQuestions.requiresWiderParkingSpace === null) {
      toast({
        status: 'error',
        description: 'Missing if patient requires wider parking space',
        isClosable: true,
      });
      return;
    }

    if (!doctorInformation.mspNumber) {
      toast({ status: 'error', description: 'Missing physician MSP number', isClosable: true });
      return;
    }

    if (!paymentDetails.paymentMethod) {
      toast({ status: 'error', description: 'Missing payment method', isClosable: true });
      return;
    }

    await submitNewApplication({
      variables: {
        input: {
          firstName: permitHolderInformation.firstName,
          middleName: permitHolderInformation.middleName,
          lastName: permitHolderInformation.lastName,
          email: permitHolderInformation.email,
          phone: permitHolderInformation.phone,
          receiveEmailUpdates: permitHolderInformation.receiveEmailUpdates,
          addressLine1: permitHolderInformation.addressLine1,
          addressLine2: permitHolderInformation.addressLine2,
          city: permitHolderInformation.city,
          postalCode: permitHolderInformation.postalCode,
          dateOfBirth: permitHolderInformation.dateOfBirth,
          gender: permitHolderInformation.gender,
          otherGender: permitHolderInformation.otherGender,

          ...physicianAssessment,
          patientCondition: physicianAssessment.patientCondition,
          mobilityAids: null, //TODO: get mobility aids when forms are updated to get this data
          permitType: physicianAssessment.permitType,

          physicianFirstName: doctorInformation.firstName,
          physicianLastName: doctorInformation.lastName,
          physicianMspNumber: doctorInformation.mspNumber,
          physicianPhone: doctorInformation.phone,
          physicianAddressLine1: doctorInformation.addressLine1,
          physicianAddressLine2: doctorInformation.addressLine2,
          physicianCity: doctorInformation.city,
          physicianPostalCode: doctorInformation.postalCode,

          omitGuardianPoa: guardianInformation.omitGuardianPoa,
          guardianFirstName: guardianInformation.firstName,
          guardianMiddleName: guardianInformation.middleName,
          guardianLastName: guardianInformation.lastName,
          guardianPhone: guardianInformation.phone,
          guardianRelationship: guardianInformation.relationship,
          guardianAddressLine1: guardianInformation.addressLine1,
          guardianAddressLine2: guardianInformation.addressLine2,
          guardianCity: guardianInformation.city,
          guardianPostalCode: guardianInformation.postalCode,
          poaFormUrl: guardianInformation.poaFormUrl,

          ...additionalQuestions,
          usesAccessibleConvertedVan: additionalQuestions.usesAccessibleConvertedVan,
          requiresWiderParkingSpace: additionalQuestions.requiresWiderParkingSpace,

          ...paymentDetails,
          paymentMethod: paymentDetails.paymentMethod,

          applicantId,
        },
      },
    });
  };

  return (
    <Layout>
      <GridItem display="flex" flexDirection="column" colSpan={12} paddingX="108px">
        {/* Header */}
        <Flex mb="32px">
          <Text as="h1" textStyle="display-large">
            {'New APP Request'}
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

        {/* Select permit holder step */}
        {step === RequestFlowPageState.SelectingPermitHolderPage && (
          <VStack spacing="32px">
            {/* Choose whether to use new/existing permit holder */}
            <Flex
              w="100%"
              flexDir="column"
              alignItems="flex-start"
              p="40px"
              border="1px solid"
              borderColor="border.secondary"
              borderRadius="8px"
              bgColor="white"
            >
              <Text as="h2" mb="20px" textStyle="display-small-semibold" textAlign="left">
                Creating a New APP Request
              </Text>
              <Text as="h3" mb="8px" textStyle="button-semibold" textAlign="left">
                Do you want to search for an existing permit holder or create a new one?
              </Text>
              <RadioGroup
                value={permitHolderExists ? 'search-existing' : 'create-new'}
                onChange={value => {
                  setPermitHolderExists(value === 'search-existing');
                  setApplicantId(null);
                }}
              >
                <VStack alignItems="flex-start">
                  <Radio value="search-existing">Search for an existing permit holder</Radio>
                  <Radio value="create-new">Create a new permit holder</Radio>
                </VStack>
              </RadioGroup>
            </Flex>
            {permitHolderExists ? (
              // Search for existing permit holder
              <>
                <Box
                  w="100%"
                  p="40px"
                  mb="32px"
                  border="1px solid"
                  borderColor="border.secondary"
                  borderRadius="8px"
                  bgColor="white"
                >
                  <Text as="h2" mb="20px" textStyle="display-small-semibold" textAlign="left">
                    {`Search Permit Holder`}
                  </Text>
                  <PermitHolderTypeahead onSelect={handleSelectPermitHolder} />
                </Box>
                <Box w="100%">
                  {applicantId &&
                    (getApplicantLoading ? (
                      <VStack
                        h="384px"
                        w="100%"
                        justifyContent="center"
                        border="1px solid"
                        borderColor="border.secondary"
                        borderRadius="8px"
                        bgColor="white"
                      >
                        <Spinner
                          thickness="4px"
                          speed="0.65s"
                          emptyColor="gray.200"
                          color="primary"
                          size="xl"
                        />
                        <Text as="h4" textStyle="display-small-semibold">
                          Loading Data...
                        </Text>
                      </VStack>
                    ) : (
                      <SelectedPermitHolderCard applicantId={applicantId} />
                    ))}
                </Box>
              </>
            ) : (
              // Create new permit holder
              <Box
                w="100%"
                p="40px"
                mb="32px"
                border="1px solid"
                borderColor="border.secondary"
                borderRadius="8px"
                bgColor="white"
              >
                <Text as="h2" mb="20px" textStyle="display-small-semibold" textAlign="left">
                  Creating New Permit Holder
                </Text>
                <Text as="h3" mb="8px" textStyle="button-semibold" textAlign="left">
                  After the request is completed, a new permit holder will be automatically created
                  in the system.
                </Text>
              </Box>
            )}
          </VStack>
        )}

        {/* Forms step */}
        {step === RequestFlowPageState.SubmittingRequestPage && (
          <form onSubmit={handleSubmit}>
            <VStack spacing="32px">
              <Box
                w="100%"
                p="40px"
                border="1px solid"
                borderColor="border.secondary"
                borderRadius="12px"
                bgColor="white"
                align="left"
              >
                <Text as="h2" textStyle="display-small-semibold" paddingBottom="20px">
                  {`Permit Holder's Information`}
                </Text>
                <PermitHolderInformationForm
                  permitHolderInformation={{ ...permitHolderInformation, type: 'NEW' }}
                  onChange={updatedPermitHolder => {
                    if (updatedPermitHolder.type === 'NEW') {
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      const { type, ...permitHolder } = updatedPermitHolder;
                      setPermitHolderInformation(permitHolder);
                    }
                  }}
                />
              </Box>
              <Box
                w="100%"
                p="40px"
                border="1px solid"
                borderColor="border.secondary"
                borderRadius="12px"
                bgColor="white"
                align="left"
              >
                <Text as="h2" textStyle="display-small-semibold" paddingBottom="20px">
                  {`Physician's Assessment`}
                </Text>
                <PhysicianAssessmentForm
                  physicianAssessment={physicianAssessment}
                  onChange={setPhysicianAssessment}
                />
              </Box>
              <Box
                w="100%"
                p="40px"
                border="1px solid"
                borderColor="border.secondary"
                borderRadius="12px"
                bgColor="white"
                align="left"
              >
                <Text as="h2" textStyle="display-small-semibold" paddingBottom="20px">
                  {`Doctor's Information`}
                </Text>
                <DoctorInformationForm
                  doctorInformation={doctorInformation}
                  onChange={setDoctorInformation}
                />
              </Box>
              <Box
                w="100%"
                p="40px"
                border="1px solid"
                borderColor="border.secondary"
                borderRadius="12px"
                bgColor="white"
                align="left"
              >
                <Text as="h2" textStyle="display-small-semibold" paddingBottom="20px">
                  {`Guardian/POA Information`}
                </Text>
                <GuardianInformationForm
                  guardianInformation={guardianInformation}
                  onChange={setGuardianInformation}
                  file={guardianPOAFile}
                  onUploadFile={setGuardianPOAFile}
                />
              </Box>
              <Box
                w="100%"
                p="40px"
                border="1px solid"
                borderColor="border.secondary"
                borderRadius="12px"
                bgColor="white"
                align="left"
              >
                <Text as="h2" textStyle="display-small-semibold" paddingBottom="20px">
                  {`Additional Information`}
                </Text>
                <AdditionalQuestionsForm
                  data={additionalQuestions}
                  onChange={setAdditionalQuestions}
                />
              </Box>
              <Box
                w="100%"
                p="40px"
                border="1px solid"
                borderColor="border.secondary"
                borderRadius="12px"
                bgColor="white"
                align="left"
              >
                <Text as="h2" textStyle="display-small-semibold" paddingBottom="20px">
                  {`Payment, Shipping and Billing Information`}
                </Text>
                <PaymentDetailsForm
                  paymentInformation={paymentDetails}
                  onChange={setPaymentDetails}
                />
              </Box>
            </VStack>
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
                        resetAllFields();
                        setStep(RequestFlowPageState.SelectingPermitHolderPage);
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
        {step == RequestFlowPageState.SelectingPermitHolderPage && (
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
                  <Button
                    bg="primary"
                    height="48px"
                    width="217px"
                    type="submit"
                    isDisabled={permitHolderExists && !applicantId}
                    onClick={() => setStep(RequestFlowPageState.SubmittingRequestPage)}
                  >
                    <Text textStyle="button-semibold">Proceed to request</Text>
                  </Button>
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