import { Renewal } from '@lib/graphql/types'; // Renewal type

export type AdditionalQuestionsFormData = Pick<
  Renewal,
  'usesAccessibleConvertedVan' | 'requiresWiderParkingSpace'
>;
