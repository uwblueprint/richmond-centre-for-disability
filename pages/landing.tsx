//import { useRouter } from 'next/router'; // Routing
//import { useQuery } from '@apollo/client'; // GQL
import { useTranslation } from 'next-i18next'; // Translation hook
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Text, Link, UnorderedList, ListItem, Button, GridItem } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/applicant/Layout'; // Layout wrapper

export default function Landing() {
  const { t } = useTranslation('common');
  //const router = useRouter();

  return (
    <Layout>
      <GridItem colSpan={8} colStart={1} mt="64px">
        <Text textStyle="display-xlarge" align="left">
          {t('landing')}
        </Text>
        <Text textStyle="display-small" align="left">
          Find the services you need related to your British Columbia accessible parking permit. You
          may chose to use our online service or download a physical form and email, mail or drop it
          off in person to RCD.{' '}
        </Text>
      </GridItem>
      <GridItem colSpan={5} colStart={1}>
        <Text textStyle="display-medium" align="left">
          Option 1: Online Service
        </Text>
        <Text textStyle="body-regular" align="left">
          You will need to complete the following steps for our online services
        </Text>
        <UnorderedList>
          <ListItem>Provide your user ID (available on your wallet card)</ListItem>
          <ListItem>Provide the last 4 digits of your phone number</ListItem>
          <ListItem>Provide your date of birth</ListItem>
          <ListItem>Complete the online form and pay a $26 processing fee</ListItem>
        </UnorderedList>
      </GridItem>
      <GridItem colSpan={5} colStart={7}>
        <Text textStyle="display-medium" align="left">
          Option 2: Download Form
        </Text>
        <Text textStyle="body-regular" align="left">
          If you would prefer to fill out a replacement form for a lost or stolen parking permit by
          hand, or want to request a new parking permit, please download the appropriate form below.
          <br></br>
          <br></br>
          After completing the form, either email (parkingpermit@rcdrichmond.org), mail or drop it
          off in person to RCD!
        </Text>
      </GridItem>

      <GridItem colSpan={5} colStart={1}>
        <Link href="#" style={{ textDecoration: 'none' }}>
          <Button colorScheme="primary" variant="solid">
            Renew your permit online
          </Button>
        </Link>
      </GridItem>
      <GridItem colSpan={5} colStart={7}>
        <Link href="#" style={{ textDecoration: 'none' }}>
          <Button colorScheme="primary" variant="solid">
            Download new form
          </Button>
        </Link>
      </GridItem>
      <GridItem colSpan={5} colStart={1}>
        <Link href="#" style={{ textDecoration: 'none' }}>
          <Button colorScheme="primary" variant="solid">
            Request a replacement online
          </Button>
        </Link>
      </GridItem>
      <GridItem colSpan={5} colStart={7}>
        <Link href="#" style={{ textDecoration: 'none' }}>
          <Button colorScheme="primary" variant="solid">
            Download replacement form
          </Button>
        </Link>
      </GridItem>
    </Layout>
  );
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};
