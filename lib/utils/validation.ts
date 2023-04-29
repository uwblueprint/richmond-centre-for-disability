/**
 * Regex to match Canadian postal codes in the form 'X0X 0X0' and 'X0X0X0'
 */
export const postalCodeRegex = /(^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$)/;

/**
 * Regex to match phone numbers in the form '123-456-7890' and '1234567890'
 */
export const phoneNumberRegex = /(^(\d{3}-?\d{3}-?\d{4}$))/;
