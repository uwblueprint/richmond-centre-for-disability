import { FC, SyntheticEvent } from 'react';
import { useField } from 'formik';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Input,
  InputProps,
} from '@chakra-ui/react';

type Props = InputProps & {
  readonly name: string;
  readonly label: string;
  readonly required?: boolean;
  readonly onChange?: (value: SyntheticEvent) => void;
};

const DateField: FC<Props> = props => {
  const { name, label, required, onChange, children, ...inputProps } = props;
  const [field, meta] = useField(name);

  const handleChange = (event: SyntheticEvent) => {
    if (onChange) {
      onChange(event);
    }

    field.onChange(event);
  };

  return (
    <FormControl isInvalid={!!meta.error} isRequired={required}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input type="date" {...field} onChange={handleChange} {...inputProps} />
      <FormErrorMessage>
        <Text as="span" textStyle="body-regular">
          {meta.error || null}
        </Text>
      </FormErrorMessage>
      {children}
    </FormControl>
  );
};

export default DateField;
