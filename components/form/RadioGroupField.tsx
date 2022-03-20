import { FC } from 'react';
import { useField, useFormikContext } from 'formik';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  RadioGroup,
  RadioGroupProps,
} from '@chakra-ui/react';

type Props = RadioGroupProps & {
  readonly name: string;
  readonly label: string;
  readonly required?: boolean;
};

const RadioGroupField: FC<Props> = props => {
  const { name, label, required, children, ...radioGroupProps } = props;
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const handleChange = (value: string) => {
    setFieldValue(name, value);
  };

  return (
    <FormControl isInvalid={!!meta.error && !!meta.touched} isRequired={required}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <RadioGroup id={name} {...field} onChange={handleChange} {...radioGroupProps}>
        {children}
      </RadioGroup>
      <FormErrorMessage>
        <Text as="span" textStyle="body-regular">
          {meta.touched && meta.error ? meta.error : null}
        </Text>
      </FormErrorMessage>
    </FormControl>
  );
};

export default RadioGroupField;
