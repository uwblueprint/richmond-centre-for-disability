import { AppProps } from 'next/app'; // Next types
import { ErrorBoundary } from '@sentry/nextjs'; // Sentry Error Types
import { ChakraProvider } from '@chakra-ui/react'; // ChakraProvider
import { ApolloClient, InMemoryCache } from '@apollo/client'; // Apollo client
import { ApolloProvider } from '@apollo/client/react'; // Apollo provider
import { appWithTranslation } from 'next-i18next'; // HOC for adding translation to _app
import { Provider } from 'next-auth/client'; // Next Auth provider
import RenewalFlow from '@containers/RenewalFlow'; // Renewal flow state
import '../sentry.client.config.ts'; // Sentry Client

import theme from '@tools/theme'; // Design system theme config
import '@fontsource/noto-sans/400.css'; // Noto sans normal
import '@fontsource/noto-sans/700.css'; // Noto sans bold

const apolloClient = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary fallback={<div>Something went wrong.</div>}>
      <Provider session={pageProps.session}>
        <RenewalFlow.Provider>
          <ChakraProvider theme={theme}>
            <ApolloProvider client={apolloClient}>
              <Component {...pageProps} />
            </ApolloProvider>
          </ChakraProvider>
        </RenewalFlow.Provider>
      </Provider>
    </ErrorBoundary>
  );
}

export default appWithTranslation(App);
