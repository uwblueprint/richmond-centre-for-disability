import { FC } from 'react';
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
  readonly name: string;
  readonly label: string;
  readonly required?: boolean;
};

const CheckboxGroupField: FC<Props> = props => {
  const { name, label, required, children, ...checkboxGroupProps } = props;
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const handleChange = (value: string[]) => {
    setFieldValue(name, value);
  };

  return (
    <FormControl isInvalid={!!meta.error && meta.touched} isRequired={required}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <CheckboxGroup {...field} onChange={handleChange} {...checkboxGroupProps}>
        {children}
      </CheckboxGroup>
      <FormErrorMessage>
        <Text as="span" textStyle="body-regular">
          {meta.touched && meta.error ? meta.error : null}
        </Text>
      </FormErrorMessage>
    </FormControl>
  );
};

export default CheckboxGroupField;
