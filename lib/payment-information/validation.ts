import { object, string } from 'yup';

/**
 * Payment information validation schema
 */
export const paymentInformationSchema = object({
  paymentMethod: string().required('Please select a payment method'),
  //   donation: number()
  //   .positive(`Please enter a valid phone number`).test(
  //   "maxDigitsAfterDecimal",
  //       "number field must have 2 digits after decimal or less",
  //       (number) => /^\d+(\.\d{1,2})?$/.test(number)
  //     .required('Please enter a valid amount'),
});
