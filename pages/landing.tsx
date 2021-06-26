//import { useRouter } from 'next/router'; // Routing
//import { useQuery } from '@apollo/client'; // GQL
import { useTranslation } from 'next-i18next'; // Translation hook
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Text,
  Divider,
  VStack,
  GridItem,
  Box,
  Grid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/applicant/Layout'; // Layout wrapper

export default function Landing() {
  const { t } = useTranslation('common');
  //const router = useRouter();

  return (
    <Layout>
      <GridItem colSpan={12} colStart={0}>
        <VStack height="100%" width="100%" alignItems="left">
          <Text as="h1" textStyle="display-xlarge">
            {t('landing')}
          </Text>
          <Text as="h1" textStyle="display-medium">
            hello
          </Text>

          <Divider borderColor="black.400" />
          <br />
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem colSpan={2} colStart={0}>
              <Text textStyle="display-large" textAlign="left">
                Frequently Asked Questions
              </Text>
              <Text textStyle="display-small" textAlign="left">
                Have any questions about our online services or our services? Look below to see some
                of the most frequently asked questions.
              </Text>
              <br />
              <Accordion defaultIndex={[0]} allowMultiple>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" textStyle="body-regular">
                        Section Title
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} textAlign="left">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" textStyle="body-regular">
                        Section Title
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} textAlign="left">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" textStyle="body-regular">
                        Section Title
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} textAlign="left">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" textStyle="body-regular">
                        Section Title
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} textAlign="left">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" textStyle="body-regular">
                        Section Title
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} textAlign="left">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" textStyle="body-regular">
                        Section Title
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} textAlign="left">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </GridItem>
            <GridItem colSpan={1} colStart={3}>
              <Box
                maxWidth="385px"
                borderWidth="1px"
                borderRadius="12px"
                bg="background.white"
                borderColor="border.secondary"
                padding="22px"
              >
                <Text textStyle="display-small" fontWeight="semibold" textAlign="left">
                  Have more questions?
                </Text>
                <Text textStyle="body-regular" textAlign="left">
                  Please contact RCD via phone at <br /> <b>604-232-2404</b> or via email at{' '}
                  <b>parkingpermit@rcdrichmond.org</b>
                </Text>
              </Box>
            </GridItem>
            <br />
          </Grid>
        </VStack>
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
