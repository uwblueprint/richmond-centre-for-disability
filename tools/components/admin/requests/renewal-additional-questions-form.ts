import { Renewal } from '@lib/graphql/types'; // Renewal type

export type AdditionalQuestions = Pick<
  Renewal,
  'usesAccessibleConvertedVan' | 'requiresWiderParkingSpace'
>;
