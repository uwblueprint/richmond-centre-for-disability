import { Prisma } from '@prisma/client'; // Prisma client
import { Resolver } from '@lib/graphql/resolvers'; // Resolver type
import { Applicant, ApplicationStatus } from '@lib/graphql/types'; // Applicant type
import { SortOrder } from '@tools/types'; // Sorting type
import { getActivePermit } from '@lib/applicants/utils'; // Applicant utils
import { ApolloError } from 'apollo-server-micro'; // Apollo errors

/**
 * Field resolver to fetch all applications belonging to an applicant
 * @returns Array of application objects
 */
export const applicantApplicationsResolver: Resolver<Applicant> = async (
  parent,
  _args,
  { prisma }
) => {
  return await prisma.application.findMany({ where: { applicantId: parent?.id } });
};

/**
 * Field resolver to fetch all permits belonging to an applicant
 * @returns Array of permit objects
 */
export const applicantPermitsResolver: Resolver<Applicant> = async (parent, _args, { prisma }) => {
  return await prisma.applicant
    .findUnique({
      where: { id: parent.id },
    })
    .permits();
};

/**
 * Field resolver to fetch the guardian associated with an applicant
 * @returns Guardian object
 */
export const applicantGuardianResolver: Resolver<Applicant> = async (parent, _args, { prisma }) => {
  if (parent.guardianId === null) {
    return null;
  }

  return await prisma.guardian.findUnique({ where: { id: parent.guardianId } });
};

/**
 * Field resolver to fetch the medical information object associated with an applicant
 * @returns MedicalInformation object
 */
export const applicantMedicalInformationResolver: Resolver<Applicant> = async (
  parent,
  _args,
  { prisma }
) => {
  return await prisma.medicalInformation.findUnique({
    where: { id: parent?.medicalInformationId },
  });
};

/**
 * Field resolver to fetch the medical history object associated with an applicant, including the physician and application ID for every completed application. The physician data is current (not from the time of the application).
 * @returns Array of medical history records
 */
export const applicantMedicalHistoryResolver: Resolver<Applicant> = async (
  parent,
  _args,
  { prisma }
) => {
  const applications = await prisma.application.findMany({
    where: {
      applicantId: parent?.id,
      applicationProcessing: {
        status: ApplicationStatus.Completed,
      },
    },
    select: {
      physicianMspNumber: true,
      id: true,
    },
  });

  const physicians = await prisma.$transaction(
    applications.map(application => {
      return prisma.physician.findUnique({
        where: {
          mspNumber: application.physicianMspNumber,
        },
      });
    })
  );

  const result = applications.map((application, i) => {
    return {
      applicationId: application.id,
      physician: physicians[i],
    };
  });

  return result;
};

/**
 * Field resolver to fetch the most recent permit of an applicant
 * @returns Permit object
 */
export const applicantMostRecentPermitResolver: Resolver<Applicant> = async (
  parent,
  _args,
  { prisma }
) => {
  const permit = await prisma.applicant
    .findUnique({
      where: { id: parent.id },
    })
    .permits({
      orderBy: { createdAt: SortOrder.DESC },
      take: 1,
    });

  return permit[0];
};

/**
 * Field resolver to fetch the active permit object associated with an applicant
 * @returns Permit object if active permit exists, `null` otherwise
 */
export const applicantActivePermitResolver: Resolver<Applicant> = async parent => {
  try {
    return await getActivePermit(parent.id);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new ApolloError(err.message);
    }

    throw new ApolloError('Error querying active permit');
  }
};

/**
 * Field resolver to fetch the applicationProcessing objects associated with an applicant
 * @returns applicationProcessing objects that contain document URLs, the associated application number, and the date uploaded
 */
export const applicantFileHistoryResolver: Resolver<Applicant> = async (
  parent,
  _args,
  { prisma }
) => {
  const applicationProcessings = await prisma.application.findMany({
    where: {
      applicantId: parent?.id,
    },
    include: {
      applicationProcessing: {
        select: {
          documentUrls: true,
          appNumber: true,
          createdAt: true,
        },
      },
    },
  });

  return applicationProcessings;
};

/**
 * Field resolver to fetch the most recent renewal request of an applicant.
 * If the applicant has no previous renewals, return the most recent application.
 * @returns Application object
 */
export const applicantMostRecentRenewalApplicationResolver: Resolver<Applicant> = async (
  parent,
  _args,
  { prisma }
) => {
  const renewal = await prisma.applicant
    .findUnique({
      where: { id: parent.id },
    })
    .applications({
      orderBy: [
        {
          isRenewal: SortOrder.DESC,
        },
        {
          createdAt: SortOrder.DESC,
        },
      ],
      take: 1,
      include: {
        renewal: true,
      },
    });

  return renewal.length > 0 ? renewal[0] : null;
};

/**
 * Field resolver to fetch the most recent application request of an applicant.
 * If the applicant has no previous applications, return null.
 * @returns Application object
 */
export const applicantMostRecentApplicationResolver: Resolver<Applicant> = async (
  parent,
  _args,
  { prisma }
) => {
  const application = await prisma.applicant
    .findUnique({
      where: { id: parent.id },
    })
    .applications({
      orderBy: [
        {
          createdAt: SortOrder.DESC,
        },
      ],
      take: 1,
    });
  return application.length > 0 ? application[0] : null;
};
