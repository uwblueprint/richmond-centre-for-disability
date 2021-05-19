import { AppProps } from 'next/app'; // Next types

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}
