import { useEffect, useState } from 'react';
import { Box, ChakraProvider } from '@chakra-ui/react';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  Observable,
} from '@apollo/client';
import PermitHolderTypeahead from '@components/admin/permit-holders/Typeahead';
import DoctorTypeahead from '@components/admin/requests/doctor-information/DoctorTypeahead';

declare global {
  interface Window {
    searchFixtureReady: boolean;
    searchRequests: Array<{ search: string; limit: number; offset: number }>;
    searchDelays: Record<string, number>;
  }
}

// No HTTP GraphQL endpoint, authentication, database, or external integration exists in this fixture.
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new ApolloLink(
    operation =>
      new Observable(observer => {
        const filter = operation.variables.filter;
        const search = filter.search ?? filter.mspNumber;
        window.searchRequests ||= [];
        window.searchRequests.push({ search, limit: filter.limit, offset: filter.offset });
        const timer = setTimeout(() => {
          if (search === 'fail') return observer.error(new Error('Synthetic search failure'));
          const totalCount = search === 'none' ? 0 : 45;
          const result = Array.from(
            { length: Math.min(filter.limit, Math.max(0, totalCount - filter.offset)) },
            (_, index) => {
              const id = filter.offset + index + 1;
              return {
                id,
                firstName: search,
                middleName: null,
                lastName: `Synthetic ${id}`,
                dateOfBirth: '1950-01-01',
                mspNumber: String(id),
                phone: '0000000000',
                addressLine1: 'Synthetic address',
                addressLine2: null,
                city: 'Synthetic city',
                province: 'BC',
                country: 'Canada',
                postalCode: 'V0V0V0',
                status: 'ACTIVE',
              };
            }
          );
          observer.next({
            data: {
              [operation.operationName === 'SearchPhysicians' ? 'physicians' : 'applicants']: {
                result,
                totalCount,
              },
            },
          });
          observer.complete();
        }, window.searchDelays?.[`${search}:${filter.offset}`] ?? 30);
        return () => clearTimeout(timer);
      })
  ),
});

export default function SearchFixture(): JSX.Element {
  const [holder, setHolder] = useState(0);
  const [doctor, setDoctor] = useState('');
  useEffect(() => {
    window.searchFixtureReady = true;
  }, []);
  return (
    <ChakraProvider>
      <ApolloProvider client={client}>
        <Box p={6} width="540px" maxWidth="100%">
          <h2>Permit Holder</h2>
          <PermitHolderTypeahead onSelect={setHolder} />
          <output aria-label="Selected holder">{holder}</output>
          <h2>Physician</h2>
          <DoctorTypeahead onSelect={value => setDoctor(value.mspNumber)} />
          <output aria-label="Selected physician">{doctor}</output>
          <button type="button">After searches</button>
        </Box>
      </ApolloProvider>
    </ChakraProvider>
  );
}
