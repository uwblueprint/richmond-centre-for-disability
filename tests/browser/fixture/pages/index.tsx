import { useState } from 'react';
import { ChakraProvider, Box, Heading } from '@chakra-ui/react';
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
    searchRequests: Array<{ operation: string; filter: Record<string, any> }>;
    searchDelay: number;
  }
}

// This fixture has no HTTP GraphQL endpoint or database. Only synthetic local results are used.
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new ApolloLink(
    operation =>
      new Observable(observer => {
        const filter = operation.variables.filter;
        window.searchRequests ||= [];
        window.searchRequests.push({ operation: operation.operationName, filter });
        const query = filter.search ?? filter.mspNumber;
        const timer = setTimeout(() => {
          if (query === 'fail') {
            observer.error(new Error('Synthetic unavailable search'));
            return;
          }
          const totalCount = query === 'none' ? 0 : 45;
          const result = Array.from(
            { length: Math.min(filter.limit, Math.max(0, totalCount - filter.offset)) },
            (_, index) => {
              const id = filter.offset + index + 1;
              return {
                id,
                firstName: query,
                middleName: null,
                lastName: `Synthetic ${id}`,
                dateOfBirth: '1950-01-01',
                mspNumber: `${id}`,
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
        }, window.searchDelay || 30);
        return () => clearTimeout(timer);
      })
  ),
});

export default function SearchFixture(): JSX.Element {
  const [holder, setHolder] = useState(0);
  const [doctor, setDoctor] = useState('');
  return (
    <ChakraProvider>
      <ApolloProvider client={client}>
        <Box p={6} width="540px" maxWidth="100%">
          <Heading size="sm" mb={2}>
            Permit Holder
          </Heading>
          <PermitHolderTypeahead onSelect={setHolder} />
          <output aria-label="Selected holder">{holder}</output>
          <Heading size="sm" mt={6} mb={2}>
            Physician
          </Heading>
          <DoctorTypeahead onSelect={value => setDoctor(value.mspNumber)} />
          <output aria-label="Selected physician">{doctor}</output>
        </Box>
      </ApolloProvider>
    </ChakraProvider>
  );
}
