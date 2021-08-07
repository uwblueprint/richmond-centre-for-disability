import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { GridItem, Stack } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/internal/Layout'; // Layout component
import { Applicant, Role } from '@lib/types'; // Role enum and Applicant Type
import { authorize } from '@tools/authorization'; // Page authorization
import PermitHolderHeader from '@components/permit-holders/PermitHolderHeader'; // Permit Holder header
import DoctorInformationCard from '@components/permit-holders/DoctorInformationCard'; // Doctor information card
import PersonalInformationCard from '@components/permit-holders/PersonalInformationCard'; // Personal information card
import { Gender, Province, PhysicianStatus, PaymentType } from '@lib/types'; // Gender, Province, PhysicianStatus, PaymentType Enums
import GuardianInformationCard from '@components/permit-holders/GuardianInformationCard'; // Guardian Information card
import AppHistoryCard from '@components/permit-holders/AppHistoryCard'; // APP History card
import AttachedFilesCard from '@components/permit-holders/AttachedFilesCard'; // Attached Files card
import MedicalHistoryCard from '@components/permit-holders/MedicalHistoryCard'; // Medical History card

// TEMPORARY MOCK DATA

type ApplicationStatus =
  | 'COMPLETED'
  | 'INPROGRESS'
  | 'PENDING'
  | 'REJECTED'
  | 'EXPIRING'
  | 'EXPIRED'
  | 'ACTIVE';
const mockApplication = {
  applicant: {
    id: 1,
    rcdUserId: 1,
    mostRecentAPP: 12345,
    firstName: 'Permit Holder',
    lastName: 'One',
    gender: Gender.Female,
    dateOfBirth: 1,
    email: 'applicantone@email.com',
    phone: '1234567890',
    province: Province.Bc,
    city: 'Richmond',
    addressLine1: '123 Richmond St.',
    postalCode: 'X0X0X0',
  },
  physician: {
    id: 1,
    mspNumber: 123456789,
    firstName: 'Physician',
    lastName: 'One',
    phone: '1234567890',
    addressLine1: '123 Richmond St.',
    postalCode: 'X0X0X0',
    city: 'Richmond',
    province: Province.Bc,
    status: PhysicianStatus.Active,
  },
  guardian: {
    id: 1,
    firstName: 'Guardian',
    lastName: 'One',
    phone: '1234567890',
    addressLine1: '123 Richmond St.',
    postalCode: 'X0X0X0',
    city: 'Richmond',
    province: Province.Bc,
    relationship: 'Parent',
  },
  createdAt: new Date().toDateString(),
  expirationDate: new Date().toDateString(),
  isRenewal: true,
  applicationStatus: 'PENDING' as ApplicationStatus, // Will be updated in the future as we'll be able to reference ApplicationStatus enum in types.ts
  permitFee: 5,
  donation: 10,
  paymentType: PaymentType.Visa,
};

// Individual permit holder page
export default function PermitHolder() {
  const { applicant, physician, guardian, applicationStatus } = mockApplication;

  return (
    <Layout>
      <GridItem rowSpan={1} colSpan={12} marginTop={3}>
        <PermitHolderHeader
          applicant={applicant as unknown as Applicant}
          applicationStatus={applicationStatus}
        />
      </GridItem>
      <GridItem rowSpan={12} colSpan={5} marginTop={5} textAlign="left">
        <Stack spacing={5}>
          <PersonalInformationCard applicant={applicant} />
          <DoctorInformationCard physician={physician} />
          <GuardianInformationCard guardian={guardian} />
        </Stack>
      </GridItem>

      <GridItem rowSpan={12} colSpan={7} marginTop={5} textAlign="left">
        <Stack spacing={5}>
          <AppHistoryCard />
          <AttachedFilesCard />
          <MedicalHistoryCard />
        </Stack>
      </GridItem>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  // Only secretaries and admins can access permit holder information
  if (authorize(session, [Role.Secretary])) {
    return {
      props: {},
    };
  }

  // If user is not secretary or admin, redirect to login
  return {
    redirect: {
      destination: '/admin/login',
      permanent: false,
    },
  };
};
