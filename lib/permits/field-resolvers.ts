import { flattenApplication } from '@lib/applications/utils';
import { FieldResolver } from '@lib/graphql/resolvers';
import { Application, Permit } from '@lib/graphql/types';

/**
 * Get the application that was completed to obtain the parent permit
 * @returns Application associated with parent permit
 */
export const permitApplicationResolver: FieldResolver<
  Permit,
  Omit<Application, 'processing' | 'applicant'>
> = async (parent, _args, { prisma }) => {
  const application = await prisma.permit
    .findUnique({ where: { rcdPermitId: parent.rcdPermitId } })
    .application({
      include: { newApplication: true, renewalApplication: true, replacementApplication: true },
    });

  if (!application) {
    return null;
  }

  return flattenApplication(application);
};
