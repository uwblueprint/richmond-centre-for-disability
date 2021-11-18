import Layout from '@components/admin/Layout'; // Layout component
import { Text, Box, Flex, Stack, Button, GridItem, useToast } from '@chakra-ui/react'; // Chakra UI
import { SyntheticEvent, useState } from 'react'; // React
import PermitHolderInformationForm from '@components/admin/requests/forms/PermitHolderInformationForm'; //Permit holder information form
import {
  DoctorInformation,
  PermitHolderInformation,
} from '@tools/components/admin/requests/forms/types'; //Permit holder information type
import DoctorInformationForm from '@components/admin/requests/forms/DoctorInformationForm'; //Doctor information form
import AdditionalQuestionsForm from '@components/admin/requests/forms/renewals/AdditionalQuestionsForm'; //Additional questions form
import { AdditionalQuestions } from '@tools/components/admin/requests/forms/types'; //Additional questions type
import PaymentDetailsForm from '@components/admin/requests/forms/PaymentDetailsForm'; //Payment details form
import { PaymentDetails } from '@tools/components/admin/requests/forms/types'; //Payment details type
import { PaymentType, Province, Role } from '@lib/graphql/types'; //GraphQL types
import Link from 'next/link'; // Link
import { authorize } from '@tools/authorization';
import { getSession } from 'next-auth/client';
import { GetServerSideProps } from 'next';
import PermitHolderTypeahead from '@components/admin/permit-holders/PermitHolderTypeahead';
import { PermitHolder } from '@tools/pages/admin/permit-holders/get-permit-holders';
import { useMutation } from '@apollo/client';
import {
  CreateRenewalApplicationRequest,
  CreateRenewalApplicationResponse,
  CREATE_RENEWAL_APPLICATION_MUTATION,
} from '@tools/pages/applicant/renew';

export default function CreateRenewal() {
  const [permitHolderID] = useState(303240);
  const [, setSelectedPermitHolder] = useState<PermitHolder | undefined>(undefined);
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
  const [doctorInformation, setDoctorInformation] = useState<DoctorInformation>({
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    name: '',
    mspNumber: 0, //TODO: change default value to undefined
  });
  const [additionalQuestions, setAdditionalQuestions] = useState<AdditionalQuestions>({
    usesAccessibleConvertedVan: false,
    requiresWiderParkingSpace: false,
  });
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

  // Toast message
  const toast = useToast();

  //TODO: get applicant id when fetching applicant data
  //figure out what to do otherwise
  const applicantId = 1;

  // Always override address, contact info, and physician
  const updatedAddress = true;
  const updatedContactInfo = true;
  const updatedPhysician = true;

  //TODO: useLazyQuery on applicant table
  // const [getApplicant] = useLazyQuery()

  const handleSelectedPermitHolder = (permitHolder: PermitHolder | undefined) => {
    setSelectedPermitHolder(permitHolder);
    //TODO: execute query to get all data on permit holder
  };

  // Submit application mutation
  const [submitRenewalApplication, { loading }] = useMutation<
    CreateRenewalApplicationResponse,
    CreateRenewalApplicationRequest
  >(CREATE_RENEWAL_APPLICATION_MUTATION, {
    onCompleted: data => {
      if (data?.createRenewalApplication.ok) {
        toast({
          status: 'success',
          description: 'Your application has been submitted!',
        });
      }
    },
    onError: error => {
      toast({
        status: 'error',
        description: error.message,
      });
    },
  });

  /**
   * Handle edit submission
   */
  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    await submitRenewalApplication({
      variables: {
        input: {
          applicantId,
          updatedAddress,
          addressLine1: permitHolderInformation.addressLine1,
          addressLine2: permitHolderInformation.addressLine2,
          city: permitHolderInformation.city,
          postalCode: permitHolderInformation.postalCode,
          updatedContactInfo,
          phone: permitHolderInformation.phone,
          email: permitHolderInformation.email,
          updatedPhysician,
          physicianName: doctorInformation.name,
          physicianMspNumber: doctorInformation.mspNumber,
          physicianAddressLine1: doctorInformation.addressLine1,
          physicianAddressLine2: doctorInformation.addressLine2,
          physicianCity: doctorInformation.city,
          physicianPostalCode: doctorInformation.postalCode,
          physicianPhone: doctorInformation.phone,
          usesAccessibleConvertedVan: additionalQuestions.usesAccessibleConvertedVan,
          requiresWiderParkingSpace: additionalQuestions.requiresWiderParkingSpace,
        },
      },
    });
  };

  return (
    <Layout>
      <GridItem display="flex" flexDirection="column" colSpan={12} paddingX="108px">
        <Flex>
          <Text textStyle="display-large">
            New Renewal Request (User ID:{' '}
            <Box as="span" color="primary">
              <Link href={`/permit-holder/${permitHolderID}`}>
                <a>{permitHolderID}</a>
              </Link>
            </Box>
            )
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
            <PermitHolderTypeahead onSelect={handleSelectedPermitHolder} />
          </Box>
        </GridItem>
        {/* Permit Holder Information Form */}
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
                permitHolderInformation={permitHolderInformation}
                onChange={setPermitHolderInformation}
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
                data={additionalQuestions}
                onChange={setAdditionalQuestions}
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
                    <Link href={`/permit-holder/${permitHolderID}`}>
                      <a>{permitHolderID}</a>
                    </Link>
                  </Box>
                </Text>
              </Box>
              <Box>
                <Link href="/admin">
                  <Button
                    bg="background.gray"
                    _hover={{ bg: 'background.grayHover' }}
                    color="black"
                    marginRight="20px"
                    height="48px"
                    width="149px"
                  >
                    <Text textStyle="button-semibold">Cancel</Text>
                  </Button>
                </Link>
                {/* <Link href="#"> */}
                <Button bg="primary" height="48px" width="180px" type="submit" loading={loading}>
                  <Text textStyle="button-semibold">Create Request</Text>
                </Button>
                {/* </Link> */}
              </Box>
            </Stack>
          </Box>
        </form>
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
