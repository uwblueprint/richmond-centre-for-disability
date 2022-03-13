import { FC } from 'react';
import { useField } from 'formik';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Select,
  SelectProps,
} from '@chakra-ui/react';

type Props = SelectProps & {
  readonly name: string;
  readonly label: string;
  readonly required?: boolean;
};

const SelectField: FC<Props> = props => {
  const { name, label, required, ...inputProps } = props;
  const [field, meta] = useField(name);

  return (
    <FormControl isInvalid={!!meta.error}>
      <FormLabel htmlFor={name} required={required}>
        {label}
      </FormLabel>
      <Select {...field} {...inputProps} />
      <FormErrorMessage>
        <Text as="span" textStyle="body-regular">
          {meta.touched && meta.error ? meta.error : null}
        </Text>
      </FormErrorMessage>
    </FormControl>
  );
};

export default SelectField;
