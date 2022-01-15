import { useQuery } from '@apollo/client'; // Apollo
import { Text } from '@chakra-ui/react'; //Chakra UI
import Typeahead from '@components/Typeahead'; // Typeahead component
import { formatDateYYYYMMDD, formatFullName } from '@lib/utils/format'; // Date formatter util
import {
  PermitHolderResult,
  SearchPermitHoldersRequest,
  SearchPermitHoldersResponse,
  SEARCH_PERMIT_HOLDERS,
} from '@tools/admin/permit-holders/typeahead';
import { useState } from 'react'; // React

// Permit Holder Typeahead props
type Props = {
  onSelect: (applicantId: number) => void; // handle selected permit holder
};

/**
 * Typeahead component to search for permit holders via asynchronous queries
 * @returns Permit holder typeahead component to search for permit holders
 */
export default function PermitHolderTypeahead(props: Props) {
  const { onSelect } = props;
  const [searchString, setSearchString] = useState('');

  // permit holders query
  const { data, loading } = useQuery<SearchPermitHoldersResponse, SearchPermitHoldersRequest>(
    SEARCH_PERMIT_HOLDERS,
    {
      variables: {
        filter: {
          search: searchString,
        },
      },
    }
  );

  /** Handle selecting permit holder */
  const handleSelect = (data: PermitHolderResult | undefined) => {
    if (data) {
      onSelect(data.id);
    }
  };

  return (
    <Typeahead
      isLoading={loading}
      onSearch={setSearchString}
      renderMenuItemChildren={({
        firstName,
        middleName,
        lastName,
        dateOfBirth,
      }: PermitHolderResult) => {
        return (
          <>
            <Text textStyle="body-regular" mt="8px" mb="4px" ml="4px">
              {formatFullName(firstName, middleName, lastName)}
            </Text>
            <Text textStyle="caption" textColor="text.secondary" mb="8px" ml="4px">
              Date of Birth: {formatDateYYYYMMDD(dateOfBirth)}
            </Text>
          </>
        );
      }}
      labelKey={(option: PermitHolderResult) => `${option.firstName} ${option.lastName}`}
      results={data?.applicants.result || []}
      onSelect={handleSelect}
      placeholder="Search by user ID, first name or last name"
    />
  );
}
