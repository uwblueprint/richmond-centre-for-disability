import { useQuery } from '@apollo/client'; // Apollo
import { Text } from '@chakra-ui/react'; //Chakra UI
import Typeahead from '@components/Typeahead'; // Typeahead component
import { formatDateYYYYMMDD } from '@lib/utils/format'; // Date formatter util
import {
  GetPermitHoldersRequest,
  GetPermitHoldersResponse,
  GET_PERMIT_HOLDERS_QUERY,
  PermitHolder,
} from '@tools/admin/permit-holders/graphql/get-permit-holders'; // Permit holders GQL query
import { useState } from 'react'; // React

// Permit Holder Typeahead props
type Props = {
  onSelect: (selected: PermitHolder | undefined) => void; // handle selected permit holder
};

/**
 * Typeahead component to search for permit holders via asynchronous queries
 * @returns Permit holder typeahead component to search for permit holders
 */
export default function PermitHolderTypeahead(props: Props) {
  const { onSelect } = props;
  const [isTypeaheadLoading, setIsTypeaheadLoading] = useState(false);
  const [permitHolderResults, setPermitHolderResults] = useState<PermitHolder[]>([]);
  const [searchString, setSearchString] = useState('');

  // permit holders query
  useQuery<GetPermitHoldersResponse, GetPermitHoldersRequest>(GET_PERMIT_HOLDERS_QUERY, {
    variables: {
      filter: {
        search: searchString,
      },
    },
    onCompleted: ({ applicants: { result } }) => {
      setPermitHolderResults(
        result.map(record => ({
          ...record,
        }))
      );

      setIsTypeaheadLoading(false);
    },
  });

  const handleSearch = (query: string) => {
    setIsTypeaheadLoading(true);
    setSearchString(query);
  };

  return (
    <Typeahead
      isLoading={isTypeaheadLoading}
      onSearch={handleSearch}
      renderMenuItemChildren={(option: PermitHolder) => {
        return (
          <>
            <Text textStyle="body-regular" mt="8px" mb="4px" ml="4px">
              {option.firstName} {option.lastName}
            </Text>
            <Text textStyle="caption" textColor="text.secondary" mb="8px" ml="4px">
              Date of Birth: {formatDateYYYYMMDD(option.dateOfBirth)}
            </Text>
          </>
        );
      }}
      labelKey={(option: PermitHolder) => `${option.firstName} ${option.lastName}`}
      results={permitHolderResults}
      onSelect={onSelect}
      placeholder="Search by user ID, first name or last name"
    />
  );
}