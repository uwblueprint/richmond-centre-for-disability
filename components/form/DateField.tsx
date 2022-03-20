import { FC } from 'react';
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
};

const DateField: FC<Props> = props => {
  const { name, label, required, children, ...inputProps } = props;
  const [field, meta] = useField(name);

  return (
    <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired={required}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input type="date" {...field} {...inputProps} />
      <FormErrorMessage>
        <Text as="span" textStyle="body-regular">
          {meta.touched && meta.error ? meta.error : null}
        </Text>
      </FormErrorMessage>
      {children}
    </FormControl>
  );
};

export default DateField;
