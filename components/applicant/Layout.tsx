import { ReactNode } from 'react'; // React
import Head from 'next/head'; // HTML head handling
import Link from 'next/link'; // Client-side linking
import Image from 'next/image'; // Optimized images

import { Box, Flex, Grid, GridItem, Button, Center, Text, Spacer, Divider } from '@chakra-ui/react'; // Chakra UI

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
        <Box flexGrow={1} paddingTop={20}>
          <ApplicantGrid isContent>{children}</ApplicantGrid>
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
          <Link href="/">
            <Box cursor="pointer">
              <Image src="/assets/logo.svg" alt="RCD Logo" height={92} width={82} />
            </Box>
          </Link>
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
    <Center flexDirection="column" width="100%" paddingTop={20} backgroundColor="#f4f6fc">
      <ApplicantGrid marginBottom={10}>
        <GridItem colSpan={2} textAlign="left">
          <Image src="/assets/logo.svg" alt="RCD Logo" height={92} width={82} />
          <a href="https://www.rcdrichmond.org/">
            <Text textStyle="heading">Go to main site</Text>
          </a>
        </GridItem>
        <GridItem colStart={3} colSpan={10}>
          <Flex>
            <Box flexGrow={1} textAlign="left">
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

            <Spacer minWidth={16} />
            <Box flexGrow={1} textAlign="left">
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
            <Spacer minWidth={16} />
            <Box flexGrow={1} textAlign="left">
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
            <Spacer minWidth={16} />
            <Box flexGrow={1} textAlign="left">
              <Text marginBottom={4} textStyle="body-bold">
                Contact Info
              </Text>
              <Text textStyle="caption">Tel: 604-232-2404</Text>
              <a href="mailto:parkingpermit@richmond.org">
                <Text textStyle="caption">Email: parkingpermit@rcdrichmond.org</Text>
              </a>
            </Box>
          </Flex>
        </GridItem>
      </ApplicantGrid>
      <Divider />
      <Flex width="100%" maxWidth="1200px" paddingY={10} justifyContent="space-between">
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
  isContent?: boolean;
};

function ApplicantGrid({
  children,
  alignItems,
  marginBottom,
  isContent = false,
}: ApplicantGridProps) {
  return (
    <Grid
      flexGrow={1}
      width="100%"
      maxWidth={{ xl: '1200px' }}
      marginX={isContent ? undefined : '120px'}
      templateColumns="repeat(12, 1fr)"
      gap="20px"
      alignItems={alignItems}
      marginBottom={marginBottom}
    >
      {children}
    </Grid>
  );
}
