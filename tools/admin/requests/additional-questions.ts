import { Renewal } from '@lib/graphql/types';

/** Additional questions in forms */
export type AdditionalQuestions = Pick<
  Renewal,
  'usesAccessibleConvertedVan' | 'requiresWiderParkingSpace'
>;
