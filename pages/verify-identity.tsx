import { useState } from 'react'; // React
import Link from 'next/link'; // Link
import {
  GridItem,
  Flex,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react'; // Chakra UI
import { InfoOutlineIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import Layout from '@components/applicant/Layout'; // Layout component
import TOSModal from '@components/applicant/renewals/TOSModal'; // TOS Modal

export default function IdentityVerificationForm() {
  const [userId, setUserId] = useState('');
  const [phoneNumberSuffix, setPhoneNumberSuffix] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  return (
    <Layout footer={false}>
      <GridItem colSpan={8} colStart={3}>
        <Flex width="100%" justifyContent="flex-start">
          <Flex width="100%" flexFlow="column" alignItems="flex-start">
            <Text
              as="h1"
              textStyle="display-xlarge"
              marginBottom="20px"
            >{`Verify your Identity`}</Text>
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
                <InfoOutlineIcon marginRight="8px" />
                <FormHelperText>
                  {`You can find your user ID on the back of your wallet card. If you cannot find your
              wallet card, please call RCD at 604-232-2404.`}
                </FormHelperText>
              </Flex>
            </FormControl>
            <FormControl isRequired textAlign="left" marginBottom="48px">
              <FormLabel>{`Last 4 digits of your phone number`}</FormLabel>
              <NumberInput width="184px" value={phoneNumberSuffix} onChange={setPhoneNumberSuffix}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl isRequired textAlign="left" marginBottom="56px">
              <FormLabel>{`Date of Birth`}</FormLabel>
              <Input type="date" width="184px" value={dateOfBirth} setValue={setDateOfBirth} />
              <FormHelperText>
                {`Please enter your date of birth in YYYY/MM/DD format. For example, if you were born on
            20th August 1950, you would enter 20/08/1950`}
              </FormHelperText>
            </FormControl>
            <Flex width="100%" justifyContent="flex-end">
              <Link href="/">
                <Button variant="outline" marginRight="12px">{`Go Back to Home Page`}</Button>
              </Link>
              <Link href="/renew">
                <Button variant="solid">{`Continue`}</Button>
              </Link>
            </Flex>
          </Flex>
        </Flex>
        <TOSModal />
      </GridItem>{' '}
    </Layout>
  );
}
