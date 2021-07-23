import { useState } from 'react'; // React state

// useSteps initial parameters
type UseSteps = {
  readonly initialStep?: number;
};

// useSteps return type
type UseStepsReturnType = {
  readonly activeStep: number;
  readonly reset: () => void;
  readonly nextStep: () => void;
  readonly prevStep: () => void;
  readonly goToStep: (step: number) => void;
};

/**
 * Custom hook for managing Steps state
 * @param initialStep - Initial step (default 0)
 * @returns active step, reset function (to step 0), next step function, previous step function, function for going to specific step
 */
export default function useSteps({ initialStep = 0 }: UseSteps): UseStepsReturnType {
  const [activeStep, setActiveStep] = useState(initialStep);

  /**
   * Reset active step to step 0
   */
  const reset = (): void => {
    setActiveStep(0);
  };

  /**
   * Go to next step
   */
  const nextStep = (): void => {
    setActiveStep(activeStep + 1);
  };

  /**
   * Go to previous step
   */
  const prevStep = (): void => {
    setActiveStep(activeStep - 1);
  };

  /**
   * Go to a step number
   * @param step - The step number to go to
   */
  const goToStep = (step: number): void => {
    setActiveStep(step);
  };

  return { activeStep, reset, nextStep, prevStep, goToStep };
}
