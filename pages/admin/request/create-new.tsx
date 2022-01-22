import { useState, useCallback } from 'react';
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
  HStack,
  Spinner,
} from '@chakra-ui/react';
import { getSession } from 'next-auth/client';
import { useLazyQuery } from '@apollo/client';

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
import { Gender } from '@lib/graphql/types';
import { PermitHolderFormData } from '@tools/admin/requests/permit-holder-information';
import {
  GetApplicantNewRequestInfoRequest,
  GetApplicantNewRequestInfoResponse,
  GET_APPLICANT_NEW_REQUEST_INFO_QUERY,
} from '@tools/admin/requests/create-new';

/** Create New APP page */
export default function CreateNew() {
  const [step, setStep] = useState<RequestFlowPageState>(
    RequestFlowPageState.SelectingPermitHolderPage
  );
  const [loading, setLoading] = useState(false);
  const [permitHolderExists, setPermitHolderExists] = useState(true);

  const [applicantId, setApplicantId] = useState<number | null>(null); // RCD user id

  // General information
  const [permitHolderInformation, setPermitHolderInformation] = useState<
    PermitHolderFormData & { dateOfBirth: Date; gender: Gender }
  >({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: new Date(),
    gender: 'MALE', //TODO: handle default
    email: '',
    phone: '',
    receiveEmailUpdates: false, //TODO: verify default
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
  });

  // Physician assessment
  const [physicianAssessment, setPhysicianAssessment] = useState<PhysicianAssessment>({
    disability: '',
    patientCondition: 'AFFECTS_MOBILITY', //TODO: verify default
    permitType: 'PERMANENT',
    physicianCertificationDate: new Date().toLocaleDateString('en-CA'),
  });
  // Doctor information
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
  // Guardian/POA information
  const [guardianInformation, setGuardianInformation] = useState<GuardianInformation>({
    firstName: '',
    middleName: '',
    lastName: '',
    relationship: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    // TODO: poaFormUrl work with file upload
    poaFormUrl: '',
  });
  // Additional questions
  const [additionalQuestions, setAdditionalQuestions] = useState<AdditionalInformationFormData>({
    usesAccessibleConvertedVan: false, //TODO: set default to null??
    accessibleConvertedVanLoadingMethod: null,
    requiresWiderParkingSpace: false,
    requiresWiderParkingSpaceReason: null,
    otherRequiresWiderParkingSpaceReason: null,
  });
  // Payment information
  const [paymentDetails, setPaymentDetails] = useState<PaymentInformationFormData>({
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

  /**
   * Get information about applicant to pre-populate form
   */
  const [getApplicant] = useLazyQuery<
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
          // otherGender,
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
          dateOfBirth,
          gender,
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
        setGuardianInformation({
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
      }

      setLoading(false);
    },
  });

  /**
   * Sets and fetches permit holder data when selected from typeahead
   */
  const handleSelectPermitHolder = useCallback(applicantId => {
    //TODO: confirm when we should be fetching all of this data (have to proceed first??)
    setApplicantId(applicantId || null);
    if (applicantId) {
      setLoading(true);
      getApplicant({
        variables: {
          id: applicantId,
        },
      });
    }
  }, []);

  /**
   * Handle new APP request submission
   */
  //   TODO: Implement once create new APP API is complete
  //   const handleSubmit = useCallback(async (event: SyntheticEvent) => {
  //     event.preventDefault();
  //     if (permitHolderId) {
  //       await submitRenewalApplication({
  //         variables: {
  //           input: {
  //             applicantId: permitHolderId,
  //             updatedAddress,
  //             firstName: permitHolderInformation.firstName,
  //             lastName: permitHolderInformation.lastName,
  //             addressLine1: permitHolderInformation.addressLine1,
  //             addressLine2: permitHolderInformation.addressLine2,
  //             city: permitHolderInformation.city,
  //             postalCode: permitHolderInformation.postalCode,
  //             updatedContactInfo,
  //             phone: permitHolderInformation.phone,
  //             email: permitHolderInformation.email,
  //             rcdUserId: permitHolderRcdUserID,
  //             updatedPhysician,
  //             physicianName: doctorInformation.name,
  //             physicianMspNumber: doctorInformation.mspNumber,
  //             physicianAddressLine1: doctorInformation.addressLine1,
  //             physicianAddressLine2: doctorInformation.addressLine2,
  //             physicianCity: doctorInformation.city,
  //             physicianPostalCode: doctorInformation.postalCode,
  //             physicianPhone: doctorInformation.phone,
  //             usesAccessibleConvertedVan: additionalQuestions.usesAccessibleConvertedVan,
  //             requiresWiderParkingSpace: additionalQuestions.requiresWiderParkingSpace,
  //             shippingAddressSameAsHomeAddress: paymentDetails.shippingAddressSameAsHomeAddress,
  //             billingAddressSameAsHomeAddress: paymentDetails.billingAddressSameAsHomeAddress,
  //             ...(paymentDetails.shippingAddressSameAsHomeAddress === false && {
  //               shippingFullName: paymentDetails.shippingFullName,
  //               shippingAddressLine1: paymentDetails.shippingAddressLine1,
  //               shippingAddressLine2: paymentDetails.shippingAddressLine2,
  //               shippingCity: paymentDetails.shippingCity,
  //               shippingProvince: paymentDetails.shippingProvince,
  //               shippingPostalCode: paymentDetails.shippingPostalCode,
  //             }),
  //             ...(paymentDetails.billingAddressSameAsHomeAddress === false && {
  //               billingFullName: paymentDetails.billingFullName,
  //               billingAddressLine1: paymentDetails.billingAddressLine1,
  //               billingAddressLine2: paymentDetails.billingAddressLine2,
  //               billingCity: paymentDetails.billingCity,
  //               billingProvince: paymentDetails.billingProvince,
  //               billingPostalCode: paymentDetails.billingPostalCode,
  //             }),
  //             donationAmount: paymentDetails.donationAmount,
  //             paymentMethod: paymentDetails.paymentMethod,
  //           },
  //         },
  //       });
  //     }
  //   }, []);

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
                    // TODO: Coordinate loading state display with other screens
                    (loading ? (
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
          // TODO: API hookup
          <form>
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
                  type="NEW"
                  permitHolderInformation={permitHolderInformation}
                  onChange={setPermitHolderInformation}
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
                {/* TODO: don't autofill any of this form */}
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
                  // TODO: Implement functionality for file selection
                  files={null}
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
          </form>
        )}
      </GridItem>

      {/* Footer */}
      <HStack
        h="88px"
        position="fixed"
        left="0"
        right="0"
        bottom="0"
        justifyContent={
          step === RequestFlowPageState.SelectingPermitHolderPage ? 'flex-end' : 'space-between'
        }
        alignItems="center"
        spacing="20px"
        px="188px"
        bg="white"
        boxShadow="dark-md"
      >
        {/* TODO: Fix button heights */}
        {step === RequestFlowPageState.SelectingPermitHolderPage ? (
          <>
            <Link href="/admin">
              <a>
                <Button
                  size="lg"
                  h="48px"
                  w="149px"
                  bg="secondary.gray"
                  _hover={{ bg: 'background.grayHover' }}
                  textColor="text.default"
                >
                  Cancel
                </Button>
              </a>
            </Link>
            <Button
              size="lg"
              h="48px"
              w="217px"
              bg="primary"
              disabled={permitHolderExists && !applicantId}
              onClick={() => setStep(RequestFlowPageState.SubmittingRequestPage)}
            >
              Proceed to request
            </Button>
          </>
        ) : (
          <>
            <Button
              height="48px"
              width="180px"
              bg="background.gray"
              _hover={{ bg: 'background.grayHover' }}
              marginRight="20px"
            >
              <BackToSearchModal
                onGoBack={() => {
                  setApplicantId(null);
                  setStep(RequestFlowPageState.SelectingPermitHolderPage);
                }}
              >
                <Text textStyle="button-semibold" color="text.default">
                  Back to search
                </Text>
              </BackToSearchModal>
            </Button>
            <HStack spacing="20px">
              <CancelCreateRequestModal type="renewal">
                <Button
                  size="lg"
                  height="48px"
                  width="188px"
                  bg="secondary.critical"
                  _hover={{ bg: 'secondary.criticalHover' }}
                  marginRight="20px"
                  loading={loading}
                >
                  <Text textStyle="button-semibold" color="white">
                    Discard request
                  </Text>
                </Button>
              </CancelCreateRequestModal>
              <Button bg="primary" height="48px" width="180px" type="submit" loading={loading}>
                <Text textStyle="button-semibold">Create request</Text>
              </Button>
            </HStack>
          </>
        )}
      </HStack>
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
