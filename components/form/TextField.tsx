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
  readonly backendError?: string;
  readonly setBackendError?: (updatedBackendError: string) => void;
};

const TextField: FC<Props> = props => {
  const { name, label, required, backendError, setBackendError, ...inputProps } = props;
  const [field, meta] = useField(name);

  const handleChange = (e: React.ChangeEvent<any>) => {
    if (setBackendError) {
      setBackendError('');
    }

    field.onChange(e);
  };

  return (
    <FormControl isInvalid={!!meta.error || !!backendError}>
      <FormLabel htmlFor={name} required={required}>
        {label}
      </FormLabel>
      <Input {...field} onChange={handleChange} {...inputProps} />
      <FormErrorMessage>
        <Text as="span" textStyle="body-regular">
          {meta.touched && meta.error ? meta.error : backendError || null}
        </Text>
      </FormErrorMessage>
    </FormControl>
  );
};

export default TextField;
