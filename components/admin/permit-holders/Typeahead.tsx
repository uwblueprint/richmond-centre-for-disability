import { Text } from '@chakra-ui/react'; //Chakra UI
import Typeahead from '@components/Typeahead'; // Typeahead component
import { formatFullName } from '@lib/utils/format'; // String formatter util
import { formatDateYYYYMMDD } from '@lib/utils/date'; // Date formatter util
import {
  PermitHolderResult,
  SearchPermitHoldersRequest,
  SearchPermitHoldersResponse,
  SEARCH_PERMIT_HOLDERS,
} from '@tools/admin/permit-holders/typeahead';
import { usePagedTypeahead } from '@tools/hooks/use-paged-typeahead';
import { SEARCH_PAGE_SIZE } from '@lib/utils/search-limits';

const variablesFor = (search: string, offset: number): SearchPermitHoldersRequest => ({
  filter: { search, offset, limit: SEARCH_PAGE_SIZE },
});
const pageFrom = (data: SearchPermitHoldersResponse) => data.applicants;

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
  const search = usePagedTypeahead(SEARCH_PERMIT_HOLDERS, variablesFor, pageFrom);

  /** Handle selecting permit holder */
  const handleSelect = (data: PermitHolderResult | undefined) => {
    if (data) {
      onSelect(data.id);
    }
  };

  return (
    <Typeahead
      id="permit-holder-typeahead"
      {...search}
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
      onSelect={handleSelect}
      placeholder="Search by user ID, first name or last name"
    />
  );
}
