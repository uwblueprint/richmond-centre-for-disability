import { Alert, AlertDescription, AlertIcon, HStack } from '@chakra-ui/react';
import { PhysicianMatchStatus } from '@lib/graphql/types';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  readonly applicantId?: number;
  readonly matchStatus: PhysicianMatchStatus | 'OUTDATED';
};

const PhysicianDiffAlert: FC<Props> = props => {
  const { applicantId, matchStatus } = props;

  if (matchStatus === 'DOES_NOT_EXIST') {
    return (
      <Alert status="warning">
        <HStack align="flex-start">
          <AlertIcon />
          <AlertDescription>
            No doctor with this MSP number currently exists in your database. Once you accept and
            mark the request as complete, this doctor will be added to the database.
          </AlertDescription>
        </HStack>
      </Alert>
    );
  } else if (matchStatus === 'DOES_NOT_MATCH_EXISTING') {
    return (
      <Alert status="warning">
        <HStack align="flex-start">
          <AlertIcon />
          <AlertDescription>
            A doctor with this MSP number currently exists in the database but the information from
            this request does not match. Please ensure you have the most up-to-date information
            before completing the request and overriding the existing record.
          </AlertDescription>
        </HStack>
      </Alert>
    );
  } else if (matchStatus === 'OUTDATED') {
    return (
      <Alert status="warning">
        <HStack align="flex-start">
          <AlertIcon />
          <AlertDescription>
            This info may be outdated, find the most up to date doctor’s information associated with
            this permit holder <Link href={`/permit-holder/${applicantId}`}>here</Link>.
          </AlertDescription>
        </HStack>
      </Alert>
    );
  }

  return null;
};

export default PhysicianDiffAlert;
