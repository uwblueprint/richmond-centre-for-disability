/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../prisma/index'; // Prisma client
import devApplicantUpsert from './dev-seed-utils/applicants'; // Dev applicants upsert
import devApplicationUpsert from './dev-seed-utils/applications'; // Dev applications upsert
import devPermitUpsert from './dev-seed-utils/permits'; // Dev employees upsert
import devEmployeeUpsert from './dev-seed-utils/employees'; // Dev employees upsert
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

  // Upsert applicants
  await devApplicantUpsert();

  // Upsert applications
  await devApplicationUpsert();

  // Upsert permits
  await devPermitUpsert();
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
