import { Step } from '@tools/applicant/renewal-form';
import useSteps from '@tools/hooks/useSteps';
import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next'; // Unstated Next

/** Review step number */
const REVIEW_STEP = 5;

/**
 * Hook for managing the state of the overall applicant renewal request flow
 * @returns State and utils of RenewalFlow container
 */
const useRenewalFlow = () => {
  // Timestamp of agreement to TOS
  const [acceptedTOSTimestamp, setAcceptedTOSTimestamp] = useState<Date | null>(null);

  // ID of applicant after successful identity verification
  const [applicantId, setApplicantId] = useState<number | null>(null);

  // Current renewal flow step
  const [currentStep, setCurrentStep] = useState<Step>(Step.IDENTITY_VERIFICATION);

  // Whether the applicant is reviewing the form
  const [isReviewing, setIsReviewing] = useState(false);

  // Confirmation/certification state
  const [certified, setCertified] = useState(false);

  // (Renewal form) Steps state
  const { nextStep, prevStep, activeStep, goToStep } = useSteps({ initialStep: 0 });

  // When the user arrives on the last step, they are in review mode
  useEffect(() => {
    if (activeStep === REVIEW_STEP) {
      setIsReviewing(true);
    }
  }, [activeStep, isReviewing]);

  // Handler for going to renewal step
  const goToRenewalForm = () => {
    setCurrentStep(Step.RENEWAL_FORM);
  };

  /**
   * Go to the review step of renewal form (last step)
   * Used when user needs to go to previous step to review information
   */
  const goToReview = () => {
    goToStep(REVIEW_STEP);
  };

  return {
    acceptedTOSTimestamp,
    setAcceptedTOSTimestamp,
    applicantId,
    setApplicantId,
    currentStep,
    isReviewing,
    setIsReviewing,
    certified,
    setCertified,
    nextStep,
    prevStep,
    activeStep,
    goToStep,
    goToRenewalForm,
    goToReview,
  };
};

export default createContainer(useRenewalFlow);
