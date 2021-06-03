import { AppProps } from 'next/app'; // Next types
import { ChakraProvider } from '@chakra-ui/react'; // ChakraProvider
import { ApolloClient, InMemoryCache } from '@apollo/client'; // Apollo client
import { ApolloProvider } from '@apollo/client/react'; // Apollo provider
import { appWithTranslation } from 'next-i18next'; // HOC for adding translation to _app

const apolloClient = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </ChakraProvider>
  );
}

export default appWithTranslation(App);
