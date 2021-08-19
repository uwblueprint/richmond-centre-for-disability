import {
  Application,
  UpdateApplicationProcessingResult,
  UpdateApplicationResult,
  Scalars,
  CompleteApplicationResult,
} from '@lib/graphql/types';

// Get application response type
export type GetApplicationResponse = {
  application: Application;
};

// Update application response type
export type UpdateApplicationResponse = {
  updateApplication: UpdateApplicationResult;
};

// Update application processing response type
export type UpdateApplicationProcessingResponse = {
  updateApplicationProcessing: UpdateApplicationProcessingResult;
};

// Update application processing response type
export type CompleteApplicationResponse = {
  completeApplication: CompleteApplicationResult;
};

export type ApproveApplicationArgs = {
  id: Scalars['ID'];
};

export type RejectApplicationArgs = {
  id: Scalars['ID'];
};

export type CompleteApplicationArgs = {
  id: Scalars['ID'];
};
