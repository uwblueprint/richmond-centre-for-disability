// DoctorTypeahead.tsx
import { Text } from '@chakra-ui/react';
import Typeahead from '@components/Typeahead'; // generic typeahead component
import { formatFullName } from '@lib/utils/format'; // utility to join names
import {
  DoctorResult,
  SearchDoctorsRequest,
  SearchDoctorsResponse,
  SEARCH_DOCTORS,
} from '@tools/admin/requests/doctor-typeahead';
import { usePagedTypeahead } from '@tools/hooks/use-paged-typeahead';
import { SEARCH_PAGE_SIZE } from '@lib/utils/search-limits';

const variablesFor = (mspNumber: string, offset: number): SearchDoctorsRequest => ({
  filter: { mspNumber, offset, limit: SEARCH_PAGE_SIZE },
});
const pageFrom = (data: SearchDoctorsResponse) => data.physicians;

type Props = {
  /** Callback when a physician is selected; passes the physician’s data */
  onSelect: (doctor: DoctorResult) => void;
};

export default function DoctorTypeahead({ onSelect }: Props) {
  const search = usePagedTypeahead(SEARCH_DOCTORS, variablesFor, pageFrom);

  /** Called when a physician is selected in the typeahead */
  const handleSelect = (doctor: DoctorResult | undefined) => {
    if (doctor) {
      onSelect(doctor);
    }
  };

  return (
    <Typeahead
      id="physician-typeahead"
      {...search}
      renderMenuItemChildren={({ firstName, lastName, mspNumber, phone }: DoctorResult) => {
        return (
          <>
            <Text textStyle="body-regular" mt="8px" mb="4px" ml="4px">
              {formatFullName(firstName, undefined, lastName)}
            </Text>
            <Text textStyle="caption" textColor="text.secondary" mb="8px" ml="4px">
              MSP {mspNumber} | Phone {phone}
            </Text>
          </>
        );
      }}
      labelKey={(option: DoctorResult) => `${option.firstName} ${option.lastName}`}
      onSelect={handleSelect}
      placeholder="Search by doctor's MSP number"
    />
  );
}
