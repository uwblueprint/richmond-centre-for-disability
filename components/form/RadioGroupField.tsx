import { FC } from 'react';
import { useField } from 'formik';
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
  const { children, name, label, required, ...radioGroupProps } = props;
  const [field, meta] = useField(name);

  return (
    <FormControl isInvalid={!!meta.error}>
      <FormLabel htmlFor={name} required={required}>
        {label}
      </FormLabel>
      <RadioGroup {...field} {...radioGroupProps}>
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
