import { useState } from 'react'; // React
import { GetServerSideProps } from 'next';
import Link from 'next/link'; // Link component
import { getSession } from 'next-auth/client'; // Session management
import { authorize } from '@tools/authorization'; // Page authorization
import { Text, Box, Flex, Stack, Button, GridItem, Input } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/admin/Layout'; // Layout component
import PermitHolderInformationForm from '@components/admin/requests/forms/PermitHolderInformationForm'; //Permit holder information form
import {
  PaymentDetails,
  PermitHolderInformation,
} from '@tools/components/admin/requests/forms/types'; //Permit holder information type
import PaymentDetailsForm from '@components/admin/requests/forms/PaymentDetailsForm'; //Payment details form
import { PaymentType, Province, Role } from '@lib/graphql/types'; //GraphQL types
import { ReasonForReplacement } from '@tools/components/admin/requests/forms/types';
import { ReasonForReplacement as ReasonForReplacementEnum } from '@lib/graphql/types'; // Reason For Replacement Enum
import ReasonForReplacementForm from '@components/admin/requests/forms/ReasonForReplacementForm';

export default function CreateReplacement() {
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

  const [reasonDetails, setReason] = useState<ReasonForReplacement>({
    reason: ReasonForReplacementEnum.Other,
    lostTimestamp: null,
    lostLocation: null,
    description: null,
    stolenJurisdiction: null,
    stolenPoliceFileNumber: null,
    stolenPoliceOfficerName: null,
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
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

  return (
    <Layout>
      <GridItem display="flex" flexDirection="column" colSpan={12} paddingX="108px">
        <Flex>
          <Text textStyle="display-large">
            {`New Replacement Request (User ID:`}
            <Box as="span" color="primary">
              {' '}
              <Link href={`/admin/request/${permitHolderID}`}>
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
            <ReasonForReplacementForm reasonForReplacement={reasonDetails} onChange={setReason} />
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
                User ID:
                <Box as="span" color="primary">
                  {' '}
                  <Link href={`/admin/request/${permitHolderID}`}>
                    <a>{permitHolderID}</a>
                  </Link>
                </Box>
              </Text>
            </Box>
            <Box>
              <Link href={`/admin`}>
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
              <Button bg="primary" height="48px" width="180px">
                <Text textStyle="button-semibold">Create Request</Text>
              </Button>
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
