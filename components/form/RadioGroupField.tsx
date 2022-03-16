import { FC, ReactNode } from 'react';
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
  children: ReactNode;
};

const RadioGroupField: FC<Props> = props => {
  const { name, label, required, children, ...radioGroupProps } = props;
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const handleChange = (value: string) => {
    setFieldValue(name, value);
  };

  return (
    <FormControl isInvalid={!!meta.error}>
      <FormLabel htmlFor={name} required={required}>
        {label}
      </FormLabel>
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

// {
/* <Field name={name}>
  {({ field, form }: FieldProps) => {
    const { onChange, ...rest } = field;
    return (
      <FormControl
        id={name}
        isInvalid={!!form.errors[name] && !!form.touched[name]}
      >
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <RadioGroup {...rest} id={name} {...props}>
          {values.map((value) => (
            <Radio onChange={onChange} value={value}>{value}</Radio>
          ))}
        </RadioGroup>
        <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
      </FormControl>
    );
  }}
</Field>; */
// }
