import { useState } from 'react'; // React
import { DateUtils, RangeModifier } from 'react-day-picker'; // React Date Picker

type useDayPickerReturnType = {
  range: RangeModifier;
  addDayToRange: (day: Date) => void;
  dateRangeString: () => string;
};

export default function useDayPicker(initialDateRange: RangeModifier): useDayPickerReturnType {
  const [range, setRange] = useState<RangeModifier>(initialDateRange);

  function addDayToRange(day: Date) {
    setRange(DateUtils.addDayToRange(day, range));
  }

  const dateRangeString = () => {
    if (range.from && range.to) {
      return `${range.from.toLocaleDateString('en-CA')} - ${range.to.toLocaleDateString('en-CA')}`;
    } else if (range.from && !range.to) {
      return `${range.from.toLocaleDateString('en-CA')} - YYYY-MM-DD`;
    } else {
      return 'YYYY-MM-DD - YYYY-MM-DD';
    }
  };

  return { range, addDayToRange, dateRangeString };
}
