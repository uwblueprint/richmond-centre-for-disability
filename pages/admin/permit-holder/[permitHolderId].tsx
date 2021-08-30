import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { GridItem, Stack } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/internal/Layout'; // Layout component
import { authorize } from '@tools/authorization'; // Page authorization
import PermitHolderHeader from '@components/permit-holders/PermitHolderHeader'; // Permit Holder header
import DoctorInformationCard from '@components/permit-holders/DoctorInformationCard'; // Doctor information card
import PersonalInformationCard from '@components/permit-holders/PersonalInformationCard'; // Personal information card
import GuardianInformationCard from '@components/permit-holders/GuardianInformationCard'; // Guardian Information card
import AppHistoryCard from '@components/permit-holders/AppHistoryCard'; // APP History card
import AttachedFilesCard from '@components/permit-holders/AttachedFilesCard'; // Attached Files card
import MedicalHistoryCard from '@components/permit-holders/MedicalHistoryCard'; // Medical History card
import { GetPermitHolderRequest, GetPermitHolderResponse } from '@tools/pages/permit-holders/types';
import { GET_PERMIT_HOLDER } from '@tools/pages/permit-holders/queries'; // Permit holder query
import { useQuery } from '@apollo/client'; // Apollo
import { useState } from 'react'; // React
import {
  ApplicantData,
  PermitData,
  MedicalHistoryEntry,
  PermitHolderAttachedFile,
  PreviousPhysicianData,
} from '@tools/pages/admin/permit-holders/permit-holder-id';
import { Role } from '@lib/graphql/types';

type Props = {
  readonly permitHolderId: number;
};

// Individual permit holder page
export default function PermitHolder({ permitHolderId }: Props) {
  const [applicantData, setApplicantData] = useState<ApplicantData>();
  const [permits, setPermits] = useState<PermitData[]>();
  const [medicalHistoryData, setMedicalHistoryData] = useState<MedicalHistoryEntry[]>();
  const [attachedFiles, setAttachedFiles] = useState<PermitHolderAttachedFile[]>();
  const [previousPhysicianData, setPreviousPhysicianData] = useState<PreviousPhysicianData[]>();

  const { data } = useQuery<GetPermitHolderResponse, GetPermitHolderRequest>(GET_PERMIT_HOLDER, {
    variables: {
      id: permitHolderId,
    },
    onCompleted: data => {
      setApplicantData(data.applicant);
      setPermits(
        data.applicant.permits.map(permit => ({
          rcdPermitId: permit.rcdPermitId,
          expiryDate: permit.expiryDate,
          applicationId: permit.applicationId,
          isRenewal: permit.application.isRenewal,
          status: permit.application.applicationProcessing.status,
        }))
      );
      const files: PermitHolderAttachedFile[] = [];
      data.applicant.fileHistory.forEach(application => {
        application.documentUrls?.forEach(documentUrl => {
          files.push({
            appNumber: application.appNumber,
            createdAt: application.createdAt,
            fileUrl: documentUrl,
          });
        });
      });
      setAttachedFiles(files);
      setMedicalHistoryData(
        data.applicant.applications.map(application => ({
          disability: application.disability,
          createdAt: application.createdAt,
          applicantApplication: application,
        }))
      );
      setPreviousPhysicianData(
        data.applicant.medicalHistory.map(record => ({
          name: record.physician.name,
          mspNumber: record.physician.mspNumber,
          phone: record.physician.phone,
        }))
      );
    },
  });

  return (
    <Layout>
      <GridItem rowSpan={1} colSpan={12} marginTop={3}>
        {applicantData && <PermitHolderHeader applicant={applicantData} />}
      </GridItem>
      <GridItem rowSpan={12} colSpan={5} marginTop={5} textAlign="left">
        <Stack spacing={5}>
          {applicantData && <PersonalInformationCard applicant={applicantData} />}
          {data && previousPhysicianData && (
            <DoctorInformationCard
              physician={data.applicant.medicalInformation.physician}
              previousPhysicianData={previousPhysicianData}
            />
          )}
          {data && <GuardianInformationCard guardian={data?.applicant.guardian} />}
        </Stack>
      </GridItem>

      <GridItem rowSpan={12} colSpan={7} marginTop={5} textAlign="left">
        <Stack spacing={5}>
          {permits && <AppHistoryCard permits={permits} />}
          <AttachedFilesCard attachedFiles={attachedFiles} />
          {medicalHistoryData && <MedicalHistoryCard medicalHistory={medicalHistoryData} />}
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
