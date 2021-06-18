import { ReactNode } from 'react';
import Head from 'next/head'; // HTML head handling

import { Box, Flex, Grid, GridItem, Image, Button, Center, Text, Spacer } from '@chakra-ui/react'; // Chakra UI
import Logo from '@assets/logo.svg'; // Logo

type Props = {
  children: ReactNode;
  header?: boolean;
  footer?: boolean;
};

// Applicant Layout component
export default function Layout({ children, header = true, footer = true }: Props) {
  return (
    <Box textAlign="center">
      <Meta />
      <Flex flexDirection="column" alignItems="center" minHeight="100vh">
        {header && <Header />}
        <Box maxWidth={{ xl: 1200 }} flexGrow={1} paddingTop={20}>
          <ApplicantGrid>{children}</ApplicantGrid>
        </Box>
        {footer && <Footer />}
      </Flex>
    </Box>
  );
}

// Meta tags
function Meta() {
  return (
    <Head>
      <title>Richmond Centre for Disability</title>
      <meta name="title" content="Richmond Centre for Disability" />
      <meta
        name="description"
        content="Apply for and renew Accessible Parking Permits in Richmond, BC"
      />
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  );
}

// Header
function Header() {
  return (
    <Center height={36} width="100%" backgroundColor="#f4f6fc">
      <ApplicantGrid alignItems="center">
        <GridItem colSpan={1}>
          <Image src={Logo} alt="RCD Logo" />
        </GridItem>
        <GridItem colSpan={9}>
          <Text textStyle="body-bold" textAlign="left">
            Richmond Centre for Disability
          </Text>
          <Text textStyle="body-regular" textAlign="left">
            Accessible Parking Permit
          </Text>
        </GridItem>
        <GridItem colStart={11} colSpan={2}>
          <Button variant="outline" size="lg">
            Go to main site
          </Button>
        </GridItem>
      </ApplicantGrid>
    </Center>
  );
}

// Footer
function Footer() {
  return (
    <Flex
      height="338px"
      width="100%"
      justifyContent="center"
      alignItems="center"
      backgroundColor="#f4f6fc"
    >
      <ApplicantGrid>
        <GridItem colSpan={2} textAlign="left">
          <Image src={Logo} alt="RCD Logo" />
          <Text textStyle="heading">Go to main site</Text>
        </GridItem>
        <GridItem colSpan={10}>
          <Flex>
            <Box textAlign="left">
              <Text textStyle="body-bold">Location</Text>
              <Text textStyle="body-regular">
                #842 - 5300, No.3 Rd Lansdowne Centre Richmond, BC
              </Text>
            </Box>
            <Spacer minWidth={16} />
            <Box textAlign="left">
              <Text textStyle="body-bold">Contact Info</Text>
              <Text textStyle="body-regular">Tel: 604-232-2404</Text>
              <Text textStyle="body-regular">Email: rcd@rcdrichmond.org</Text>
            </Box>
            <Spacer minWidth={16} />
            <Box textAlign="left">
              <Text textStyle="body-bold">Hours</Text>
              <Text textStyle="body-regular">Monday to Friday </Text>
              <Text textStyle="body-regular" marginBottom={4}>
                11 a.m. to 4 p.m.
              </Text>
              <Text textStyle="body-regular">We are closed on statutory holidays</Text>
            </Box>
            <Spacer minWidth={16} />
            <Box textAlign="left">
              <Text textStyle="body-bold">Social Media</Text>
              <Text textStyle="body-regular">
                Youtube {'\n'}
                Instagram{'\n'}
                Twitter{'\n'}
                LinkedIn
              </Text>
            </Box>
          </Flex>
        </GridItem>
      </ApplicantGrid>
    </Flex>
    // <Flex height={20} flexDirection="column" justifyContent="center" alignItems="center">
    //   <p>&copy; 2021 Richmond Centre for Disability. v0.0.1.</p>
    //   <p>
    //     A project by{' '}
    //     <a href="https://uwblueprint.org/" target="_blank" rel="noopener noreferrer">
    //       UW Blueprint
    //     </a>
    //     .
    //   </p>
    // </Flex>
  );
}

// Grid configuration for applicant-facing pages
type ApplicantGridProps = {
  children: ReactNode;
  alignItems?: string;
};

function ApplicantGrid({ children, alignItems }: ApplicantGridProps) {
  return (
    <Grid
      flexGrow={1}
      maxWidth={{ xl: '1200px' }}
      marginX="120px"
      templateColumns="repeat(12, 1fr)"
      gap="20px"
      alignItems={alignItems}
    >
      {children}
    </Grid>
  );
}
