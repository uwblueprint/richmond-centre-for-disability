import { FC } from 'react';
import { Text } from '@chakra-ui/react';

type Props = {
  readonly name: string;
  readonly value?: string;
};

/**
 * Selected option text for filter menus of permit holders table
 */
const FilterMenuSelectedText: FC<Props> = ({ name, value }: Props) => {
  return (
    <>
      <Text as="span" textStyle="button-semibold">
        {`${name}: `}
      </Text>
      <Text as="span" textStyle="button-regular" textTransform="capitalize">
        {value || 'All'}
      </Text>
    </>
  );
};

export default FilterMenuSelectedText;
