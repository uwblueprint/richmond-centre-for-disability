import { FC } from 'react';
import { useField } from 'formik';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Input,
  InputProps,
  Box,
} from '@chakra-ui/react';

type Props = InputProps & {
  readonly name: string;
  readonly label: string;
  readonly labelHelperText?: string;
  readonly required?: boolean;
};

const TextField: FC<Props> = props => {
  const { name, label, labelHelperText, required, children, ...inputProps } = props;
  const [field, meta] = useField(name);

  return (
    <FormControl isInvalid={!!meta.error && meta.touched} isRequired={required}>
      <FormLabel htmlFor={name}>
        {label}
        {labelHelperText && (
          <Box as="span" textStyle="body-regular" fontSize="sm">
            {` ${labelHelperText}`}
          </Box>
        )}
      </FormLabel>
      <Input {...field} {...inputProps} />
      <FormErrorMessage>
        <Text as="span" textStyle="body-regular">
          {meta.touched && meta.error ? meta.error : null}
        </Text>
      </FormErrorMessage>
      {children}
    </FormControl>
  );
};

export default TextField;
