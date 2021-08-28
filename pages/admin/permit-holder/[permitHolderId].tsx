import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { GridItem, Stack } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/internal/Layout'; // Layout component
import { ApplicantStatus, ApplicationStatus, Role } from '@lib/types'; // Role enum and Applicant Type
import { authorize } from '@tools/authorization'; // Page authorization
import PermitHolderHeader from '@components/permit-holders/PermitHolderHeader'; // Permit Holder header
import DoctorInformationCard from '@components/permit-holders/DoctorInformationCard'; // Doctor information card
import PersonalInformationCard from '@components/permit-holders/PersonalInformationCard'; // Personal information card
import { Gender, Province } from '@lib/types'; // Gender, Province, PhysicianStatus, PaymentType Enums
import GuardianInformationCard from '@components/permit-holders/GuardianInformationCard'; // Guardian Information card
import AppHistoryCard from '@components/permit-holders/AppHistoryCard'; // APP History card
import AttachedFilesCard from '@components/permit-holders/AttachedFilesCard'; // Attached Files card
import MedicalHistoryCard from '@components/permit-holders/MedicalHistoryCard'; // Medical History card
import { GetPermitHolderRequest, GetPermitHolderResponse } from '@tools/pages/permit-holders/types';
import { GET_PERMIT_HOLDER } from '@tools/pages/permit-holders/queries'; // Permit holder query
import { useQuery } from '@apollo/client'; // Apollo
import { useState } from 'react'; // React

export type ApplicantData = {
  id: number;
  rcdUserId?: number;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: Date;
  email?: string;
  phone: string;
  province: Province;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
  status?: ApplicantStatus;
};

export type PermitData = {
  rcdPermitId: number;
  expiryDate: Date;
  applicationId: number;
  isRenewal: boolean;
  status: ApplicationStatus;
};

type Props = {
  readonly permitHolderId: number;
};

// Individual permit holder page
export default function PermitHolder({ permitHolderId }: Props) {
  const [applicantData, setApplicantData] = useState<ApplicantData>();
  const [permits, setPermits] = useState<PermitData[]>();

  const { data } = useQuery<GetPermitHolderResponse, GetPermitHolderRequest>(GET_PERMIT_HOLDER, {
    variables: {
      id: permitHolderId,
    },
    onCompleted: data => {
      setApplicantData({
        id: data.applicant.id,
        rcdUserId: data.applicant.rcdUserId || undefined,
        firstName: data.applicant.firstName,
        lastName: data.applicant.lastName,
        gender: data.applicant.gender,
        dateOfBirth: data.applicant.dateOfBirth,
        email: data.applicant.email || undefined,
        phone: data.applicant.phone,
        province: data.applicant.province,
        city: data.applicant.city,
        addressLine1: data.applicant.addressLine1,
        addressLine2: data.applicant.addressLine2 || undefined,
        postalCode: data.applicant.postalCode,
        status: data.applicant.status || undefined,
      });
      setPermits(
        data.applicant.permits.map(permit => ({
          rcdPermitId: permit.rcdPermitId,
          expiryDate: permit.expiryDate,
          applicationId: permit.applicationId,
          isRenewal: permit.application.isRenewal,
          status: permit.application.applicationProcessing.status,
        }))
      );
    },
  });

  return (
    <Layout>
      <GridItem rowSpan={1} colSpan={12} marginTop={3}>
        <PermitHolderHeader applicant={applicantData} applicantStatus={applicantData?.status} />
      </GridItem>
      <GridItem rowSpan={12} colSpan={5} marginTop={5} textAlign="left">
        <Stack spacing={5}>
          <PersonalInformationCard applicant={applicantData} />
          <DoctorInformationCard
            physician={data?.applicant.medicalInformation.physician}
            permitHolderId={permitHolderId}
          />
          <GuardianInformationCard guardian={data?.applicant.guardian} />
        </Stack>
      </GridItem>

      <GridItem rowSpan={12} colSpan={7} marginTop={5} textAlign="left">
        <Stack spacing={5}>
          <AppHistoryCard permits={permits || []} />
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
