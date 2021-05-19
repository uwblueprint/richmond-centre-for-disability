import { ReactNode } from 'react';
import Link from 'next/link'; // Dynamic routing
import Head from 'next/head'; // HTML head handling

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props): JSX.Element {
  return (
    <div>
      <Meta />
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function Meta() {
  return (
    <Head>
      <title>Richmond Centre for Disability</title>
      <meta name="title" content="Richmond Centre for Disability" />
      <meta
        name="description"
        content="Apply for and renew Accessible Parking Permits in Richmond, BC"
      />
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  );
}

function Header() {
  return (
    <h1>
      <Link href="/">RCD</Link>
    </h1>
  );
}

function Footer() {
  return (
    <div>
      <p>&copy; 2020 Dancefest Adjudication Portal. v0.0.1.</p>
      <p>
        A project by{' '}
        <a href="https://uwblueprint.org/" target="_blank" rel="noopener noreferrer">
          UW Blueprint
        </a>
        .
      </p>
    </div>
  );
}
