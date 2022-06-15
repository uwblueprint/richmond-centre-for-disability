import { Step } from '@tools/applicant/renewal-form';
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

  // Current renewal flow step
  const [currentStep, setCurrentStep] = useState<Step>(Step.IDENTITY_VERIFICATION);

  // Handler for going to renewal step
  const goToRenewalForm = () => {
    setCurrentStep(Step.RENEWAL_FORM);
  };

  return {
    acceptedTOSTimestamp,
    setAcceptedTOSTimestamp,
    applicantId,
    setApplicantId,
    currentStep,
    goToRenewalForm,
  };
};

export default createContainer(useRequest);
