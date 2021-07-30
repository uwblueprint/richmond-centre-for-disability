import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Resolver } from '@lib/resolvers'; // Resolver type

/**
 * Updates the ApplicationProccessing object with the optional values provided
 * @returns Status of operation (ok, error)
 */
export const updateApplicationProcessing: Resolver = async (_, args, { prisma }) => {
  const { input } = args;
  const { id, documentUrl, ...rest } = input;

  let applicationProccessing;
  try {
    applicationProccessing = await prisma.applicationProcessing.update({
      where: { id: parseInt(id) },
      data: {
        ...rest,
        ...(documentUrl && {
          documentUrls: {
            push: documentUrl,
          },
        }),
      },
    });
  } catch (err) {
    throw 'Error updating application processing.';
  }

  // Throw internal server error if application processing object was not updated
  if (!applicationProccessing) {
    throw new ApolloError('Application Processing object was unable to be updated');
  }

  return {
    ok: true,
  };
};
