import { useQuery } from '@apollo/client';
import { VStack } from '@chakra-ui/react';
import PermitHolderInfoCard from '@components/admin/LayoutCard';
import {
  GetCurrentApplicationRequest,
  GetCurrentApplicationResponse,
  GET_CURRENT_APPLICATION,
} from '@tools/admin/permit-holders/current-application';
import { FC } from 'react';
import Header from '@components/admin/permit-holders/current-application/Card/Header';
import AttachedFilesSection from './AttachedFilesSection';
import MedicalInformationSection from './MedicalInformation';
import AdditionalQuestionsSection from '@components/admin/requests/additional-questions/Card';

type Props = {
  readonly applicantId: number;
};

/**
 * Card for displaying current APP request information of permit holder
 */
const CurrentApplicationCard: FC<Props> = _ => {
  const { data } = useQuery<GetCurrentApplicationResponse, GetCurrentApplicationRequest>(
    GET_CURRENT_APPLICATION,
    // TODO: Replace
    { variables: { id: 4 } }
  );

  if (!data?.application) {
    return null;
  }

  return (
    <PermitHolderInfoCard colSpan={7} header={<Header application={data.application} />} divider>
      <VStack width="100%" align="stretch" spacing="24px">
        <AttachedFilesSection application={data.application} />
        {data.application.type === 'NEW' && (
          <MedicalInformationSection application={data.application} />
        )}
        <AdditionalQuestionsSection applicationId={4} isSubsection />
      </VStack>
    </PermitHolderInfoCard>
  );
};

export default CurrentApplicationCard;
