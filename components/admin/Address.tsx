import { FC } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Province } from '@lib/graphql/types';
import { formatPostalCode } from '@lib/utils/format';

type Props = {
  readonly address: {
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    province: Province;
    country: string;
    postalCode: string;
  };
};

/** Multi-line address */
const Address: FC<Props> = props => {
  const { address } = props;
  const { addressLine1, addressLine2, city, province, country, postalCode } = address;

  return (
    <Box>
      <Text as="p" textStyle="body-regular" textAlign="left">
        {addressLine2 ? `${addressLine2} - ${addressLine1}` : addressLine1}
      </Text>
      <Text as="p" textStyle="body-regular" textAlign="left">
        {city} {province}
      </Text>
      <Text as="p" textStyle="body-regular" textAlign="left">
        {country}
      </Text>
      <Text as="p" textStyle="body-regular" textAlign="left">
        {formatPostalCode(postalCode)}
      </Text>
    </Box>
  );
};

export default Address;
