import { Renewal } from '@lib/graphql/types'; // Renewal type

export type AdditionalQuestionsCardData = Pick<
  Renewal,
  'usesAccessibleConvertedVan' | 'requiresWiderParkingSpace'
>;
