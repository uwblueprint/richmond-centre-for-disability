import { Text, GridItem } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/internal/Layout'; // Layout component

// Internal home page
export default function Admin() {
  return (
    <Layout>
      <GridItem colSpan={12}>
        <Text textStyle="display-xlarge">Internal management portal</Text>
      </GridItem>
    </Layout>
  );
}
