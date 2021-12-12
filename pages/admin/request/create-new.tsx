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
import PermitHolderTypeahead from '@components/admin/permit-holders/PermitHolderTypeahead';
import SelectedPermitHolderCard from '@components/admin/requests/SelectedPermitHolderCard';
import PermitHolderInformationForm from '@components/admin/requests/forms/PermitHolderInformationForm';
import PhysicianAssessmentForm from '@components/admin/requests/forms/new-applications/PhysicianAssessmentForm';
import DoctorInformationForm from '@components/admin/requests/forms/DoctorInformationForm';
import GuardianInformationForm from '@components/admin/requests/forms/new-applications/GuardianInformationForm';
import AdditionalQuestionsForm from '@components/admin/requests/forms/renewals/AdditionalQuestionsForm';
import PaymentDetailsForm from '@components/admin/requests/forms/PaymentDetailsForm';
import BackToSearchModal from '@components/admin/requests/modals/BackToSearchModal';
import CancelCreateRequestModal from '@components/admin/requests/modals/CancelCreateRequestModal';

import {
  Role,
  ApplicantStatus,
  Gender,
  Province,
  PaymentType,
  PermitType,
} from '@lib/graphql/types';
import { authorize } from '@tools/authorization';
import { GET_APPLICANT_RENEWAL_QUERY } from '@tools/pages/admin/requests/queries';
import {
  GetApplicantRenewalRequest,
  GetApplicantRenewalResponse,
  RequestFlowPageState,
} from '@tools/pages/admin/requests/types';
import {
  DoctorInformation,
  PermitHolderInformation,
  AdditionalQuestions,
  PaymentDetails,
  GuardianInformation,
} from '@tools/components/admin/requests/forms/types';
import { ApplicantData } from '@tools/pages/admin/permit-holders/types';
import { PermitHolder } from '@tools/pages/admin/permit-holders/get-permit-holders';
import { PhysicianAssessmentInformation } from '@tools/components/admin/requests/forms/types';

