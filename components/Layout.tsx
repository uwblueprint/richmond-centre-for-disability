import { ReactNode } from 'react';
import Link from 'next/link'; // Dynamic routing
import Head from 'next/head'; // HTML head handling

import { Heading, Box, Flex } from '@chakra-ui/react'; // Chakra UI

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props): JSX.Element {
  return (
    <Box textAlign="center">
      <Flex flexDirection="column" minHeight="100vh">
        <Meta />
        <Header />
        <Box flexGrow={1}>{children}</Box>
        <Footer />
      </Flex>
    </Box>
  );
}

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

function Header() {
  return (
    <Flex height={32} justifyContent="center" alignItems="center">
      <h1>
        <Link href="/">
          <Heading as="h1">RCD</Heading>
        </Link>
      </h1>
    </Flex>
  );
}

function Footer() {
  return (
    <Flex height={16} justifyContent="center" alignItems="center">
      <p>&copy; 2021 Richmond Centre for Disability. v0.0.1.</p>
      <p>
        A project by{' '}
        <a href="https://uwblueprint.org/" target="_blank" rel="noopener noreferrer">
          UW Blueprint
        </a>
        .
      </p>
    </Flex>
  );
}
