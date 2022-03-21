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
  const { name, label, required, ...textAreaProps } = props;
  const [field, meta] = useField(name);

  return (
    <FormControl isInvalid={!!meta.error} isRequired={required}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Textarea {...textAreaProps} {...field} />
      <FormErrorMessage>
        <Text as="span" textStyle="body-regular">
          {meta.touched && meta.error ? meta.error : null}
        </Text>
      </FormErrorMessage>
    </FormControl>
  );
};

export default TextArea;
