import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { Text, GridItem } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/admin/Layout'; // Layout component
import { Role } from '@lib/types'; // Role enum
import { authorize } from '@tools/authorization'; // Page authorization

// Internal home page
export default function Reports() {
  return (
    <Layout>
      <GridItem colSpan={12}>
        <Text textStyle="display-xlarge">Reports</Text>
      </GridItem>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  // Only accounting and admins can access reports
  if (authorize(session, [Role.Accounting])) {
    return {
      props: {},
    };
  }

  // If user is not accounting or admin, redirect to login
  return {
    redirect: {
      destination: '/admin/login',
      permanent: false,
    },
  };
};
