import { GridItem, Text, VStack } from '@chakra-ui/react';
import Layout from '@components/applicant/Layout';
import { NextPage } from 'next';
import Link from 'next/link';

const NotFound: NextPage = () => {
  return (
    <Layout>
      <GridItem colSpan={12}>
        <VStack align="stretch" spacing="24px" minHeight="calc(100vh - 280px)">
          <Text as="h1" textStyle="display-xlarge">
            404 Page not found
          </Text>
          <Link href="/" passHref>
            <Text as="a" textStyle="button-regular" color="primary">
              Back to home
            </Text>
          </Link>
        </VStack>
      </GridItem>
    </Layout>
  );
};

export default NotFound;
