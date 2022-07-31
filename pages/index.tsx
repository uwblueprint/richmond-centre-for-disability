import { useTranslation } from 'next-i18next'; // Translation hook
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link'; // Link
import {
  Text,
  Divider,
  GridItem,
  Box,
  UnorderedList,
  ListItem,
  Button,
  VStack,
} from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/applicant/Layout'; // Layout wrapper
import FAQs from '@components/applicant/FAQs';

export default function Landing() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <GridItem colSpan={12} colStart={1}>
        <Text as="h1" textStyle={{ sm: 'display-large', md: 'display-xlarge' }} align="left">
          {t('landing')}
        </Text>
        <Text as="p" textStyle={{ sm: 'body-regular', md: 'display-small' }} align="left" mt="24px">
          Find the services you need related to your British Columbia accessible parking permit. You
          can <b>renew your permanent parking permit online</b> using the Online Renewal Service. If
          you&apos;re{' '}
          <b>
            applying for a new parking permit, or need a replacement for a lost or stolen parking
            permit
          </b>
          : download a physical form and email, mail or drop it off in person to RCD. For any other
          services, such as updating your contacy information, please contact RCD.
        </Text>
      </GridItem>
      <GridItem
        colSpan={{ sm: 12, lg: 5 }}
        colStart={1}
        mt={{ sm: '36px', lg: '28px' }}
        textAlign="left"
      >
        <VStack
          height="100%"
          justifyContent="space-between"
          alignItems={{ sm: 'stretch', md: 'flex-start' }}
          spacing={{ lg: '32px' }}
        >
          <Box>
            <Text as="h2" textStyle="display-medium" align="left" fontWeight={{ md: 'semibold' }}>
              Option 1: Online Service
            </Text>
            <Text as="p" textStyle="body-regular" align="left" mt="24px">
              You will need to complete the following steps for our online services
            </Text>
            <UnorderedList mt="12px" pl="10px">
              <ListItem textAlign="left" textStyle="body-regular">
                <Text as="p">Provide your user ID (available on your wallet card)</Text>
              </ListItem>
              <ListItem textAlign="left" textStyle="body-regular">
                <Text as="p">Provide the last 4 digits of your phone number</Text>
              </ListItem>
              <ListItem textAlign="left" textStyle="body-regular">
                <Text as="p">Provide your date of birth</Text>
              </ListItem>
              <ListItem textAlign="left" textStyle="body-regular">
                <Text as="p">Complete the online form and pay a $26 processing fee</Text>
              </ListItem>
            </UnorderedList>
          </Box>
          <VStack
            width="100%"
            alignItems={{ sm: 'center', lg: 'flex-start' }}
            pb={{ sm: 0, lg: '112px' }}
          >
            <Link href="/renew">
              <a>
                <Button
                  colorScheme="primary"
                  variant="solid"
                  fontWeight="semibold"
                  size="lg"
                  width={{ sm: '100%', md: '320px' }}
                  height={{ sm: '72px', md: '48px' }}
                  radius="6px"
                  mt={{ sm: '32px', md: '48px' }}
                  p="12px 25px 12px 25px"
                >
                  <Text as="span">Renew your permit online</Text>
                </Button>
              </a>
            </Link>
          </VStack>
        </VStack>
      </GridItem>
      <GridItem
        colSpan={{ sm: 12, lg: 5 }}
        colStart={{ sm: 1, lg: 7 }}
        mt={{ sm: '36px', lg: '28px' }}
        textAlign="left"
      >
        <VStack
          height="100%"
          justifyContent="space-between"
          alignItems={{ sm: 'stretch', md: 'flex-start' }}
          spacing={{ lg: '32px' }}
        >
          <Box>
            <Text as="h2" textStyle="display-medium" align="left" fontWeight={{ md: 'semibold' }}>
              Option 2: Download Form
            </Text>
            <Text as="p" textStyle="body-regular" align="left" mt="24px">
              If you would prefer to fill out a replacement form for a lost or stolen parking permit
              by hand, or want to request a new parking permit, please download the appropriate form
              below.
            </Text>
            <Text as="p" textStyle="body-regular" align="left" mt="24px">
              After completing the form, either email (
              <a href="mailto:rcdparkingpermit@richmond.org">
                <Text as="span" fontWeight="bold" whiteSpace="nowrap">
                  parkingpermit@rcdrichmond.org
                </Text>
              </a>
              ), mail or drop it off in person to RCD!
            </Text>
          </Box>
          <VStack width="100%" alignItems={{ sm: 'center', lg: 'flex-start' }} spacing="32px">
            <a
              href="https://www.rcdrichmond.org/Parking/Parking%20Permit%20Application%20form_rev%202022.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                colorScheme="primary"
                variant="solid"
                fontWeight="semibold"
                size="lg"
                width={{ sm: '100%', md: '320px' }}
                height={{ sm: '72px', md: '48px' }}
                radius="6px"
                mt={{ sm: '32px', md: '48px' }}
                p="12px 25px 12px 25px"
              >
                <Text as="span">Download new form</Text>
              </Button>
            </a>
            <a
              href="https://www.rcdrichmond.org/Parking/PermitReplacementDeclarationForm_2022%20v.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                colorScheme="primary"
                variant="solid"
                fontWeight="semibold"
                size="lg"
                width={{ sm: '100%', md: '320px' }}
                height={{ sm: '72px', md: '48px' }}
                radius="6px"
                mt={{ sm: '20px', md: '32px' }}
                p="12px 25px 12px 25px"
              >
                <Text as="span">Download replacement form</Text>
              </Button>
            </a>
          </VStack>
        </VStack>
      </GridItem>
      <GridItem
        colSpan={12}
        colStart={0}
        mb={{ lg: '44px' }}
        mt="52px"
        display={{ sm: 'none', lg: 'initial' }}
      >
        <Divider />
      </GridItem>
      <GridItem
        colSpan={{ sm: 12, lg: 8 }}
        colStart={1}
        mt={{ sm: '28px', lg: 'initial' }}
        mb={{ sm: '48px', md: '0px', lg: '64px' }}
      >
        <Text as="h2" textStyle={{ sm: 'display-medium', md: 'display-large' }} textAlign="left">
          Frequently Asked Questions
        </Text>
        <Text
          as="p"
          textStyle={{ sm: 'body-regular', md: 'display-small' }}
          textAlign="left"
          mt="24px"
        >
          Have any questions about our online services or our services? Look below to see some of
          the most frequently asked questions.
        </Text>
        <FAQs />
      </GridItem>
      <GridItem colSpan={{ sm: 12, lg: 4 }} colStart={{ sm: 1, lg: 9 }}>
        <Box
          borderWidth="1px"
          borderRadius="12px"
          bg="background.white"
          borderColor="border.secondary"
          padding="22px"
        >
          <Text as="h3" textStyle="display-small" fontWeight="semibold" textAlign="left" mb="20px">
            Have more questions?
          </Text>
          <Text as="p" textStyle="body-regular" textAlign="left">
            Please contact RCD via phone at{' '}
            <Text as="span" fontWeight="bold" whiteSpace="nowrap">
              604-232-2404
            </Text>{' '}
            or via email at{' '}
            <a href="mailto:rcdparkingpermit@richmond.org">
              <Text as="span" fontWeight="bold" whiteSpace="nowrap">
                parkingpermit@rcdrichmond.org
              </Text>
            </a>
          </Text>
        </Box>
      </GridItem>
    </Layout>
  );
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};
