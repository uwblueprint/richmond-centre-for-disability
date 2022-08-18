import { useState, FC } from 'react'; // React
import { useMutation } from '@tools/hooks/graphql'; // Apollo Client
import {
  Flex,
  Box,
  GridItem,
  Text,
  Button,
  Checkbox,
  useToast,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  VStack,
} from '@chakra-ui/react'; // Chakra UI
import { Step, Steps } from 'chakra-ui-steps'; // Chakra UI Steps
import {
  CREATE_EXTERNAL_RENEWAL_APPLICATION_MUTATION,
  CreateExternalRenewalApplicationRequest,
  CreateExternalRenewalApplicationResponse,
} from '@tools/applicant/renewal-form'; // Page tools
import RenewalFlow from '@containers/RenewalFlow'; // Request state
import ValidationErrorAlert from '@components/form/ValidationErrorAlert';
import RenewalFormContainer from '@containers/RenewalForm';
import PersonalAddressSection from './PersonalAddressSection';
import ContactInformationSection from './ContactInformationSection';
import DoctorInformationSection from './DoctorInformationSection';
import AdditionalInformationSection from './AdditionalInformationSection';
import DonationSection from './DonationSection';
import ReviewSection from './ReviewSection';

/** Renewal form of applicant APP renewal flow */
const RenewalForm: FC = () => {
  // Renewal flow state
  const { applicantId, prevStep, activeStep, certified, setCertified } = RenewalFlow.useContainer();

  // Renewal form state
  const {
    updatedAddress,
    updatedContactInfo,
    updatedDoctorInfo,
    personalAddressInformation,
    contactInformation,
    doctorInformation,
    additionalInformation,
    donationAmount,
  } = RenewalFormContainer.useContainer();

  // Toast message
  const toast = useToast();

  /**  Backend form validation error */
  const [error, setError] = useState<string>('');

  const [loading, setLoading] = useState(false);

  // Submit application mutation
  const [submitApplication] = useMutation<
    CreateExternalRenewalApplicationResponse,
    CreateExternalRenewalApplicationRequest
  >(CREATE_EXTERNAL_RENEWAL_APPLICATION_MUTATION, {
    onCompleted: data => {
      if (data) {
        const { ok, applicationId, error, checkoutUrl } = data.createExternalRenewalApplication;

        if (ok && applicationId && checkoutUrl) {
          toast({
            status: 'success',
            description: 'Redirecting to payment page...',
            isClosable: true,
          });

          // Open checkout window.
          window.location.href = checkoutUrl;
        } else {
          setError(error ?? '');
        }
      }
    },
    onError: error => {
      toast({
        status: 'error',
        description: error.message,
        isClosable: true,
      });

      setLoading(false);
    },
  });

  /**
   * Handle application submission
   */
  const handleSubmit = async () => {
    if (applicantId === null) {
      toast({
        status: 'error',
        title: 'Identity verification failed',
        description: `You have not completed the identity verification step.
          Please complete the identity verification before filling out the renewal application form.`,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    const { addressLine1, addressLine2, city, postalCode } = personalAddressInformation;
    const { phone, email, receiveEmailUpdates } = contactInformation;
    const {
      firstName: doctorFirstName,
      lastName: doctorLastName,
      mspNumber: doctorMspNumber,
      addressLine1: doctorAddressLine1,
      addressLine2: doctorAddressLine2,
      city: doctorCity,
      postalCode: doctorPostalCode,
      phone: doctorPhoneNumber,
    } = doctorInformation;

    await submitApplication({
      variables: {
        input: {
          applicantId,
          updatedAddress,
          updatedContactInfo,
          updatedPhysician: updatedDoctorInfo,
          addressLine1: updatedAddress ? addressLine1 : null,
          addressLine2: updatedAddress ? addressLine2 : null,
          city: updatedAddress ? city : null,
          postalCode: updatedAddress ? postalCode : null,
          phone: updatedContactInfo ? phone : null,
          email: updatedContactInfo ? email : null,
          physicianFirstName: updatedDoctorInfo ? doctorFirstName : null,
          physicianLastName: updatedDoctorInfo ? doctorLastName : null,
          physicianMspNumber: updatedDoctorInfo ? doctorMspNumber : null,
          physicianAddressLine1: updatedDoctorInfo ? doctorAddressLine1 : null,
          physicianAddressLine2: updatedDoctorInfo ? doctorAddressLine2 : null,
          physicianCity: updatedDoctorInfo ? doctorCity : null,
          physicianPostalCode: updatedDoctorInfo ? doctorPostalCode : null,
          physicianPhone: updatedDoctorInfo ? doctorPhoneNumber : null,
          receiveEmailUpdates,
          ...additionalInformation,
          donationAmount,
        },
      },
    });
  };

  return (
    <GridItem colSpan={10} colStart={2}>
      <Text
        as="h1"
        textStyle={{ sm: 'display-medium-bold', md: 'display-xlarge' }}
        textAlign="left"
        marginBottom="20px"
      >
        Renewal Form
      </Text>
      <Alert status="info" marginBottom="48px">
        <AlertIcon />
        <VStack align="flex-start" spacing="0">
          <AlertTitle>Tip</AlertTitle>
          <AlertDescription textAlign="left">
            If you are unsure of whether your information has changed since you last renewed or
            applied for an Accessible Parking Permit, click the “Yes” option and provide your most
            up-to-date information. Please contact RCD via phone at <b>604-232-2404</b> or via email
            at{' '}
            <a href="mailto:parkingpermit@rcdrichmond.org">
              <b>parkingpermit@rcdrichmond.org</b>
            </a>{' '}
            if you require assistance.
          </AlertDescription>
        </VStack>
      </Alert>
      <Steps orientation="vertical" activeStep={activeStep}>
        <Step label={`Personal Address Information`}>
          <PersonalAddressSection />
        </Step>
        <Step label={`Personal Contact Information`}>
          <ContactInformationSection />
        </Step>
        <Step label={`Doctor's Information`}>
          <DoctorInformationSection />
        </Step>
        <Step label="Additional Information">
          <AdditionalInformationSection />
        </Step>
        <Step label="Donation">
          <DonationSection />
        </Step>
        <Step label={`Review Request`}>
          <VStack align="flex-start" spacing="32px">
            <ReviewSection />
            <Box>
              <Text
                as="h4"
                textStyle="body-bold"
                textAlign="left"
                marginBottom="12px"
              >{`Please check to confirm the following statements before you proceed:`}</Text>
              <Checkbox
                textAlign="left"
                isChecked={certified}
                onChange={event => setCertified(event.target.checked)}
              >
                {`I certify that I am the holder of the accessible parking permit for which this
  application for renewal is submitted, and that I have personally provided all of the
  information required in this application.`}
              </Checkbox>
            </Box>
            <ValidationErrorAlert error={error} />
            <Alert status="info">
              <AlertIcon />
              <VStack align="flex-start" spacing="0">
                <AlertTitle>Redirection to Shopify Checkout</AlertTitle>
                <AlertDescription textAlign="left">
                  When clicking “Proceed to payment”, you will be redirected to Shopify checkout to
                  process the payment for your Permit Renewal. In order to finish and submit your
                  application, you have to checkout.
                </AlertDescription>
              </VStack>
            </Alert>
            <Flex width="100%" justifyContent="flex-end">
              <Button variant="outline" onClick={prevStep} marginRight="32px">{`Previous`}</Button>
              <Button
                variant="solid"
                onClick={handleSubmit}
                loading={loading}
                disabled={loading || !applicantId || !certified}
              >{`Proceed to payment`}</Button>
            </Flex>
          </VStack>
        </Step>
      </Steps>
    </GridItem>
  );
};

export default RenewalForm;
