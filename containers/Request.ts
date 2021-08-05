import useSessionStorage from '@tools/hooks/useSessionStorage'; // Use session storage hook
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

  return {
    acceptedTOSTimestamp,
    setAcceptedTOSTimestamp,
  };
};

export default createContainer(useRequest);
