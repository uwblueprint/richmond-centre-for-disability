import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { GridItem, Stack, useToast } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/admin/Layout'; // Layout component
import { authorize } from '@tools/authorization'; // Page authorization
import PermitHolderHeader from '@components/admin/permit-holders/PermitHolderHeader'; // Permit Holder header
import DoctorInformationCard from '@components/admin/permit-holders/DoctorInformationCard'; // Doctor information card
import PersonalInformationCard from '@components/admin/permit-holders/PersonalInformationCard'; // Personal information card
import GuardianInformationCard from '@components/admin/permit-holders/GuardianInformationCard'; // Guardian Information card
import AppHistoryCard from '@components/admin/permit-holders/AppHistoryCard'; // APP History card
import AttachedFilesCard from '@components/admin/permit-holders/AttachedFilesCard'; // Attached Files card
import MedicalHistoryCard from '@components/admin/permit-holders/MedicalHistoryCard'; // Medical History card
import {
  GET_PERMIT_HOLDER,
  GetPermitHolderRequest,
  GetPermitHolderResponse,
} from '@tools/pages/admin/permit-holders/get-permit-holder'; // Permit holder query
import { useMutation, useQuery } from '@apollo/client'; // Apollo
import { useState } from 'react'; // React
import {
  PermitData,
  MedicalHistoryEntry,
  PreviousPhysicianData,
} from '@tools/pages/admin/permit-holders/types'; // Permit holder types
import { Role, UpdateApplicantInput, UpsertPhysicianInput } from '@lib/graphql/types'; // GraphQL types
import {
  UpsertPhysicianRequest,
  UpsertPhysicianResponse,
  UPSERT_PHYSICIAN_MUTATION,
} from '@tools/pages/admin/permit-holders/upsert-physician'; // Upsert Physician types
import {
  UpdateApplicantRequest,
  UpdateApplicantResponse,
  UPDATE_APPLICANT_MUTATION,
} from '@tools/pages/admin/permit-holders/update-applicant'; // Update applicant types
import {
  UpdateMedicalInformationRequest,
  UpdateMedicalInformationResponse,
  UPDATE_MEDICAL_INFORMATION_MUTATION,
} from '@tools/pages/admin/permit-holders/update-medical-information'; // Medical information types

type Props = {
  readonly id: number;
};

