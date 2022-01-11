import { Replacement } from '@lib/graphql/types'; // Physician type

/** Reason for replacement form */
export type ReasonForReplacement = Pick<
  Replacement,
  | 'reason'
  | 'lostTimestamp'
  | 'lostLocation'
  | 'description'
  | 'stolenPoliceFileNumber'
  | 'stolenJurisdiction'
  | 'stolenPoliceOfficerName'
>;
