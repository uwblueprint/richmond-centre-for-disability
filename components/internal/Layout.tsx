import { ReactNode } from 'react'; // React
import Head from 'next/head'; // HTML head handling
import Link from 'next/link'; // Client side linking
import { useSession, signOut } from 'next-auth/client'; // Session management

import { Box, Flex, Center, Grid, Button, Image, Text } from '@chakra-ui/react'; // Chakra UI
import { Role } from '@lib/types'; // Role enum
import Logo from '@assets/logo.svg'; // Logo

type Props = {
  children: ReactNode;
};

// Internal Layout component
export default function Layout({ children }: Props) {
  return (
    <Box textAlign="center">
      <Meta />
      <Flex flexDirection="column" alignItems="center" minHeight="100vh">
        <Header />
        <Box flexGrow={1} paddingTop={20}>
          <InternalGrid isContent>{children}</InternalGrid>
        </Box>
        <Footer />
      </Flex>
    </Box>
  );
}

// Meta tags
function Meta() {
  return (
    <Head>
      <title>Richmond Centre for Disability Admin Portal</title>
      <meta name="title" content="Richmond Centre for Disability Admin Portal" />
      <meta
        name="description"
        content="Internal accessible parking permit management system for RCD"
      />
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  );
}

// Header
function Header() {
  const [session] = useSession();

  return (
    <Center height={24} width="100%" backgroundColor="#f4f6fc">
      <Flex height="100%" width="100%" maxWidth={{ xl: '1280px' }} justifyContent="space-between">
        <Flex flexGrow={1} padding={2} alignItems="center">
          <Image src={Logo} alt="RCD Logo" height="100%" display="inline-block" marginRight={8} />
          {session && (
            <>
              <Link href="#">
                <Text textStyle="body-regular" display="inline-block" marginRight={8}>
                  Requests
                </Text>
              </Link>
              <Link href="#">
                <Text textStyle="body-regular" display="inline-block" marginRight={8}>
                  Permit Holders
                </Text>
              </Link>
              {session.role === Role.Admin && (
                <Link href="#">
                  <Text textStyle="body-regular" display="inline-block" marginRight={8}>
                    Admin Management
                  </Text>
                </Link>
              )}
            </>
          )}
        </Flex>
        <Flex alignItems="center">
          {session && (
            <>
              <Text
                textStyle="body-regular"
                color="primary"
                display="inline-block"
                marginRight={8}
              >{`${session.firstName} ${session.lastName}`}</Text>
              <Button
                onClick={() => {
                  sessionStorage.clear();
                  signOut();
                }}
              >
                Sign out
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Center>
  );
}

// Footer
function Footer() {
  return (
    <Center width="100%" flexDirection="column" paddingBottom={4}>
      <Text textStyle="caption">&copy; 2021 Richmond Centre for Disability. v0.0.1.</Text>
      <Text textStyle="caption">
        A project by{' '}
        <a href="https://uwblueprint.org/" target="_blank" rel="noopener noreferrer">
          UW Blueprint
        </a>
        .
      </Text>
    </Center>
  );
}

// Grid configuration for internal pages
type InternalGridProps = {
  children: ReactNode;
  alignItems?: string;
  marginBottom?: number;
  isContent?: boolean;
};

function InternalGrid({
  children,
  alignItems,
  marginBottom,
  isContent = false,
}: InternalGridProps) {
  return (
    <Grid
      flexGrow={1}
      width="100%"
      maxWidth={{ xl: '1280px' }}
      marginX={isContent ? undefined : '80px'}
      templateColumns="repeat(12, 1fr)"
      gap="20px"
      alignItems={alignItems}
      marginBottom={marginBottom}
    >
      {children}
    </Grid>
  );
}
