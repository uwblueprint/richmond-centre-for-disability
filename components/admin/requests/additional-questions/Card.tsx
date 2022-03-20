import { FC, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Box, Text, SimpleGrid, VStack } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card component
import {
  GetAdditionalInformationRequest,
  GetAdditionalInformationResponse,
  GET_ADDITIONAL_INFORMATION,
  AdditionalInformationFormData,
} from '@tools/admin/requests/additional-questions';

type Props = {
  readonly applicationId: number;
  readonly isUpdated?: boolean;
};

const Card: FC<Props> = props => {
  const { applicationId, isUpdated } = props;

  const [additionalInformation, setAdditionalInformation] =
    useState<AdditionalInformationFormData | null>(null);

  useQuery<GetAdditionalInformationResponse, GetAdditionalInformationRequest>(
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

  if (additionalInformation === null) return null;

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
      editModal={false}
    >
      <VStack align="left" spacing="12px">
        <SimpleGrid columns={2} spacingX="70px" spacingY="12px">
          <Box>
            <Text as="p" textStyle="body-regular" textAlign="left">
              Converted Van
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular" textAlign="left">
              {usesAccessibleConvertedVan ? 'No' : 'Yes'}
            </Text>
          </Box>
          {accessibleConvertedVanLoadingMethod && (
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
                  {requiresWiderParkingSpaceReason
                    ? requiresWiderParkingSpaceReason
                    : otherRequiresWiderParkingSpaceReason
                    ? otherRequiresWiderParkingSpaceReason
                    : 'Not Given'}
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