/** Create New APP page */
export default function CreateNew() {
  const [step, setStep] = useState<RequestFlowPageState>(
    RequestFlowPageState.SelectingPermitHolderPage
  );
  const [loading, setLoading] = useState(false);
  const [permitHolderExists, setPermitHolderExists] = useState(true);

  const [permitHolderId, setPermitHolderId] = useState<number | null>(null); // Permit holder ID in DB
  const [rcdUserId, setRcdUserId] = useState<number | null>(null); // RCD user id

  // General information
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
  // Personal information
  const [personalInformation, setPersonalInformation] = useState<ApplicantData>({
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
  // Physician assessment
  const [physicianAssessment, setPhysicianAssessment] = useState<PhysicianAssessmentInformation>({
    disability: '',
    affectsMobility: false,
    mobilityAidRequired: false,
    cannotWalk100m: false,
    permitType: PermitType.Permanent,
    physicianCertificationDate: new Date().toLocaleDateString('en-CA'),
  });
  // Doctor information
  const [doctorInformation, setDoctorInformation] = useState<DoctorInformation>({
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    name: '',
    mspNumber: 0, //TODO: change default value to undefined
  });
  // Guardian/POA information
  const [guardianInformation, setGuardianInformation] = useState<GuardianInformation>({
    firstName: '',
    middleName: '',
    lastName: '',
    guardianRelationship: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    // TODO: poaFormUrl work with file upload
    poaFormUrl: '',
  });
  // Additional questions
  const [additionalQuestions, setAdditionalQuestions] = useState<AdditionalQuestions>({
    usesAccessibleConvertedVan: false,
    requiresWiderParkingSpace: false,
  });
  // Payment information
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    paymentMethod: PaymentType.Mastercard,
    donationAmount: 0,
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

  /**
   * Get information about applicant to pre-populate form
   */
  const [getApplicant] = useLazyQuery<GetApplicantRenewalResponse, GetApplicantRenewalRequest>(
    GET_APPLICANT_RENEWAL_QUERY,
    {
      fetchPolicy: 'network-only',
      onCompleted: data => {
        // set personal information card
        setPersonalInformation({
          id: +data.applicant.id,
          rcdUserId: data.applicant.rcdUserId || 0,
          firstName: data.applicant.firstName,
          lastName: data.applicant.lastName,
          gender: data.applicant.gender,
          dateOfBirth: data.applicant.dateOfBirth,
          email: data.applicant.email,
          phone: data.applicant.phone,
          province: data.applicant.province,
          city: data.applicant.city,
          addressLine1: data.applicant.addressLine1,
          addressLine2: data.applicant.addressLine2,
          status: data.applicant.status,
          postalCode: data.applicant.postalCode,
        });

        // set permitHolderInformation
        setRcdUserId(data.applicant.rcdUserId || null);
        setPermitHolderId(+data.applicant.id);
        setPermitHolderInformation({
          firstName: data.applicant.firstName,
          lastName: data.applicant.lastName,
          email: data.applicant.email,
          phone: data.applicant.phone,
          addressLine1: data.applicant.addressLine1,
          addressLine2: data.applicant.addressLine2,
          city: data.applicant.city,
          postalCode: data.applicant.postalCode,
        });

        // set doctorInformation
        const physician = data.applicant.medicalInformation.physician;
        setDoctorInformation({
          phone: physician.phone,
          addressLine1: physician.addressLine1,
          addressLine2: physician.addressLine2,
          city: physician.city,
          postalCode: physician.postalCode,
          name: physician.name,
          mspNumber: physician.mspNumber,
        });

        // set additionalQuestions
        if (data.applicant.mostRecentRenewal.renewal) {
          setAdditionalQuestions({
            usesAccessibleConvertedVan:
              data.applicant.mostRecentRenewal.renewal.usesAccessibleConvertedVan,
            requiresWiderParkingSpace:
              data.applicant.mostRecentRenewal.renewal.requiresWiderParkingSpace,
          });
        } else {
          setAdditionalQuestions({
            usesAccessibleConvertedVan: false,
            requiresWiderParkingSpace: false,
          });
        }

        // set paymentDetails
        const previousApplication = data.applicant.mostRecentRenewal;
        setPaymentDetails({
          ...paymentDetails,
          shippingAddressSameAsHomeAddress: previousApplication.shippingAddressSameAsHomeAddress,
          shippingFullName: previousApplication.shippingFullName,
          shippingAddressLine1: previousApplication.shippingAddressLine1,
          shippingAddressLine2: previousApplication.shippingAddressLine2,
          shippingCity: previousApplication.shippingCity,
          shippingProvince: previousApplication.shippingProvince,
          shippingPostalCode: previousApplication.shippingPostalCode,
        });

        setLoading(false);
      },
    }
  );

  /**
   * Sets and fetches permit holder data when selected from typeahead
   */
  const handleSelectPermitHolder = useCallback((permitHolder: PermitHolder | undefined) => {
    setRcdUserId(permitHolder?.rcdUserId || null);
    setPermitHolderId(permitHolder?.id || null);
    if (permitHolder) {
      setLoading(true);
      getApplicant({
        variables: {
          id: permitHolder.id,
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
            {rcdUserId && (
              <>
                {` (User ID: `}
                <Box as="span" color="primary">
                  <Link href={`/admin/permit-holder/${rcdUserId}`}>
                    <a>{rcdUserId}</a>
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
                  setPermitHolderId(null);
                  setRcdUserId(null);
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
                  {permitHolderId &&
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
                      <SelectedPermitHolderCard applicant={personalInformation} />
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
        {step === RequestFlowPageState.SubmitingRequestPage && (
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
                <PhysicianAssessmentForm
                  physicianAssessmentInformation={physicianAssessment}
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
                  {`Additional Information`}
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
              disabled={permitHolderExists && !permitHolderId}
              onClick={() => setStep(RequestFlowPageState.SubmitingRequestPage)}
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
                  setRcdUserId(null);
                  setPermitHolderId(null);
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
