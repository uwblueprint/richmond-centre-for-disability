import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberInput,
  NumberInputProps,
  Text,
  NumberInputField,
} from '@chakra-ui/react';
import { useField } from 'formik';
import { FC } from 'react';

type Props = NumberInputProps & {
  readonly name: string;
  readonly label: string;
  readonly required?: boolean;
};

const NumberInputField: FC<Props> = props => {
  const { name, label, required, ...numberInputProps } = props;
  const [field, meta] = useField(name);

  return (
    <FormControl isInvalid={!!meta.error} isRequired={required}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <NumberInput {...field} {...numberInputProps}>
        <NumberInputField />
      </NumberInput>
      <FormErrorMessage>
        <Text as="span" textStyle="body-regular">
          {meta.touched && meta.error ? meta.error : null}
        </Text>
      </FormErrorMessage>
    </FormControl>
  );
};

export default NumberInputField;
