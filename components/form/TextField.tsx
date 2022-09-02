import { FC, ReactNode } from 'react';
import { useField } from 'formik';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Input,
  InputProps,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';

type Props = InputProps & {
  readonly name: string;
  readonly label: string | ReactNode;
  readonly required?: boolean;
  readonly monetaryInput?: boolean;
};

const TextField: FC<Props> = props => {
  const { name, label, required, children, monetaryInput, ...inputProps } = props;
  const [field, meta] = useField(name);

  return (
    <FormControl isInvalid={!!meta.error} isRequired={required}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {monetaryInput ? (
        <InputGroup>
          <InputLeftElement pointerEvents="none" color="texticon.filler" fontSize="1.2em">
            {'$'}
          </InputLeftElement>
          <Input {...field} {...inputProps} />
        </InputGroup>
      ) : (
        <Input {...field} {...inputProps} />
      )}
      <FormErrorMessage>
        <Text as="span" textStyle="body-regular">
          {meta.error || null}
        </Text>
      </FormErrorMessage>
      {children}
    </FormControl>
  );
};

export default TextField;
