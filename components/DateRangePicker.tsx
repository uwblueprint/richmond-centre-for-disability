import ReactDayPicker, { RangeModifier } from 'react-day-picker'; // React Day Picker
import 'react-day-picker/lib/style.css'; // Date picker base styling
import Helmet from 'react-helmet'; // Inline styling for select date range functionality

type DateRangePicker = {
  readonly dateRange: RangeModifier; // Object with 'from' and 'to' properties indicating the selected date range
  readonly onDateChange: (day: Date) => void; // Callback on date change
};

/**
 * Custom date picker component extending {@link http://react-day-picker.js.org/| react-day-picker}
 * that allows selecting a range of dates
 * @param {DateRangePicker} props - Props
 */
export default function DateRangePicker(props: DateRangePicker) {
  return (
    <>
      <ReactDayPicker
        className="Selectable"
        numberOfMonths={2}
        onDayClick={props.onDateChange}
        selectedDays={[props.dateRange.from || undefined, props.dateRange]}
        modifiers={{
          start: props.dateRange.from || undefined,
          end: props.dateRange.to || undefined,
        }}
      />
      <Helmet>
        <style>{`
          .Selectable .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
            background-color: #f0f8ff !important;
            color: #4a90e2;
          }
          .Selectable .DayPicker-Day {
            border-radius: 0 !important;
          }
          .Selectable .DayPicker-Day--start {
            border-top-left-radius: 50% !important;
            border-bottom-left-radius: 50% !important;
          }
          .Selectable .DayPicker-Day--end {
            border-top-right-radius: 50% !important;
            border-bottom-right-radius: 50% !important;
          }
        `}</style>
      </Helmet>
    </>
  );
}
