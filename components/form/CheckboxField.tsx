import { FC } from 'react';
import { useField } from 'formik';
import { FormControl, FormErrorMessage, Text, CheckboxProps, Checkbox } from '@chakra-ui/react';

type Props = CheckboxProps & {
  readonly name: string;
  readonly required?: boolean;
};

const CheckboxField: FC<Props> = props => {
  const { name, required, children, ...checkboxProps } = props;
  const [field, meta] = useField(name);
  const isChecked = field.value;

  return (
    <FormControl isInvalid={!!meta.error} isRequired={required}>
      <Checkbox {...field} isChecked={isChecked} {...checkboxProps}>
        {children}
      </Checkbox>
      <FormErrorMessage>
        <Text as="span" textStyle="body-regular">
          {meta.error || null}
        </Text>
      </FormErrorMessage>
    </FormControl>
  );
};

export default CheckboxField;
