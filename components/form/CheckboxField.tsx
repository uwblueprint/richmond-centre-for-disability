import { FC } from 'react';
import { useField } from 'formik';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Checkbox,
  CheckboxProps,
} from '@chakra-ui/react';

type Props = CheckboxProps & {
  readonly name: string;
  readonly label: string;
  readonly required?: boolean;
};

const CheckboxField: FC<Props> = props => {
  const { name, label, required, ...checkboxProps } = props;
  const [field, meta] = useField(name);

  return (
    <FormControl isInvalid={!!meta.error}>
      <FormLabel htmlFor={name} required={required}>
        {label}
      </FormLabel>
      <Checkbox {...field} {...checkboxProps} />
      <FormErrorMessage>
        <Text as="span" textStyle="body-regular">
          {meta.touched && meta.error ? meta.error : null}
        </Text>
      </FormErrorMessage>
    </FormControl>
  );
};

export default CheckboxField;
