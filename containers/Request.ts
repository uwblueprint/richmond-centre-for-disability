import useSessionStorage from '@tools/hooks/useSessionStorage'; // useSessionStorage hook
import { createContainer } from 'unstated-next'; // Unstated Next

/**
 * Hook for managing the state of the applicant request flow
 * @returns State and utils of Request container
 */
const useRequest = () => {
  // Timestamp of agreement to TOS
  const [acceptedTOSTimestamp, setAcceptedTOSTimestamp] = useSessionStorage<Date | null>(
    'acceptedTOSTimestamp',
    null
  );

  // ID of applicant after successful identity verification
  const [applicantId, setApplicantId] = useSessionStorage<number | null>('applicantId', null);

  return {
    acceptedTOSTimestamp,
    setAcceptedTOSTimestamp,
    applicantId,
    setApplicantId,
  };
};

export default createContainer(useRequest);
