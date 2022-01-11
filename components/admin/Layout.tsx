import { ReactNode } from 'react'; // React
import Head from 'next/head'; // HTML head handling
import Image from 'next/image'; // Optimized images
import { useSession, signOut } from 'next-auth/client'; // Session management
import { useRouter } from 'next/router'; // Routing

import {
  Box,
  Flex,
  Center,
  Grid,
  Button,
  Text,
  Tabs,
  TabList,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'; // Chakra UI
import { ChevronDownIcon } from '@chakra-ui/icons'; // Chakra UI icon
import { Role } from '@lib/types'; // Role enum
import { InternalPagePath, getTabIndex } from '@tools/admin/layout'; // Routing enums and tools
import Tab from '@components/admin/navbar/Tab'; // Custom Tab component
import { authorize } from '@tools/authorization';

type Props = {
  readonly children: ReactNode;
  readonly header?: boolean;
  readonly footer?: boolean;
};

// Internal Layout component
export default function Layout({ children, header = true, footer = true }: Props) {
  return (
    <Box textAlign="center" bg="background.grey">
      <Meta />
      <Flex flexDirection="column" alignItems="center" minHeight="100vh">
        {header && <Header />}
        <Flex
          flexGrow={1}
          width="100%"
          justifyContent="center"
          paddingY="32px"
          backgroundColor="background.grey"
        >
          <InternalGrid>{children}</InternalGrid>
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
      <title>RCD APP Administration Portal</title>
      <meta
        name="title"
        content="Richmond Centre for Disability's Accessible Parking Permit Administration Portal"
      />
      <meta
        name="description"
        content="Internal accessible parking permit management system for RCD"
      />
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="icon" href="/assets/favicon.ico" />
    </Head>
  );
}

// Header
function Header() {
  const [session] = useSession(); // Get user session
  const router = useRouter(); // Get router

  const { pathname } = router;

  return (
    <Flex
      height="80px"
      width="100%"
      backgroundColor="background.grey"
      borderBottom="1px solid"
      borderBottomColor="border.secondary"
    >
      <Flex height="100%" width="100%" justifyContent="space-between" marginX="80px">
        <Flex alignItems="center">
          <Box marginRight="12px">
            <Image src="/assets/logo.svg" alt="RCD Logo" height={48} width={31} priority />
          </Box>
          <Box>
            <Text as="h2" textStyle="button-semibold">
              APP Administration Portal
            </Text>
            <Text as="h3" textStyle="xsmall" textAlign="left">
              For RCD
            </Text>
          </Box>
        </Flex>
        <Flex flexGrow={1} justifyContent="center" alignItems="center">
          {session && (
            <>
              <Tabs height="100%" index={getTabIndex(pathname, session.role as Role)}>
                <TabList height="100%" borderBottomColor="transparent">
                  {authorize(session, [Role.Secretary]) && (
                    <>
                      <Tab
                        path={InternalPagePath.Requests}
                        additionalMatches={[InternalPagePath.Request]}
                      >
                        Requests
                      </Tab>
                      <Tab
                        path={InternalPagePath.PermitHolders}
                        additionalMatches={[InternalPagePath.PermitHolder]}
                      >
                        Permit Holders
                      </Tab>
                    </>
                  )}
                  {authorize(session, [Role.Accounting]) && (
                    <Tab path={InternalPagePath.Reports}>Reports</Tab>
                  )}
                  {authorize(session, []) && (
                    <Tab path={InternalPagePath.AdminManagement}>Admin Management</Tab>
                  )}
                </TabList>
              </Tabs>
            </>
          )}
        </Flex>
        <Flex alignItems="center">
          {session && (
            <>
              <Menu placement="bottom-end">
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  variant="ghost"
                  color="black"
                >
                  <Text as="p" textStyle="button-semibold">
                    {`${session.firstName} ${session.lastName}`}
                  </Text>
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      sessionStorage.clear();
                      signOut();
                    }}
                  >
                    Log out
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
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
  marginBottom = 20,
  isContent = true,
}: InternalGridProps) {
  return (
    <Grid
      flexGrow={1}
      width="100%"
      marginX={isContent ? '80px' : undefined}
      templateColumns="repeat(12, 1fr)"
      gap="20px"
      alignItems={alignItems}
      marginBottom={marginBottom}
    >
      {children}
    </Grid>
  );
}
