import { AppProps } from "next/app"; // Next types

// eslint-disable-next-line
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
