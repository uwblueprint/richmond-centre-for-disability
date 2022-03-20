import { FieldResolver } from '@lib/graphql/resolvers';
import { Employee, Invoice } from '@lib/graphql/types';

/**
 * Get the employee that generated an invoice
 * @returns employee that generated an invoice
 */
export const invoiceEmployeeResolver: FieldResolver<Invoice, Employee> = async (
  parent,
  _,
  { prisma }
) => {
  return await prisma.applicationInvoice
    .findUnique({ where: { invoiceNumber: parent.invoiceNumber } })
    .employee();
};
