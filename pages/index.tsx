import { useTranslation } from 'next-i18next'; // Translation hook
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link'; // Link
import {
  Text,
  Divider,
  GridItem,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  UnorderedList,
  ListItem,
  Button,
} from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/applicant/Layout'; // Layout wrapper

export default function Landing() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <GridItem colSpan={8} colStart={1} mt="64px">
        <Text as="h1" textStyle="display-xlarge" align="left">
          {t('landing')}
        </Text>
        <Text as="p" textStyle="display-small" align="left" mt="24px">
          Find the services you need related to your British Columbia accessible parking permit. You
          may chose to use our online service or download a physical form and email, mail or drop it
          off in person to RCD.{' '}
        </Text>
      </GridItem>
      <GridItem colSpan={5} colStart={1} mt="28px" textAlign="left">
        <Text as="h2" textStyle="display-medium" align="left" fontWeight="semibold">
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
        <Link href="#">
          <Button
            colorScheme="primary"
            variant="solid"
            fontWeight="normal"
            size="lg"
            width="320px"
            height="48px"
            radius="6px"
            mt="48px"
            p="12px 25px 12px 25px"
          >
            <Text as="span">Renew your permit online</Text>
          </Button>
        </Link>
        <Link href="#">
          <Button
            colorScheme="primary"
            variant="solid"
            fontWeight="normal"
            size="lg"
            width="320px"
            height="48px"
            radius="6px"
            mt="32px"
            p="12px 25px 12px 25px"
          >
            <Text as="span">Download new form</Text>
          </Button>
        </Link>
      </GridItem>
      <GridItem colSpan={5} colStart={7} mt="28px" textAlign="left">
        <Text as="h2" textStyle="display-medium" align="left" fontWeight="semibold">
          Option 2: Download Form
        </Text>
        <Text as="p" textStyle="body-regular" align="left" mt="24px">
          If you would prefer to fill out a replacement form for a lost or stolen parking permit by
          hand, or want to request a new parking permit, please download the appropriate form below.
        </Text>
        <Text as="p" textStyle="body-regular" align="left" mt="24px">
          After completing the form, either email (
          <b>
            <a href="mailto:parkingpermit@richmond.org">parkingpermit@rcdrichmond.org</a>
          </b>
          ), mail or drop it off in person to RCD!
        </Text>
        <Link href="#">
          <Button
            colorScheme="primary"
            variant="solid"
            fontWeight="normal"
            size="lg"
            width="320px"
            height="48px"
            radius="6px"
            mt="36px"
            p="12px 25px 12px 25px"
          >
            <Text as="span">Request a replacement online</Text>
          </Button>
        </Link>
        <Link href="#">
          <Button
            colorScheme="primary"
            variant="solid"
            fontWeight="normal"
            size="lg"
            width="320px"
            height="48px"
            radius="6px"
            mt="32px"
            p="12px 25px 12px 25px"
          >
            <Text as="span">Download replacement form</Text>
          </Button>
        </Link>
      </GridItem>
      <GridItem colSpan={12} colStart={0} mb="44px" mt="52px">
        <Divider borderColor="#AAAAAA" />
      </GridItem>
      <GridItem colSpan={8} colStart={1} mb="64px">
        <Text as="h2" textStyle="display-large" textAlign="left">
          Frequently Asked Questions
        </Text>
        <Text as="p" textStyle="display-small" textAlign="left" mt="24px">
          Have any questions about our online services or our services? Look below to see some of
          the most frequently asked questions.
        </Text>
        <Accordion allowMultiple mt="24px">
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="h3" flex="1" textAlign="left" textStyle="body-regular">
                  Section Title
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel as="p" pb={4} textAlign="left">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="h3" flex="1" textAlign="left" textStyle="body-regular">
                  Section Title
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel as="p" pb={4} textAlign="left">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="h3" flex="1" textAlign="left" textStyle="body-regular">
                  Section Title
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel as="p" pb={4} textAlign="left">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="h3" flex="1" textAlign="left" textStyle="body-regular">
                  Section Title
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel as="p" pb={4} textAlign="left">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="h3" flex="1" textAlign="left" textStyle="body-regular">
                  Section Title
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel as="p" pb={4} textAlign="left">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="h3" flex="1" textAlign="left" textStyle="body-regular">
                  Section Title
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel as="p" pb={4} textAlign="left">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </GridItem>
      <GridItem colSpan={4} colStart={9}>
        <Box
          borderWidth="1px"
          borderRadius="12px"
          bg="background.white"
          borderColor="border.secondary"
          padding="22px"
        >
          <Text as="h3" textStyle="display-small" fontWeight="semibold" textAlign="left">
            Have more questions?
          </Text>
          <Text as="p" textStyle="body-regular" textAlign="left">
            Please contact RCD via phone at <b>604-232-2404</b> or via email at{' '}
            <b>
              <a href="mailto:parkingpermit@richmond.org">parkingpermit@rcdrichmond.org</a>
            </b>
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
