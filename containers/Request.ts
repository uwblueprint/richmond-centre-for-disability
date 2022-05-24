import { useState } from 'react';
import { createContainer } from 'unstated-next'; // Unstated Next

/**
 * Hook for managing the state of the applicant request flow
 * @returns State and utils of Request container
 */
const useRequest = () => {
  // Timestamp of agreement to TOS
  const [acceptedTOSTimestamp, setAcceptedTOSTimestamp] = useState<Date | null>(null);

  // ID of applicant after successful identity verification
  const [applicantId, setApplicantId] = useState<number | null>(null);

  return {
    acceptedTOSTimestamp,
    setAcceptedTOSTimestamp,
    applicantId,
    setApplicantId,
  };
};

export default createContainer(useRequest);
