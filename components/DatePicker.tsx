import { ChakraProps, Input } from '@chakra-ui/react'; // Chakra UI
import ReactDayPickerInput from 'react-day-picker/DayPickerInput'; // React Day Picker Input
import 'react-day-picker/lib/style.css'; // React Day Picker default styling

// Date Picker props
type Props = {
  readonly value: Date; // Date value
  readonly onDateChange: (day: Date) => void; // Callback on date change
} & Partial<Pick<ChakraProps, 'width'>>;

/**
 * Custom date picker component wrapping React Day Picker
 * @param date The currently selected date
 * @param onDateChange Callback on date change
 * @returns
 */
export default function DatePicker(props: Props) {
  const { width, value, onDateChange } = props;

  return (
    <>
      <ReactDayPickerInput
        style={width !== undefined ? { width } : undefined}
        component={(props: any) => <Input width={width} {...props} />}
        formatDate={date => date.toLocaleDateString('en-CA')}
        value={value}
        onDayChange={onDateChange}
      />
    </>
  );
}
