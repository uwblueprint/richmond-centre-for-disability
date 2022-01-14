import { GetServerSideProps } from 'next'; // Get server side props
import { getSession } from 'next-auth/client'; // Session management
import { useQuery } from '@apollo/client'; // Apollo
import { GridItem, Stack } from '@chakra-ui/react'; // Chakra UI
import Layout from '@components/admin/Layout'; // Layout component
import { authorize } from '@tools/authorization'; // Page authorization
import PermitHolderHeader from '@components/admin/permit-holders/Header'; // Permit Holder header
import DoctorInformationCard from '@components/admin/permit-holders/doctor-information/Card'; // Doctor information card
import PersonalInformationCard from '@components/admin/permit-holders/permit-holder-information/Card'; // Personal information card
import AppHistoryCard from '@components/admin/permit-holders/app-history/Card'; // APP History card
import AttachedFilesCard from '@components/admin/permit-holders/attached-files/Card'; // Attached Files card
import MedicalHistoryCard from '@components/admin/permit-holders/medical-history/Card'; // Medical History card
import {
  GetApplicantRequest,
  GetApplicantResponse,
  GET_APPLICANT_QUERY,
} from '@tools/admin/permit-holders/view-permit-holder';
import { formatFullName } from '@lib/utils/format';

type Props = {
  readonly id: string;
};

// Individual permit holder page
export default function PermitHolder({ id: idString }: Props) {
  const id = parseInt(idString);

  const { data } = useQuery<GetApplicantResponse, GetApplicantRequest>(GET_APPLICANT_QUERY, {
    variables: { id },
  });

  if (!data?.applicant) {
    return null;
  }

  const { firstName, middleName, lastName, status, rcdUserId } = data.applicant;

  return (
    <Layout>
      <GridItem rowSpan={1} colSpan={12} marginTop={3}>
        <PermitHolderHeader
          applicant={{ name: formatFullName(firstName, middleName, lastName), status, rcdUserId }}
        />
      </GridItem>
      <GridItem rowSpan={12} colSpan={5} marginTop={5} textAlign="left">
        <Stack spacing={5}>
          <PersonalInformationCard applicantId={id} />
          <DoctorInformationCard applicantId={id} />
          {/* {data?.applicant.guardian && (
            <GuardianInformationCard guardian={data?.applicant.guardian} />
          )} */}
        </Stack>
      </GridItem>

      <GridItem rowSpan={12} colSpan={7} marginTop={5} textAlign="left">
        <Stack spacing={5}>
          <AppHistoryCard applicantId={id} />
          <AttachedFilesCard applicantId={id} />
          <MedicalHistoryCard applicantId={id} />
        </Stack>
      </GridItem>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  // Only secretaries and admins can access permit holder information
  if (authorize(session, ['SECRETARY'])) {
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
