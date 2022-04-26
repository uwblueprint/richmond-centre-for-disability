import { HStack, VStack, Text, Button } from '@chakra-ui/react';
import PermitTypeBadge from '@components/admin/PermitTypeBadge';
import RequestStatusBadge from '@components/admin/RequestStatusBadge';
import { formatDate } from '@lib/utils/format';
import { GetCurrentApplicationResponse } from '@tools/admin/permit-holders/current-application';
import { titlecase } from '@tools/string';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  readonly application: GetCurrentApplicationResponse['application'];
};

const Header: FC<Props> = ({ application }) => {
  const {
    id,
    type,
    permitType,
    processing: { status },
    temporaryPermitExpiry,
  } = application;

  return (
    <HStack width="100%" justify="space-between" align="flex-start">
      <VStack align="flex-start">
        <HStack spacing="12px">
          <Text as="h2" textStyle="display-large">
            Permit Request
          </Text>
          <RequestStatusBadge variant={status} />
          <PermitTypeBadge variant={permitType} />
        </HStack>
        <HStack spacing="24px">
          <Text as="p" textStyle="body-regular">
            Request Type: {titlecase(type)}
          </Text>
          {!!temporaryPermitExpiry && (
            <Text as="p" textStyle="body-regular">
              Expiry Date: {formatDate(temporaryPermitExpiry)}
            </Text>
          )}
        </HStack>
      </VStack>
      <Link href={`/admin/request/${id}`}>
        <Button height="48px" variant="outline">
          Go to request page
        </Button>
      </Link>
    </HStack>
  );
};

export default Header;
