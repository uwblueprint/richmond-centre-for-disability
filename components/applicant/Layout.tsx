import { ReactNode } from 'react'; // React
import Head from 'next/head'; // HTML head handling
import Link from 'next/link'; // Client-side linking
import Image from 'next/image'; // Optimized images

import { Box, Flex, Grid, GridItem, Button, Center, Text, Divider, Stack } from '@chakra-ui/react'; // Chakra UI

type Props = {
  readonly children: ReactNode;
  readonly header?: boolean;
  readonly footer?: boolean;
};

// Applicant Layout component
export default function Layout({ children, header = true, footer = true }: Props) {
  return (
    <Box width="100vw" textAlign="center">
      <Meta />
      <Flex width="100%" flexDirection="column" alignItems="stretch" minHeight="100vh">
        {header && <Header />}
        <Flex
          flexGrow={1}
          width="100%"
          justifyContent="center"
          paddingY={{ sm: '44px', md: '64px' }}
          backgroundColor="background.grey"
        >
          <ApplicantGrid>{children}</ApplicantGrid>
        </Flex>
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
      <link rel="icon" href="/assets/favicon.ico" />
    </Head>
  );
}

// Header
function Header() {
  return (
    <Center height="108px" width="100%" backgroundColor="background.grey">
      <ApplicantGrid alignItems="center">
        <GridItem colSpan={{ sm: 2, md: 1 }}>
          <Link href="/">
            <Flex justifyContent="left" cursor="pointer">
              <Image src="/assets/logo.svg" alt="RCD Logo" height={68} width={48} priority />
            </Flex>
          </Link>
        </GridItem>
        <GridItem colSpan={{ sm: 10, md: 9 }}>
          <Text textStyle="body-bold" textAlign="left">
            Richmond Centre for Disability
          </Text>
          <Text textStyle="body-regular" textAlign="left">
            Accessible Parking Permit
          </Text>
        </GridItem>
        <GridItem colStart={11} colSpan={2} display={{ sm: 'none', md: 'initial' }}>
          <a href="https://www.rcdrichmond.org/">
            <Button variant="outline" size="lg">
              Go to main site
            </Button>
          </a>
        </GridItem>
      </ApplicantGrid>
    </Center>
  );
}

// Footer
function Footer() {
  return (
    <Center
      flexDirection="column"
      width="100%"
      paddingTop={{ sm: '32px', md: 20 }}
      backgroundColor="background.grey"
    >
      <ApplicantGrid marginBottom={10}>
        <GridItem colSpan={{ sm: 12, md: 2 }} textAlign={{ sm: 'center', md: 'left' }}>
          <Image src="/assets/logo.svg" alt="RCD Logo" height={92} width={82} priority />
          <a href="https://www.rcdrichmond.org/">
            <Text textStyle="heading">Go to main site</Text>
          </a>
        </GridItem>
        <GridItem colStart={{ sm: 1, md: 3 }} colSpan={{ sm: 12, md: 10 }}>
          <Stack
            flexDirection={{ sm: 'column', md: 'initial' }}
            spacing={{ sm: '32px', md: '16px' }}
          >
            <Box flexGrow={1} textAlign={{ sm: 'center', md: 'left' }}>
              <Text marginBottom={4} textStyle="body-bold">
                Location
              </Text>
              <Text textStyle="caption">
                #842 - 5300, No.3 Rd
                <br />
                Lansdowne Centre
                <br />
                Richmond, BC
                <br />
                V6X 2X9
              </Text>
            </Box>
            <Box flexGrow={1} textAlign={{ sm: 'center', md: 'left' }}>
              <Text marginBottom={4} textStyle="body-bold">
                Hours
              </Text>
              <Text textStyle="caption">Monday to Friday </Text>
              <Text textStyle="caption" marginBottom={4}>
                11 a.m. to 4 p.m.
              </Text>
              <Text textStyle="caption">
                We are closed on
                <br /> statutory holidays
              </Text>
            </Box>
            <Box flexGrow={1} textAlign={{ sm: 'center', md: 'left' }}>
              <Text marginBottom={4} textStyle="body-bold">
                Social Media
              </Text>
              <a href="https://www.youtube.com/c/rcd2020">
                <Text marginBottom={2} textStyle="caption">
                  YouTube
                </Text>
              </a>
              <a href="https://www.instagram.com/richmond_rcd/?hl=en">
                <Text marginBottom={2} textStyle="caption">
                  Instagram
                </Text>
              </a>
              <a href="https://twitter.com/RCD_Richmond">
                <Text marginBottom={2} textStyle="caption">
                  Twitter
                </Text>
              </a>
              <a href="https://www.linkedin.com/company/richmond-centre-for-disability/">
                <Text marginBottom={2} textStyle="caption">
                  LinkedIn
                </Text>
              </a>
            </Box>
            <Box flexGrow={1} textAlign={{ sm: 'center', md: 'left' }}>
              <Text marginBottom={4} textStyle="body-bold">
                Contact Info
              </Text>
              <Text textStyle="caption">Tel: 604-232-2404</Text>
              <a href="mailto:parkingpermit@richmond.org">
                <Text textStyle="caption">Email: parkingpermit@rcdrichmond.org</Text>
              </a>
            </Box>
          </Stack>
        </GridItem>
      </ApplicantGrid>
      <Divider />
      <Flex
        width="100%"
        maxWidth="1200px"
        paddingY={10}
        paddingX={{ sm: '32px', md: 'initial' }}
        flexDirection={{ sm: 'column', md: 'initial' }}
        justifyContent="space-between"
      >
        <Text textStyle="body-regular">© 2021 Richmond Centre for Disability</Text>
        <Box>
          <a href="#">
            <Text display="inline-block" textStyle="body-regular" marginRight={7} color="primary">
              Privacy Policy
            </Text>
          </a>
          <a href="#">
            <Text display="inline-block" textStyle="body-regular" color="primary">
              Terms & Conditions
            </Text>
          </a>
        </Box>
      </Flex>
    </Center>
  );
}

// Grid configuration for applicant-facing pages
type ApplicantGridProps = {
  children: ReactNode;
  alignItems?: string;
  marginBottom?: number;
};

function ApplicantGrid({ children, alignItems, marginBottom }: ApplicantGridProps) {
  return (
    <Grid
      flexGrow={1}
      width="100%"
      maxWidth={{ xl: '1200px' }}
      marginX={{ sm: '16px', md: '80px', lg: '120px' }}
      templateColumns="repeat(12, 1fr)"
      gap={{ sm: '8px', md: '32px', lg: '20px' }}
      alignItems={alignItems}
      marginBottom={marginBottom}
    >
      {children}
    </Grid>
  );
}
