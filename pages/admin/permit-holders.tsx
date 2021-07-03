import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { Text, GridItem } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/internal/Layout'; // Layout component

// Internal home page
export default function PermitHolders() {
  return (
    <Layout>
      <GridItem colSpan={12} marginTop="64px">
        <Text textStyle="display-xlarge">Permit Holders</Text>
      </GridItem>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
