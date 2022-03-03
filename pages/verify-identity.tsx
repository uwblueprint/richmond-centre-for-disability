import { useState } from 'react'; // React
import Link from 'next/link'; // Link
import Image from 'next/image'; // Next Image
import { useRouter } from 'next/router'; // Router
import { useMutation } from '@apollo/client'; // Apollo Client
import {
  GridItem,
  Flex,
  Text,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  NumberInput,
  NumberInputField,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  Input,
  useToast,
  Stack,
} from '@chakra-ui/react'; // Chakra UI
import { InfoOutlineIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import Layout from '@components/applicant/Layout'; // Layout component
import TOSModal from '@components/applicant/renewals/TOSModal'; // TOS Modal
import {
  VERIFY_IDENTITY_MUTATION,
  VerifyIdentityRequest,
  VerifyIdentityResponse,
  getErrorMessage,
} from '@tools/applicant/verify-identity'; // Tools
import Request from '@containers/Request'; // Request state
import { formatDate } from '@lib/utils/format'; // Date formatter util

export default function IdentityVerificationForm() {
  // Router
  const router = useRouter();

  // Toast
  const toast = useToast();

  // Request state
  const { acceptedTOSTimestamp, setApplicantId } = Request.useContainer();

  const [userId, setUserId] = useState('');
  const [phoneNumberSuffix, setPhoneNumberSuffix] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(formatDate(new Date(), true));

  // Verify identity query
  const [verifyIdentity, { loading }] = useMutation<VerifyIdentityResponse, VerifyIdentityRequest>(
    VERIFY_IDENTITY_MUTATION,
    {
      onCompleted: data => {
        if (data.verifyIdentity.ok && data.verifyIdentity.applicantId) {
          setApplicantId(data.verifyIdentity.applicantId);
          router.push('/renew');
        } else if (data.verifyIdentity.failureReason) {
          toast({
            status: 'error',
            description: getErrorMessage(data.verifyIdentity.failureReason),
            isClosable: true,
          });
        }
      },
      onError: error => {
        toast({
          status: 'error',
          description: error.message,
          isClosable: true,
        });
      },
    }
  );

  /**
   * Handle identity verification submit
   */
  const handleSubmit = () => {
    verifyIdentity({
      variables: {
        input: {
          userId: parseInt(userId),
          phoneNumberSuffix,
          dateOfBirth,
          acceptedTos: acceptedTOSTimestamp,
        },
      },
    });

    return;
  };

  return (
    <Layout footer={false}>
      <GridItem colSpan={{ sm: 12, md: 8 }} colStart={{ sm: 1, md: 3 }}>
        <Flex width="100%" justifyContent="flex-start">
          <Flex width="100%" flexFlow="column" alignItems="flex-start">
            <Text
              as="h2"
              textStyle={{ sm: 'heading', md: 'display-medium-bold' }}
              mb={{ sm: '40px', md: '48px' }}
            >{`Renewal Form`}</Text>
            <Text
              as="h1"
              textStyle={{ sm: 'display-medium-bold', md: 'display-xlarge' }}
              marginBottom="20px"
            >{`Identity Verification`}</Text>
            <Text as="p" textStyle="body-bold" textAlign="left" marginBottom="20px">
              {`You must have a record with Richmond Centre for Disability before proceeding. Please fill
        out the information below so we may validate your identity:`}
            </Text>
            <FormControl isRequired textAlign="left" marginBottom="48px">
              <FormLabel>{`User ID number`}</FormLabel>
              <NumberInput width="184px" min={1} value={userId} onChange={setUserId}>
                <NumberInputField />
              </NumberInput>
              <Flex alignItems="center">
                <Popover placement="left" trigger="hover" gutter={24}>
                  <PopoverTrigger>
                    <InfoOutlineIcon
                      marginRight="8px"
                      cursor="pointer"
                      alignSelf="flex-start"
                      mt={{ sm: '16px', md: 'initial' }}
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverBody>
                      <Image src="/assets/wallet-card-example.png" height={200} width={320} />
                    </PopoverBody>
                    <PopoverFooter backgroundColor="background.grayHover">
                      <Text textStyle="caption">
                        {`Locate your User ID on the Wallet Card that came with your Permit.`}
                      </Text>
                    </PopoverFooter>
                  </PopoverContent>
                </Popover>
                <FormHelperText>
                  {`You can find your user ID on the back of your wallet card, on a payment receipt or in the 
                  previous form mailed to you by RCD. If you cannot find your wallet card, please call RCD at 
                  604-232-2404.`}
                </FormHelperText>
              </Flex>
            </FormControl>
            <FormControl isRequired textAlign="left" marginBottom="48px">
              <FormLabel>{`Last 4 digits of your phone number`}</FormLabel>
              <Input
                width="184px"
                value={phoneNumberSuffix}
                onChange={event => setPhoneNumberSuffix(event.target.value)}
              />
            </FormControl>
            <FormControl isRequired textAlign="left" marginBottom={{ sm: '40px', md: '20px' }}>
              <FormLabel>{`Date of Birth`}</FormLabel>
              <Input
                type="date"
                width="184px"
                value={dateOfBirth}
                onChange={event => setDateOfBirth(event.target.value)}
              />
              <FormHelperText>
                {`Please select your birthday using the date selector or type in your birthday in YYYY-MM-DD format`}
              </FormHelperText>
            </FormControl>
            <Stack
              width="100%"
              direction={{ sm: 'column-reverse', md: 'row' }}
              justifyContent="flex-end"
              spacing={{ sm: '16px', md: '12px' }}
            >
              <Link href="/">
                <Button variant="outline">{`Go back to home page`}</Button>
              </Link>
              <Button
                variant="solid"
                disabled={loading || !userId || !phoneNumberSuffix || !dateOfBirth}
                loading={loading}
                onClick={handleSubmit}
              >{`Continue`}</Button>
            </Stack>
          </Flex>
        </Flex>
        <TOSModal />
      </GridItem>
    </Layout>
  );
}
