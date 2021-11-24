/**
 * Check whether any of the values for certain keys in an object are null
 * @param obj The object to check
 * @param fields An optional array of fields to check. If not provided, checks all keys
 * @returns Whether the values of any of the provided fields in the object are null
 */
export const isAnyValueNull = <T extends Record<string, any>>(
  obj: T,
  fields?: Array<keyof T>
): boolean => {
  if (fields === undefined) {
    return Object.values(obj).some(value => value === null);
  } else {
    return fields.some(field => obj[field] === null);
  }
};

/**
 * Check whether all of the values for certain keys in an object are null
 * @param obj The object to check
 * @param fields An optional array of fields to check. If not provided, checks all keys
 * @returns Whether the values of all of the provided fields in the object are null
 */
export const areAllValuesNull = (obj: Record<string, any>, fields?: string[]): boolean => {
  if (fields === undefined) {
    return Object.values(obj).every(value => value === null);
  } else {
    return fields.every(field => obj[field] === null);
  }
};
