import { useState } from 'react'; // React
import { DateUtils, RangeModifier } from 'react-day-picker'; // React DayPicker

// useDateRangePicker inital parameters
type InitalDateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

// useDateRangePicker return type
type UseDateRangePickerReturnType = {
  dateRange: RangeModifier;
  addDayToDateRange: (day: Date) => void;
  dateRangeString: string;
};

/**
 * Custom hook for managing DateRangePicker state
 * @param {InitalDateRange} initialDateRange - Initial date range object with from and to properties
 * @returns dateRange state, addDayToDateRange function, dateRangeString to display dates (YYYY-MM-DD - YYYY-MM-DD)
 */
export default function useDayPicker(
  initalDateRange?: InitalDateRange
): UseDateRangePickerReturnType {
  const [dateRange, setDateRange] = useState<RangeModifier>(
    initalDateRange || { from: undefined, to: undefined }
  );

  // Add a day to the range of days in dateRange
  // Set dateRange to be a new range that includes that day
  // e.g dateRange => {from: 2021-08-25, to: 2021-08-29}
  //     addDayToRange(2021-08-27)
  //     dateRange => {from: 2021-08-25, to: 2021-08-27}
  function addDayToDateRange(day: Date) {
    setDateRange(DateUtils.addDayToRange(day, dateRange));
  }

  let dateRangeString;
  if (dateRange.from && dateRange.to) {
    dateRangeString = `${dateRange.from.toLocaleDateString(
      'en-CA'
    )} - ${dateRange.to.toLocaleDateString('en-CA')}`;
  } else if (dateRange.from && !dateRange.to) {
    dateRangeString = `${dateRange.from.toLocaleDateString('en-CA')} - YYYY-MM-DD`;
  } else {
    dateRangeString = 'YYYY-MM-DD - YYYY-MM-DD';
  }

  return { dateRange, addDayToDateRange, dateRangeString };
}
