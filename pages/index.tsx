import Link from 'next/link'; // Link
import { useRouter } from 'next/router'; // Routing
import { useQuery } from '@apollo/client'; // GQL
import { useTranslation } from 'next-i18next'; // Translation hook
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; // Server side translations
import { useSession, signOut } from 'next-auth/client'; // Session hook and signOut handler

import { Heading, Button } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/Layout'; // Layout
import { GET_METADATA_QUERY, GetMetadataResponseType } from '@tools/pages/home'; // GQL types

export default function Home() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [session] = useSession();

  const { data } = useQuery<GetMetadataResponseType, void>(GET_METADATA_QUERY);
  const orgName = data?.meta.orgName;

  return (
    <Layout>
      <Heading as="h2" marginBottom={8}>
        {t('welcome', { orgName })}
      </Heading>
      <Link href="/" locale={router.locale === 'en' ? 'zh-CN' : 'en'}>
        <Button>Change language</Button>
      </Link>
      {session ? (
        <>
          <Heading as="p">Currently logged in</Heading>
          <Button
            onClick={() => {
              sessionStorage.clear();
              signOut();
            }}
          >
            Sign out
          </Button>
        </>
      ) : (
        <>
          <Heading as="p">Currently not logged in</Heading>
          <Link href="/login">
            <Button>Go to login page</Button>
          </Link>
        </>
      )}
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
