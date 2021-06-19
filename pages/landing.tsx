//import { useRouter } from 'next/router'; // Routing
//import { useQuery } from '@apollo/client'; // GQL
import { useTranslation } from 'next-i18next'; // Translation hook
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Text } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/applicant/Layout'; // Layout wrapper

export default function Landing() {
  const { t } = useTranslation('common');
  //const router = useRouter();

  return (
    <Layout>
      <Text textStyle="display-xlarge">{t('landing')}</Text>
      <Text textStyle="display-medium">hello</Text>
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
