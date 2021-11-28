import Layout from '@components/admin/Layout'; // Layout component
import { Text, Box, Flex, Stack, Button, GridItem, Input } from '@chakra-ui/react'; // Chakra UI
import { useState } from 'react'; // React
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
import CancelCreateRequestModal from '@components/admin/requests/modals/CancelCreateRequestModal';

export default function CreateRenewal() {
  const [permitHolderID] = useState(303240);
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
            <Input width="466px" />
          </Box>
        </GridItem>
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
            <AdditionalQuestionsForm data={additionalQuestions} onChange={setAdditionalQuestions} />
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
            <PaymentDetailsForm paymentInformation={paymentDetails} onChange={setPaymentDetails} />
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
              <Stack direction="row" justifyContent="space-between">
                <CancelCreateRequestModal type="renewal">
                  <Button
                    bg="secondary.critical"
                    _hover={{ bg: 'secondary.criticalHover' }}
                    marginRight="20px"
                    height="48px"
                    width="149px"
                  >
                    <Text textStyle="button-semibold">Discard</Text>
                  </Button>
                </CancelCreateRequestModal>
                <Link href="#">
                  <Button bg="primary" height="48px" width="180px">
                    <Text textStyle="button-semibold">Create Request</Text>
                  </Button>
                </Link>
              </Stack>
            </Box>
          </Stack>
        </Box>
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
