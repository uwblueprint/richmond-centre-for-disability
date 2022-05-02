import { VStack } from '@chakra-ui/react';
import PermitHolderInfoCard from '@components/admin/LayoutCard';
import {
  CurrentApplication,
  MedicalInformationSectionData,
} from '@tools/admin/permit-holders/current-application';
import { FC, useMemo } from 'react';
import Header from '@components/admin/permit-holders/current-application/Card/Header';
import AttachedFilesSection from '@components/admin/permit-holders/current-application/Card/AttachedFilesSection';
import MedicalInformationSection from '@components/admin/permit-holders/current-application/Card/MedicalInformationSection';
import AdditionalInformationSection from '@components/admin/permit-holders/current-application/Card/AdditionalInformationSection';

type Props = {
  readonly application: CurrentApplication;
  readonly applicantMedicalInformation: MedicalInformationSectionData;
};

/**
 * Card for displaying current APP request information of permit holder
 */
const CurrentApplicationCard: FC<Props> = ({ application, applicantMedicalInformation }) => {
  const { type } = application;

  /**
   * Medical information to be displayed
   * - For new applications, display data from application
   * - For renewal/replacement applications, display applicant data on record
   */
  const medicalInformation = useMemo(() => {
    if (type === 'NEW') {
      const {
        disability,
        disabilityCertificationDate,
        patientCondition,
        otherPatientCondition,
        mobilityAids,
      } = application;
      return {
        disability,
        disabilityCertificationDate,
        patientCondition,
        otherPatientCondition,
        mobilityAids,
      };
    }

    return applicantMedicalInformation;
  }, [type]);

  return (
    <PermitHolderInfoCard colSpan={7} header={<Header application={application} />} divider>
      <VStack width="100%" align="stretch" spacing="24px">
        <AttachedFilesSection application={application} />
        <MedicalInformationSection medicalInformation={medicalInformation} />
        {(type === 'NEW' || type === 'RENEWAL') && (
          <AdditionalInformationSection application={application} />
        )}
      </VStack>
    </PermitHolderInfoCard>
  );
};

export default CurrentApplicationCard;
