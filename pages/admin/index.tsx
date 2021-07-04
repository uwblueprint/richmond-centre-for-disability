import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { Text, GridItem } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/internal/Layout'; // Layout component
import { Role } from '@lib/types'; // Role enum
import { authorize } from '@tools/authorization'; // Page authorization

// Internal home page - view APP requests
export default function Requests() {
  return (
    <Layout>
      <GridItem colSpan={12} marginTop="64px">
        <Text textStyle="display-xlarge">Internal management portal</Text>
      </GridItem>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  // Only secretaries and admins can access APP requests
  if (authorize(session, [Role.Secretary])) {
    return {
      props: {},
    };
  }

  // Redirect to login if roles requirement not satisfied
  return {
    redirect: {
      destination: '/admin/login',
      permanent: false,
    },
  };
};
