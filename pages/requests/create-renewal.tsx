import Layout from '@components/admin/Layout'; // Layout component
import { Text, Box, Flex, Stack, Button, GridItem, Input } from '@chakra-ui/react'; // Chakra UI
import { useState } from 'react'; // React
import PermitHolderInformationForm from '@components/admin/requests/forms/PermitHolderInformationForm';
import { PermitHolderInformation } from '@tools/components/admin/requests/forms/types';
import DoctorInformationForm from '@components/admin/requests/forms/DoctorInformationForm';
import { DoctorInformation } from '@tools/components/admin/requests/forms/doctor-information-form';
import AdditionalQuestionsForm from '@components/admin/requests/forms/renewals/AdditionalQuestionsForm';
import { AdditionalQuestions } from '@tools/components/admin/requests/forms/types';
import PaymentDetailsForm from '@components/admin/requests/forms/PaymentDetailsForm';
import { PaymentDetails } from '@tools/components/admin/requests/forms/types';

type CreateRenewalRequestProps = {
  readonly permitHolderInformation: PermitHolderInformation;
  readonly doctorInformation: DoctorInformation;
  readonly additionalQuestions: AdditionalQuestions;
  readonly paymentDetails: PaymentDetails;
};

export default function CreateRenewal({
  permitHolderInformation: currentPermitHolderInformation,
  doctorInformation: currentDoctorInformation,
  additionalQuestions: currentAdditionalQuestions,
  paymentDetails: currentPaymentDetails,
}: CreateRenewalRequestProps) {
  const [permitHolderInformation, setPermitHolderInformation] = useState<PermitHolderInformation>(
    currentPermitHolderInformation
  );
  const [doctorInformation, setDoctorInformation] =
    useState<DoctorInformation>(currentDoctorInformation);
  const [additionalQuestions, setAdditionalQuestions] = useState<AdditionalQuestions>(
    currentAdditionalQuestions
  );
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(currentPaymentDetails);

  return (
    <Layout footer={false}>
      <GridItem colSpan={12}>
        {/* Typeahead component */}
        <Flex paddingY="32px">
          <Text textStyle="display-large">New Renewal Request (User ID: )</Text>
        </Flex>
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
            Search Permit Holder
          </Text>
          <Input width="466px" />
        </Box>
        {/* Permit Holder Information Form */}
        <PermitHolderInformationForm
          permitHolderInformation={permitHolderInformation}
          onChange={setPermitHolderInformation}
        />
        {/* Doctor's Information Form */}
        <DoctorInformationForm
          doctorInformation={doctorInformation}
          onChange={setDoctorInformation}
        />

        {/* Additional Quesitons Form */}
        <AdditionalQuestionsForm data={additionalQuestions} onChange={setAdditionalQuestions} />
        {/* Payment Details Form */}
        <PaymentDetailsForm paymentInformation={paymentDetails} onChange={setPaymentDetails} />

        {/* Footer */}
        <Box position="fixed" bottom="0" paddingY="20px">
          <Stack direction="row" align="right">
            <Box>
              <Text textStyle="body-bold"> User ID: </Text>
            </Box>
            <Box alignContent="right">
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
