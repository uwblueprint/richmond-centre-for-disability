import Link from 'next/link'; // Link
import { useRouter } from 'next/router'; // Routing
import { useQuery } from '@apollo/client'; // GQL
import { useTranslation } from 'next-i18next'; // Translation hook
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; // Server side translations
import { useSession, signOut } from 'next-auth/client'; // Session hook and signOut handler

import { Button, Text, GridItem } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/applicant/Layout'; // Layout
import { GET_METADATA_QUERY, GetMetadataResponseType } from '@tools/pages/home'; // GQL types

export default function Home() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [session] = useSession();

  const { data } = useQuery<GetMetadataResponseType, void>(GET_METADATA_QUERY);
  const orgName = data?.meta.orgName;

  return (
    <Layout>
      <GridItem colSpan={12}>
        <Text as="h1" textStyle="display-large" marginBottom={8}>
          {t('welcome', { orgName })}
        </Text>
        <Link href="/" locale={router.locale === 'en' ? 'zh-CN' : 'en'}>
          <Button>Change language</Button>
        </Link>

        {session ? (
          <>
            <Text textStyle="body-regular">Currently logged in</Text>
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
            <Text textStyle="body-regular">Currently not logged in</Text>
            <Link href="/login">
              <Button>Go to login page</Button>
            </Link>
          </>
        )}
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
