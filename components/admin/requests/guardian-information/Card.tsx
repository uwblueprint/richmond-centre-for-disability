import { useMutation, useQuery } from '@apollo/client';
import { Box, Text, Divider, VStack, Button, Link as FileLink } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card Component
import { formatFullName, formatPhoneNumber } from '@lib/utils/format';
import {
  GetGuardianInformationRequest,
  GetGuardianInformationResponse,
  GET_GUARDIAN_INFORMATION,
  GuardianCardData,
  UpdateGuardianInformationRequest,
  UpdateGuardianInformationResponse,
  UPDATE_GUARDIAN_INFORMATION,
} from '@tools/admin/requests/guardian-information';
import { useCallback, useState } from 'react';
import EditGuardianInformationModal from '@components/admin/requests/guardian-information/EditModal';
import { AddIcon } from '@chakra-ui/icons';
import { guardianInformationSchema } from '@lib/guardian/validation';
import { UpdateApplicationGuardianInformationInput } from '@lib/graphql/types';
import Address from '@components/admin/Address';
import { INITIAL_GUARDIAN_INFORMATION } from '@tools/admin/requests/create-new';
import { getFileName } from '@lib/utils/s3-utils';

type GuardianInformationProps = {
  readonly applicationId: number;
  readonly editDisabled?: boolean;
  /** Whether card is a subsection */
  readonly isSubsection?: boolean;
};

export default function GuardianInformationCard({
  applicationId,
  editDisabled,
  isSubsection,
}: GuardianInformationProps) {
  const [guardian, setGuardian] = useState<GuardianCardData | null>(null);

  const { refetch, loading } = useQuery<
    GetGuardianInformationResponse,
    GetGuardianInformationRequest
  >(GET_GUARDIAN_INFORMATION, {
    variables: { id: applicationId },
    onCompleted: data => {
      if (data) {
        const {
          firstName,
          lastName,
          relationship,
          phone,
          addressLine1,
          city,
          province,
          country,
          postalCode,
        } = data.application;
        // Only set guardian if mandatory fields are non-null
        // TODO: Improve schema design by adding nesting
        if (
          !!firstName &&
          !!lastName &&
          !!relationship &&
          !!phone &&
          !!addressLine1 &&
          !!city &&
          !!province &&
          !!country &&
          !!postalCode
        ) {
          setGuardian(data.application);
        } else {
          setGuardian(null);
        }
      }
    },
    notifyOnNetworkStatusChange: true,
  });

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
        <EditGuardianInformationModal
          guardianInformation={INITIAL_GUARDIAN_INFORMATION}
          onSave={handleSave}
        >
          <Button height="50px" leftIcon={<AddIcon height="14px" width="14px" />}>
            Add a Guardian/POA
          </Button>
        </EditGuardianInformationModal>
      </VStack>
    );
  }, []);

  /** Render guardian information */
  const _renderGuardianInformation = useCallback((guardian: GuardianCardData) => {
    return (
      <>
        <VStack spacing="12px" align="left">
          <Box>
            <Text as="p" textStyle="body-regular">
              {formatFullName(guardian.firstName, guardian.middleName, guardian.lastName)}
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular">
              {`Phone: ${guardian.phone && formatPhoneNumber(guardian.phone)}`}
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular">
              {`Relationship: ${guardian.relationship}`}
            </Text>
          </Box>
        </VStack>

        <Divider mt="24px" />

        <VStack spacing="12px" pt="24px" align="left">
          <Box>
            <Text as="h4" textStyle="body-bold">
              Address
            </Text>
          </Box>
          <Box>
            <Address
              address={{
                addressLine1: guardian.addressLine1,
                addressLine2: guardian.addressLine2,
                city: guardian.city,
                province: guardian.province,
                country: guardian.country,
                postalCode: guardian.postalCode,
              }}
            />
          </Box>
        </VStack>

        {guardian.poaFormS3ObjectKey && guardian.poaFormS3ObjectUrl && (
          <>
            <Divider my="24px" />
            <VStack spacing="12px" align="left">
              <Text as="h4" textStyle="body-bold">
                Attached POA Form
              </Text>
              <FileLink
                href={guardian.poaFormS3ObjectUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Text as="p" textStyle="body-regular" color="primary" textDecoration="underline">
                  {!!guardian.poaFormS3ObjectKey && getFileName(guardian.poaFormS3ObjectKey)}
                </Text>
              </FileLink>
            </VStack>
          </>
        )}
      </>
    );
  }, []);

  /** Handler for saving doctor information */
  const handleSave = async (
    guardianInformationData: Omit<
      UpdateApplicationGuardianInformationInput,
      'id' | 'poaFormS3ObjectUrl'
    >
  ) => {
    const { poaFormS3ObjectKey } = guardianInformationData;

    const validatedData = await guardianInformationSchema.validate(guardianInformationData);

    const { data } = await updateGuardianInformation({
      variables: { input: { id: applicationId, poaFormS3ObjectKey, ...validatedData } },
    });
    refetch();
    return data;
  };

  return (
    <PermitHolderInfoCard
      colSpan={7}
      header={`Guardian's Information`}
      isSubsection={isSubsection}
      editModal={
        !editDisabled &&
        guardian && (
          <EditGuardianInformationModal guardianInformation={guardian} onSave={handleSave}>
            <Button color="primary" variant="ghost" textDecoration="underline">
              <Text textStyle="body-bold">Edit</Text>
            </Button>
          </EditGuardianInformationModal>
        )
      }
      loading={loading}
      divider
    >
      {guardian === null ? _renderAddGuardian() : _renderGuardianInformation(guardian)}
    </PermitHolderInfoCard>
  );
}
