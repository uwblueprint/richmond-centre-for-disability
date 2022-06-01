import { FC, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Box, Text, SimpleGrid, VStack, Button } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card component
import {
  GetAdditionalInformationRequest,
  GetAdditionalInformationResponse,
  GET_ADDITIONAL_INFORMATION,
  UpdateAdditionalInformationResponse,
  UpdateAdditionalInformationRequest,
  UPDATE_ADDITIONAL_INFORMATION,
  AdditionalInformationFormData,
} from '@tools/admin/requests/additional-questions';
import EditAdditionalInformationModal from './EditModal';
import { additionalQuestionsSchema } from '@lib/applications/validation';

type Props = {
  readonly applicationId: number;
  readonly isUpdated?: boolean;
  readonly editDisabled?: boolean;
  /** Whether card is a subsection */
  readonly isSubsection?: boolean;
};

const Card: FC<Props> = props => {
  const { applicationId, isUpdated, editDisabled, isSubsection } = props;

  const [additionalInformation, setAdditionalInformation] =
    useState<AdditionalInformationFormData | null>(null);

  const { refetch } = useQuery<GetAdditionalInformationResponse, GetAdditionalInformationRequest>(
    GET_ADDITIONAL_INFORMATION,
    {
      variables: { id: applicationId },
      onCompleted: data => {
        if (data) {
          setAdditionalInformation(data.application);
        }
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const [updateAdditionalInformation] = useMutation<
    UpdateAdditionalInformationResponse,
    UpdateAdditionalInformationRequest
  >(UPDATE_ADDITIONAL_INFORMATION);

  if (additionalInformation === null) return null;

  /** Handler for saving additional information */
  const handleSave = async (additionalInformationFormData: AdditionalInformationFormData) => {
    const validatedData = await additionalQuestionsSchema.validate(additionalInformationFormData);

    const { data } = await updateAdditionalInformation({
      variables: {
        input: {
          id: applicationId,
          ...validatedData,
        },
      },
    });

    refetch();
    return data;
  };

  const {
    usesAccessibleConvertedVan,
    accessibleConvertedVanLoadingMethod,
    requiresWiderParkingSpace,
    requiresWiderParkingSpaceReason,
    otherRequiresWiderParkingSpaceReason,
  } = additionalInformation;

  return (
    <PermitHolderInfoCard
      colSpan={7}
      header={`Additional Information`}
      updated={isUpdated}
      divider
      editModal={
        !editDisabled && (
          <EditAdditionalInformationModal
            additionalInformation={{
              usesAccessibleConvertedVan,
              accessibleConvertedVanLoadingMethod,
              requiresWiderParkingSpace,
              requiresWiderParkingSpaceReason,
              otherRequiresWiderParkingSpaceReason,
            }}
            onSave={handleSave}
          >
            <Button color="primary" variant="ghost" textDecoration="underline">
              <Text textStyle="body-bold">Edit</Text>
            </Button>
          </EditAdditionalInformationModal>
        )
      }
      isSubsection={isSubsection}
    >
      <VStack align="left" spacing="12px">
        <SimpleGrid columns={2} spacingX="12px" spacingY="20px" templateColumns="200px 1fr">
          <Box>
            <Text as="p" textStyle="body-regular" textAlign="left">
              Converted Van
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular" textAlign="left">
              {usesAccessibleConvertedVan ? 'Yes' : 'No'}
            </Text>
          </Box>
          {usesAccessibleConvertedVan && (
            <>
              <Box>
                <Text as="p" textStyle="body-regular" textAlign="left">
                  Loading method
                </Text>
              </Box>
              <Box>
                <Text as="p" textStyle="body-regular" textAlign="left">
                  {accessibleConvertedVanLoadingMethod === 'SIDE_LOADING'
                    ? 'Side loading'
                    : 'End loading'}
                </Text>
              </Box>
            </>
          )}
          <Box>
            <Text as="p" textStyle="body-regular" textAlign="left">
              Wider parking
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular" textAlign="left">
              {requiresWiderParkingSpace ? 'Yes' : 'No'}
            </Text>
          </Box>
          {requiresWiderParkingSpace && (
            <>
              <Box>
                <Text as="p" textStyle="body-regular" textAlign="left">
                  Reason
                </Text>
              </Box>
              <Box>
                <Text as="p" textStyle="body-regular" textAlign="left">
                  {requiresWiderParkingSpaceReason === 'HAS_ACCESSIBLE_VAN'
                    ? 'Has accessible van'
                    : requiresWiderParkingSpaceReason === 'MEDICAL_REASONS'
                    ? 'Medical reasons'
                    : 'Other - ' + otherRequiresWiderParkingSpaceReason}
                </Text>
              </Box>
            </>
          )}
        </SimpleGrid>
      </VStack>
    </PermitHolderInfoCard>
  );
};

export default Card;
