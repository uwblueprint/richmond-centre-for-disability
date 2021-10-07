import { Replacement } from '@lib/graphql/types'; // Physician type

export type ReplacementData = Pick<
  Replacement,
  'reason' | 'lostTimestamp' | 'lostLocation' | 'description'
>;
