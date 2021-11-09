import { useQuery } from '@apollo/client';
import { Text } from '@chakra-ui/layout';
import Typeahead from '@components/Typeahead';
import { formatDateYYYYMMDD } from '@lib/utils/format';
import {
  GetPermitHoldersRequest,
  GetPermitHoldersResponse,
  GET_PERMIT_HOLDERS_QUERY,
} from '@tools/pages/admin/permit-holders/get-permit-holders';
import { useState } from 'react';

type PermitHolderItem = {
  label: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
};

export default function PermitHolderTypeahead() {
  const [isTypeaheadLoading, setIsTypeaheadLoading] = useState(false);
  const [permitHolderResults, setPermitHolderResults] = useState<PermitHolderItem[]>([]);
  const [searchString, setSearchString] = useState<string>();

  useQuery<GetPermitHoldersResponse, GetPermitHoldersRequest>(GET_PERMIT_HOLDERS_QUERY, {
    variables: {
      filter: {
        search: searchString,
      },
    },
    onCompleted: ({ applicants: { result } }) => {
      setPermitHolderResults(
        result.map(record => ({
          label: record.firstName + ' ' + record.lastName,
          firstName: record.firstName,
          lastName: record.lastName,
          dateOfBirth: record.dateOfBirth,
        }))
      );

      setIsTypeaheadLoading(false);
    },
  });

  const searchPermitHolders = (query: string) => {
    setIsTypeaheadLoading(true);
    setSearchString(query);
  };

  return (
    <Typeahead
      isLoading={isTypeaheadLoading}
      onSearch={searchPermitHolders}
      renderMenuItemChildren={option => {
        return (
          <div>
            <Text textStyle="body-regular" mt="8px" mb="4px" ml="4px">
              {option.label}
            </Text>
            <Text textStyle="caption" textColor="text.secondary" mb="8px" ml="4px">
              Date of Birth: {formatDateYYYYMMDD(option.dateOfBirth)}
            </Text>
          </div>
        );
      }}
      results={permitHolderResults}
      placeholder="Search by user ID, first name or last name"
    />
  );
}