// Individual permit holder page
export default function PermitHolder({ id }: Props) {
  const [permits, setPermits] = useState<PermitData[]>();
  const [medicalHistoryData, setMedicalHistoryData] = useState<MedicalHistoryEntry[]>();

  // TODO: uncomment when AWS is setup and we use real files
  // const [attachedFiles, setAttachedFiles] = useState<PermitHolderAttachedFile[]>();
  const [previousPhysicianData, setPreviousPhysicianData] = useState<PreviousPhysicianData[]>();

  const { data, refetch } = useQuery<GetPermitHolderResponse, GetPermitHolderRequest>(
    GET_PERMIT_HOLDER,
    {
      variables: {
        id,
      },
      fetchPolicy: 'network-only',
      onCompleted: data => {
        setPermits(
          data.applicant.permits.map(permit => ({
            rcdPermitId: permit.rcdPermitId,
            expiryDate: permit.expiryDate,
            applicationId: permit.applicationId,
            isRenewal: permit.application.isRenewal,
            status: permit.application.applicationProcessing.status,
          }))
        );
        // TODO: uncomment when AWS is setup and we use real files
        // const files: PermitHolderAttachedFile[] = [];
        // data.applicant.fileHistory.forEach(application => {
        //   application.documentUrls?.forEach(documentUrl => {
        //     files.push({
        //       appNumber: application.appNumber,
        //       createdAt: application.createdAt,
        //       fileUrl: documentUrl,
        //     });
        //   });
        // });
        // setAttachedFiles(files);
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
    }
  );

  const toast = useToast();

  // Submit updated medical information mutation
  const [submitUpdatedMedicalInformation] = useMutation<
    UpdateMedicalInformationResponse,
    UpdateMedicalInformationRequest
  >(UPDATE_MEDICAL_INFORMATION_MUTATION, {
    onError: error => {
      toast({
        status: 'error',
        description: error.message,
      });
    },
  });

  // Submit edited doctor information mutation
  const [submitEditedDoctorInformation] = useMutation<
    UpsertPhysicianResponse,
    UpsertPhysicianRequest
  >(UPSERT_PHYSICIAN_MUTATION, {
    onError: error => {
      toast({
        status: 'error',
        description: error.message,
      });
    },
  });

  // Submit edited user information mutation
  const [submitEditedUserInformation] = useMutation<
    UpdateApplicantResponse,
    UpdateApplicantRequest
  >(UPDATE_APPLICANT_MUTATION, {
    onCompleted: data => {
      if (data.updateApplicant.ok) {
        toast({
          status: 'success',
          description: "User's information has been edited.",
        });
      }
    },
    onError: error => {
      toast({
        status: 'error',
        description: error.message,
      });
    },
    refetchQueries: ['GetPermitHolder'],
  });

  /**
   * Update Doctor Information handler
   * @param physicianData Updated physician data
   */
  const handleUpdateDoctorInformation = async (physicianData: UpsertPhysicianInput) => {
    if (data) {
      const oldDoctorMSP = data.applicant.medicalInformation.physician.mspNumber;

      const editDoctorResult = await submitEditedDoctorInformation({
        variables: { input: { ...physicianData } },
      });
      const physicianId = editDoctorResult?.data?.upsertPhysician.physicianId;
      let isErrorOnUpdateDoctor = editDoctorResult?.data?.upsertPhysician.ok ? false : true;

      // If the physician's MSP number changed, then a new physician is created by submitEditedDoctorInformation.
      // This updates the physicianId in the applicants medical information to be the new physician's id.
      if (!isErrorOnUpdateDoctor && physicianId && physicianData.mspNumber !== oldDoctorMSP) {
        const updateMedicalInformationResult = await submitUpdatedMedicalInformation({
          variables: {
            input: {
              applicantId: +data.applicant.id,
              physicianId: physicianId,
            },
          },
        });

        isErrorOnUpdateDoctor = updateMedicalInformationResult?.data?.updateMedicalInformation.ok
          ? false
          : true;
      }

      if (!isErrorOnUpdateDoctor) {
        toast({
          status: 'success',
          description: "Doctor's information has been edited.",
        });
      }

      refetch();
    }
  };

  /**
   * Update application handler
   * @param applicationData Updated application data
   */
  const handleUpdateUserInformation = (applicantData: UpdateApplicantInput) => {
    submitEditedUserInformation({ variables: { input: { ...applicantData } } });
  };

  return (
    <Layout>
      <GridItem rowSpan={1} colSpan={12} marginTop={3}>
        {data?.applicant && <PermitHolderHeader applicant={data.applicant} />}
      </GridItem>
      <GridItem rowSpan={12} colSpan={5} marginTop={5} textAlign="left">
        <Stack spacing={5}>
          {data?.applicant && (
            <PersonalInformationCard
              applicant={data.applicant}
              onSave={handleUpdateUserInformation}
            />
          )}
          {data?.applicant.medicalInformation.physician && previousPhysicianData && (
            <DoctorInformationCard
              physician={data.applicant.medicalInformation.physician}
              previousPhysicianData={previousPhysicianData}
              onSave={handleUpdateDoctorInformation}
            />
          )}
          {data?.applicant.guardian && (
            <GuardianInformationCard guardian={data?.applicant.guardian} />
          )}
        </Stack>
      </GridItem>

      <GridItem rowSpan={12} colSpan={7} marginTop={5} textAlign="left">
        <Stack spacing={5}>
          {permits && <AppHistoryCard permits={permits} />}
          <AttachedFilesCard />
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
    const id = context?.params?.id;

    return {
      props: { id },
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
