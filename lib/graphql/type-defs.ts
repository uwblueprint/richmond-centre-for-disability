import applicantsSchema from '@lib/applicants/schema'; // Applicants schema
import applicationProcessingSchema from '@lib/application-processing/schema'; // Application processing schema
import applicationsSchema from '@lib/applications/schema'; // Applications schema
import employeesSchema from '@lib/employees/schema'; // Employees schema
import mainSchema from '@lib/graphql/schema'; // Main schema
import guardiansSchema from '@lib/guardian/schema'; // Guardians schema
import medicalInformationSchema from '@lib/medical-information/schema'; // Medical information schema
import permitsSchema from '@lib/permits/schema'; // Permits schema
import physiciansSchema from '@lib/physicians/schema'; // Physicians schema
import reportsSchema from '@lib/reports/schema';

// Merge schemas
const typeDefs = [
  applicantsSchema,
  applicationProcessingSchema,
  applicationsSchema,
  employeesSchema,
  mainSchema,
  guardiansSchema,
  medicalInformationSchema,
  permitsSchema,
  physiciansSchema,
  reportsSchema,
];

export default typeDefs;
