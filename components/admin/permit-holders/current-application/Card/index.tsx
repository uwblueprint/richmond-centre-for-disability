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
import AttachedFilesSection from '@components/admin/permit-holders/current-application/Card/AttachedFilesSection';
import MedicalInformationSection from '@components/admin/permit-holders/current-application/Card/MedicalInformationSection';
import AdditionalInformationSection from '@components/admin/permit-holders/current-application/Card/AdditionalInformationSection';

type Props = {
  readonly applicantId: number;
};

/**
 * Card for displaying current APP request information of permit holder
 */
const CurrentApplicationCard: FC<Props> = ({ applicantId }) => {
  const { data } = useQuery<GetCurrentApplicationResponse, GetCurrentApplicationRequest>(
    GET_CURRENT_APPLICATION,
    { variables: { id: applicantId } }
  );

  if (!data?.application) {
    return null;
  }

  const { application } = data;
  const { type } = application;

  return (
    <PermitHolderInfoCard colSpan={7} header={<Header application={application} />} divider>
      <VStack width="100%" align="stretch" spacing="24px">
        <AttachedFilesSection application={application} />
        {type === 'NEW' && <MedicalInformationSection application={application} />}
        {(type === 'NEW' || type === 'RENEWAL') && (
          <AdditionalInformationSection application={application} />
        )}
      </VStack>
    </PermitHolderInfoCard>
  );
};

export default CurrentApplicationCard;
