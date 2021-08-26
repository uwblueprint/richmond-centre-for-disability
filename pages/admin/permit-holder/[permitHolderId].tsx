import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { GridItem, Stack } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/internal/Layout'; // Layout component
import { Applicant, Role } from '@lib/types'; // Role enum and Applicant Type
import { authorize } from '@tools/authorization'; // Page authorization
import PermitHolderHeader from '@components/permit-holders/PermitHolderHeader'; // Permit Holder header
// TODO: Reimplement DoctorInformationCard
import DoctorInformationCard from '@components/permit-holders/DoctorInformationCard'; // Doctor information card
import PersonalInformationCard from '@components/permit-holders/PersonalInformationCard'; // Personal information card
import { Gender, Province, PhysicianStatus, PaymentType, ApplicationStatus } from '@lib/types'; // Gender, Province, PhysicianStatus, PaymentType Enums
// TODO: Reimplement GuardianInformationCard
import GuardianInformationCard from '@components/permit-holders/GuardianInformationCard'; // Guardian Information card
import AppHistoryCard from '@components/permit-holders/AppHistoryCard'; // APP History card
import AttachedFilesCard from '@components/permit-holders/AttachedFilesCard'; // Attached Files card
import MedicalHistoryCard from '@components/permit-holders/MedicalHistoryCard'; // Medical History card

// TEMPORARY MOCK DATA
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
    name: 'Physician One',
    phone: '1234567890',
    addressLine1: '123 Richmond St.',
    addressLine2: '',
    postalCode: 'X0X0X0',
    city: 'Richmond',
    province: Province.Bc,
    status: PhysicianStatus.Active,
    notes: '',
  },
  guardian: {
    id: 1,
    firstName: 'Guardian',
    middleName: '',
    lastName: 'One',
    phone: '1234567890',
    addressLine1: '123 Richmond St.',
    addressLine2: '',
    postalCode: 'X0X0X0',
    city: 'Richmond',
    province: Province.Bc,
    relationship: 'Parent',
    notes: '',
  },
  createdAt: new Date().toDateString(),
  expirationDate: new Date().toDateString(),
  isRenewal: true,
  applicationStatus: ApplicationStatus.Pending, // Will be updated in the future as we'll be able to reference ApplicationStatus enum in types.ts
  permitFee: 5,
  donation: 10,
  paymentType: PaymentType.Visa,
};

type Props = {
  readonly permitHolderId: number;
};

// Individual permit holder page
export default function PermitHolder({ permitHolderId }: Props) {
  // TODO: Destructure physician, guardian from application
  const { applicant, /*physician, guardian,*/ applicationStatus } = mockApplication;

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
          <PersonalInformationCard applicant={applicant as unknown as Applicant} />
          Temporarily commented to pass CI checks for View Request page
          <DoctorInformationCard
            physician={mockApplication.physician}
            permitHolderId={permitHolderId}
          />
          <GuardianInformationCard guardian={mockApplication.guardian} />
        </Stack>
      </GridItem>

      <GridItem rowSpan={12} colSpan={7} marginTop={5} textAlign="left">
        <Stack spacing={5}>
          <AppHistoryCard />
          <AttachedFilesCard permitHolderId={permitHolderId} />
          <MedicalHistoryCard permitHolderId={permitHolderId} />
        </Stack>
      </GridItem>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  // Only secretaries and admins can access permit holder information
  if (authorize(session, [Role.Secretary])) {
    const permitHolderId = context?.params?.permitHolderId;

    return {
      props: { permitHolderId },
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
