import { FC, ReactNode } from 'react';
import { useField, useFormikContext } from 'formik';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  CheckboxGroup,
  CheckboxGroupProps,
} from '@chakra-ui/react';

type Props = CheckboxGroupProps & {
  children: ReactNode;
  readonly name: string;
  readonly label: string;
  readonly required?: boolean;
};

const CheckboxGroupField: FC<Props> = props => {
  const { name, label, required, ...checkboxGroupProps } = props;
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const handleChange = (value: string[]) => {
    setFieldValue(name, value);
  };

  return (
    <FormControl isInvalid={!!meta.error}>
      <FormLabel htmlFor={name} required={required}>
        {label}
      </FormLabel>
      <CheckboxGroup {...field} onChange={handleChange} {...checkboxGroupProps}></CheckboxGroup>
      <FormErrorMessage>
        <Text as="span" textStyle="body-regular">
          {meta.touched && meta.error ? meta.error : null}
        </Text>
      </FormErrorMessage>
    </FormControl>
  );
};

export default CheckboxGroupField;
