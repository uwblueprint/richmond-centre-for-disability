import { useState } from 'react'; // React
import { DateUtils, RangeModifier } from 'react-day-picker'; // React DayPicker

// useDayPicker inital parameters
type useDayPicker = {
  from: Date | undefined;
  to: Date | undefined;
};

// useDayPicker return type
type useDayPickerReturnType = {
  dateRange: RangeModifier;
  addDayToDateRange: (day: Date) => void;
  dateRangeString: () => string;
};

/**
 * Custom hook for managing DayPicker state
 * @param {useDayPicker} initialDateRange - Initial date range object with from and to properties
 * @returns dateRange state, addDayToDateRange function, dateRangeString function to display dates (YYYY-MM-DD - YYYY-MM-DD)
 */
export default function useDayPicker(initalDateRange: useDayPicker): useDayPickerReturnType {
  const [dateRange, setDateRange] = useState<RangeModifier>(initalDateRange);

  function addDayToDateRange(day: Date) {
    setDateRange(DateUtils.addDayToRange(day, dateRange));
  }

  const dateRangeString = () => {
    if (dateRange.from && dateRange.to) {
      return `${dateRange.from.toLocaleDateString('en-CA')} - ${dateRange.to.toLocaleDateString(
        'en-CA'
      )}`;
    } else if (dateRange.from && !dateRange.to) {
      return `${dateRange.from.toLocaleDateString('en-CA')} - YYYY-MM-DD`;
    } else {
      return 'YYYY-MM-DD - YYYY-MM-DD';
    }
  };

  return { dateRange, addDayToDateRange, dateRangeString };
}
