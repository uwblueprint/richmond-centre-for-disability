/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../prisma/index'; // Prisma client
// import devApplicantUpsert from './dev-seed-utils/applicants'; // Dev applicants upsert
// import devApplicationProcessingUpsert from './dev-seed-utils/application-processings'; // Dev application processing upsert
// import devApplicationUpsert from './dev-seed-utils/applications'; // Dev applications upsert
import devEmployeeUpsert from './dev-seed-utils/employees'; // Dev employees upsert
// import devGuardianUpsert from './dev-seed-utils/guardians'; // Dev guardians upsert
// import devMedicalInformationUpsert from './dev-seed-utils/medical-information'; // Dev medical information upsert
// import devPermitUpsert from './dev-seed-utils/permits'; // Dev permits upsert
// import devPhysicianUpsert from './dev-seed-utils/physicians'; // Dev physicians upsert
// import devReplacementUpsert from './dev-seed-utils/replacements'; // Dev replacements upsert
// import devRenewalUpsert from './dev-seed-utils/renewals'; // Dev replacements upsert
import prodEmployeeUpsert from './prod-seed-utils/employees'; // Prod employees upsert

/**
 * Main program
 */
const main = async () => {
  if (process.env.NODE_ENV === 'production') {
    await prodSeed();
  } else {
    await devSeed();
  }
};

/**
 * Production seeding
 */
const prodSeed = async () => {
  await prodEmployeeUpsert();
};

/**
 * Development seeding
 */
const devSeed = async () => {
  // Upsert employees
  await devEmployeeUpsert();

  // // Upsert guardians
  // await devGuardianUpsert();

  // // Upsert physician records
  // await devPhysicianUpsert();

  // // Upsert medical information records
  // await devMedicalInformationUpsert();

  // // Upsert applicants
  // await devApplicantUpsert();

  // // Upsert application processings
  // await devApplicationProcessingUpsert();

  // // Upsert applications
  // await devApplicationUpsert();

  // // Upsert replacements
  // await devReplacementUpsert();

  // // Upsert renewals
  // await devRenewalUpsert();

  // // Upsert permits
  // await devPermitUpsert();
};

// Execute seeding
main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
