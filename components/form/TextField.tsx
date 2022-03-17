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

const TextField: FC<Props> = props => {
  const { name, label, required, ...inputProps } = props;
  const [field, meta] = useField(name);

  return (
    <FormControl isInvalid={!!meta.error} isRequired={required}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input {...field} {...inputProps} />
      <FormErrorMessage>
        <Text as="span" textStyle="body-regular">
          {meta.touched && meta.error ? meta.error : null}
        </Text>
      </FormErrorMessage>
    </FormControl>
  );
};

export default TextField;
