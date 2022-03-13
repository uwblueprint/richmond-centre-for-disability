import { FC } from 'react';
import { useField } from 'formik';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Textarea,
  TextareaProps,
} from '@chakra-ui/react';

type Props = TextareaProps & {
  readonly name: string;
  readonly label: string;
  readonly required?: boolean;
};

const TextArea: FC<Props> = props => {
  const { name, label, required, ...inputProps } = props;
  const [field, meta] = useField(name);

  return (
    <FormControl isInvalid={!!meta.error}>
      <FormLabel htmlFor={name} required={required}>
        {label}
      </FormLabel>
      <Textarea {...inputProps} {...field} />
      <FormErrorMessage>
        <Text as="span" textStyle="body-regular">
          {meta.touched && meta.error ? meta.error : null}
        </Text>
      </FormErrorMessage>
    </FormControl>
  );
};

export default TextArea;
