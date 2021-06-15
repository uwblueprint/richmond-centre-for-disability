import { ReactNode } from 'react';
import Head from 'next/head'; // HTML head handling

import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Button,
  Center,
  Text,
  Spacer,
} from '@chakra-ui/react'; // Chakra UI
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
          <Grid templateColumns="repeat(12, 1fr)" gap={6}>
            {children}
          </Grid>
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
      <Grid maxWidth={{ xl: 1200 }} templateColumns="repeat(12, 1fr)" alignItems="center" gap={6}>
        <GridItem colSpan={1}>
          <Image src={Logo} alt="RCD Logo" />
        </GridItem>
        <GridItem colSpan={3}>
          <Heading fontSize={18} textAlign="left">
            Richmond Centre for Disability
          </Heading>
          <Heading fontSize={18} fontWeight={400} textAlign="left">
            Accessible Parking Permit
          </Heading>
        </GridItem>
        <GridItem colStart={11} colSpan={2}>
          <Button width="100%">Go to main site</Button>
        </GridItem>
      </Grid>
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
      <Grid flexGrow={1} maxWidth={{ xl: '1200px' }} templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={2} textAlign="left">
          <Image src={Logo} alt="RCD Logo" />
          <Text>Go to main site</Text>
        </GridItem>
        <GridItem colSpan={10}>
          <Flex>
            <Box flex={1} textAlign="left">
              <Text>Location</Text>
              <Text>
                #842 - 5300, No.3 Rd{'\n'} Lansdowne Centre{'\n'} Richmond, BC
              </Text>
            </Box>
            <Spacer />
            <Box flex={1} textAlign="left">
              <Text>Contact Info</Text>
              <Text>
                Tel: 604-232-2404{'\n'}
                Email: rcd@rcdrichmond.org
              </Text>
            </Box>
            <Spacer />
            <Box flex={1} textAlign="left">
              <Text>Hours</Text>
              <Text>
                Monday to Friday{'\n'}
                11 a.m. to 4 p.m.{'\n\n'}
                We are closed on{'\n'} statutory holidays
              </Text>
            </Box>
            <Spacer />
            <Box flex={1} textAlign="left">
              <Text>Social Media</Text>
              <Text>
                Youtube {'\n'}
                Instagram{'\n'}
                Twitter{'\n'}
                LinkedIn
              </Text>
            </Box>
          </Flex>
        </GridItem>
      </Grid>
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
