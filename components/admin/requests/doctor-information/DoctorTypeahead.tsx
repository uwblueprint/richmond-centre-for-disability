// DoctorTypeahead.tsx
import { useState } from 'react';
import { Text } from '@chakra-ui/react';
import { useQuery } from '@tools/hooks/graphql'; // your Apollo wrapper hook
import Typeahead from '@components/Typeahead'; // generic typeahead component
import { formatFullName } from '@lib/utils/format'; // utility to join names
import {
  DoctorResult,
  SearchDoctorsRequest,
  SearchDoctorsResponse,
  SEARCH_DOCTORS,
} from '@tools/admin/requests/doctor-typeahead';

type Props = {
  /** Callback when a physician is selected; passes the physician’s data */
  onSelect: (doctor: DoctorResult) => void;
};

export default function DoctorTypeahead({ onSelect }: Props) {
  const [searchString, setSearchString] = useState('');

  // Run the query using the input as the filter
  const { data, loading, error } = useQuery<SearchDoctorsResponse, SearchDoctorsRequest>(
    SEARCH_DOCTORS,
    {
      variables: {
        filter: {
          mspNumber: searchString,
        },
      },
    }
  );

  if (error) {
    console.error('Error fetching physicians ', error);
  }

  /** Called when a physician is selected in the typeahead */
  const handleSelect = (doctor: DoctorResult | undefined) => {
    if (doctor) {
      onSelect(doctor);
    }
  };

  return (
    <Typeahead
      isLoading={loading}
      onSearch={setSearchString}
      renderMenuItemChildren={({ firstName, lastName, phone }: DoctorResult) => {
        return (
          <>
            <Text textStyle="body-regular" mt="8px" mb="4px" ml="4px">
              {formatFullName(firstName, undefined, lastName)}
            </Text>
            <Text textStyle="caption" textColor="text.secondary" mb="8px" ml="4px">
              Phone {phone}
            </Text>
          </>
        );
      }}
      labelKey={(option: DoctorResult) => `${option.firstName} ${option.lastName}`}
      results={data?.physicians?.result || []}
      onSelect={handleSelect}
      placeholder="Search by doctor's MSP number"
    />
  );
}
