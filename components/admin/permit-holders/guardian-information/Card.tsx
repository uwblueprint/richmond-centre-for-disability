import { useMutation, useQuery } from '@apollo/client';
import { Button, Divider, VStack } from '@chakra-ui/react';
import PermitHolderInfoCard from '@components/admin/LayoutCard';
import {
  GetGuardianInformationRequest,
  GetGuardianInformationResponse,
  GET_GUARDIAN_INFORMATION,
  UpdateGuardianInformationRequest,
  UpdateGuardianInformationResponse,
  UPDATE_GUARDIAN_INFORMATION,
} from '@tools/admin/permit-holders/guardian-information';
import { FC, useCallback } from 'react';
import { Text } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { formatFullName } from '@lib/utils/format';
import { Guardian, UpdateApplicantGuardianInformationInput } from '@lib/graphql/types';
import Address from '@components/admin/Address';
import EditGuardianInformationModal from '@components/admin/requests/guardian-information/EditModal';

type Props = {
  readonly applicantId: number;
};

/**
 * Card for guardian/POA information of permit holder
 */
const GuardianInformationCard: FC<Props> = props => {
  const { applicantId } = props;

  const { data, refetch } = useQuery<GetGuardianInformationResponse, GetGuardianInformationRequest>(
    GET_GUARDIAN_INFORMATION,
    {
      variables: {
        id: applicantId,
      },
    }
  );

  const [updateGuardianInformation] = useMutation<
    UpdateGuardianInformationResponse,
    UpdateGuardianInformationRequest
  >(UPDATE_GUARDIAN_INFORMATION);

  /** Render add Guardian view */
  const _renderAddGuardian = useCallback(() => {
    return (
      <VStack
        height="100%"
        width="100%"
        px="12px"
        py="40px"
        justify="center"
        align="center"
        spacing="24px"
        border="1px solid"
        borderColor="border.secondary"
        borderStyle="dashed"
        borderRadius="4px"
      >
        <Text as="p" textStyle="body-regular">
          This permit holder does not have a guardian/POA
        </Text>
        <Button height="50px" leftIcon={<AddIcon height="14px" width="14px" />}>
          Add a Guardian/POA
        </Button>
      </VStack>
    );
  }, []);

  /** Render guardian information */
  // TODO: Integrate with guardian information form edit modal
  const _renderGuardianInformation = useCallback((guardian: Guardian) => {
    const {
      firstName,
      middleName,
      lastName,
      phone,
      relationship,
      addressLine1,
      addressLine2,
      city,
      province,
      country,
      postalCode,
    } = guardian;

    // TODO: Support POA form section
    return (
      <VStack width="100%" spacing="24px" align="stretch">
        <VStack spacing="12px" align="left">
          <Text as="p" textStyle="body-regular" textAlign="left">
            {formatFullName(firstName, middleName, lastName)}
          </Text>
          <Text as="p" textStyle="body-regular" textAlign="left">
            {`Phone: ${phone}`}
          </Text>
          <Text as="p" textStyle="body-regular" textAlign="left">
            {`Relationship: ${relationship}`}
          </Text>
        </VStack>
        <Divider />
        <VStack spacing="12px" align="left">
          <Text as="h4" textStyle="body-bold">
            Address
          </Text>
          <Address address={{ addressLine1, addressLine2, city, province, country, postalCode }} />
        </VStack>
      </VStack>
    );
  }, []);

  if (!data?.applicant) {
    return null;
  }

  /** Handler for saving guardian information */
  const handleSave = async (data: Omit<UpdateApplicantGuardianInformationInput, 'id'>) => {
    // ! Temporarily remove omitGuardianPoa field
    // TODO: Support omitting guardian/POA
    await updateGuardianInformation({
      variables: { input: { id: applicantId, ...data } },
    });
    refetch();
  };

  const { guardian } = data.applicant;

  return (
    <PermitHolderInfoCard
      colSpan={5}
      header="Guardian/POA Information"
      divider
      editModal={
        guardian && (
          <EditGuardianInformationModal guardianInformation={guardian} onSave={handleSave}>
            <Button color="primary" variant="ghost" textDecoration="underline">
              <Text textStyle="body-bold">Edit</Text>
            </Button>
          </EditGuardianInformationModal>
        )
      }
    >
      {data.applicant.guardian === null
        ? _renderAddGuardian()
        : _renderGuardianInformation(data.applicant.guardian)}
    </PermitHolderInfoCard>
  );
};

export default GuardianInformationCard;
