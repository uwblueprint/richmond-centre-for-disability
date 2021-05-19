import { AppProps } from 'next/app'; // Next types
import { ChakraProvider } from '@chakra-ui/react'; // ChakraProvider

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
