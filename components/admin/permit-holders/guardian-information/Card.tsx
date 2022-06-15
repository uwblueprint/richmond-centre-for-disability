import { useMutation } from '@apollo/client';
import { Button, Divider, VStack, Link as FileLink } from '@chakra-ui/react';
import PermitHolderInfoCard from '@components/admin/LayoutCard';
import {
  GuardianInformationCardData,
  UpdateGuardianInformationRequest,
  UpdateGuardianInformationResponse,
  UPDATE_GUARDIAN_INFORMATION,
} from '@tools/admin/permit-holders/guardian-information';
import { FC, useCallback } from 'react';
import { Text } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { formatFullName, formatPhoneNumber } from '@lib/utils/format';
import { Guardian, UpdateApplicantGuardianInformationInput } from '@lib/graphql/types';
import Address from '@components/admin/Address';
import EditGuardianInformationModal from '@components/admin/requests/guardian-information/EditModal';
import { getFileName } from '@lib/utils/s3-utils';
import { guardianInformationSchema } from '@lib/guardian/validation';

type Props = {
  readonly applicantId: number;
  readonly guardian: GuardianInformationCardData | null;
  readonly refetch: () => void;
};

/**
 * Card for guardian/POA information of permit holder
 */
const GuardianInformationCard: FC<Props> = props => {
  const { applicantId, guardian, refetch } = props;

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
      poaFormS3ObjectKey,
      poaFormS3ObjectUrl,
    } = guardian;

    // TODO: Support POA form section
    return (
      <VStack width="100%" spacing="24px" align="stretch">
        <VStack spacing="12px" align="left">
          <Text as="p" textStyle="body-regular" textAlign="left">
            {formatFullName(firstName, middleName, lastName)}
          </Text>
          <Text as="p" textStyle="body-regular" textAlign="left">
            {`Phone: ${formatPhoneNumber(phone)}`}
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
        {poaFormS3ObjectKey && poaFormS3ObjectUrl && (
          <>
            <Divider />
            <VStack spacing="12px" align="left">
              <Text as="h4" textStyle="body-bold">
                Attached POA Form
              </Text>
              <FileLink href={poaFormS3ObjectUrl} target="_blank" rel="noopener noreferrer">
                <Text as="p" textStyle="body-regular" color="primary" textDecoration="underline">
                  {!!poaFormS3ObjectKey && getFileName(poaFormS3ObjectKey)}
                </Text>
              </FileLink>
            </VStack>
          </>
        )}
      </VStack>
    );
  }, []);

  /** Handler for saving guardian information */
  const handleSave = async (
    guardianInformationData: Omit<UpdateApplicantGuardianInformationInput, 'id'>
  ) => {
    // ! Temporarily remove omitGuardianPoa field
    // TODO: Support omitting guardian/POA

    const { poaFormS3ObjectKey } = guardianInformationData;

    const validatedData = await guardianInformationSchema.validate(guardianInformationData);

    const { data } = await updateGuardianInformation({
      variables: { input: { id: applicantId, poaFormS3ObjectKey, ...validatedData } },
    });
    refetch();
    return data;
  };

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
      {guardian === null ? _renderAddGuardian() : _renderGuardianInformation(guardian)}
    </PermitHolderInfoCard>
  );
};

export default GuardianInformationCard;
