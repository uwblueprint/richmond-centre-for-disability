import { Button, Divider, Flex, Text, VStack } from '@chakra-ui/react';
import RenewalFlow from '@containers/RenewalFlow';
import RenewalForm from '@containers/RenewalForm';
import {
  formatFullName,
  formatPhoneNumber,
  formatPostalCode,
  formatStreetAddress,
} from '@lib/utils/format';
import { FC } from 'react';
import ReviewRequestField from '@components/applicant/renewals/RenewalForm/ReviewRequestField';
import { titlecase } from '@tools/string';
import { RequiresWiderParkingSpaceReason } from '@lib/graphql/types';

const ReviewSection: FC = () => {
  const { goToStep } = RenewalFlow.useContainer();
  const {
    updatedAddress,
    updatedContactInfo,
    updatedDoctorInfo,
    personalAddressInformation,
    contactInformation,
    doctorInformation,
    additionalInformation,
    donationAmount,
  } = RenewalForm.useContainer();

  return (
    <VStack align="flex-start" spacing="32px" mt="24px">
      {/* Personal address information section */}
      <VStack align="flex-start" spacing={updatedAddress ? undefined : '24px'}>
        <Flex minWidth={{ md: '640px' }} justifyContent="space-between">
          <Text as="h3" textStyle="heading">{`Address Information`}</Text>
          <Button
            variant="outline"
            onClick={() => goToStep(0)}
            display={{ sm: 'none', md: 'initial' }}
          >{`Edit`}</Button>
        </Flex>
        {updatedAddress ? (
          <VStack align="flex-start" spacing="12px">
            <ReviewRequestField
              name={`Address`}
              value={formatStreetAddress(
                personalAddressInformation.addressLine1,
                personalAddressInformation.addressLine2
              )}
            />
            <ReviewRequestField name={`City`} value={personalAddressInformation.city} />
            <ReviewRequestField
              name={`Postal Code`}
              value={formatPostalCode(personalAddressInformation.postalCode)}
            />
          </VStack>
        ) : (
          <Text
            as="p"
            textStyle="body-regular"
            textAlign="left"
            mb="16px"
          >{`Has not changed since last renewal.`}</Text>
        )}
      </VStack>
      <Divider />

      {/* Contact information section */}
      <VStack align="flex-start" spacing={updatedContactInfo ? undefined : '24px'}>
        <Flex minWidth={{ md: '640px' }} justifyContent="space-between">
          <Text as="h3" textStyle="heading">{`Contact Information`}</Text>
          <Button
            variant="outline"
            onClick={() => goToStep(1)}
            display={{ sm: 'none', md: 'initial' }}
          >{`Edit`}</Button>
        </Flex>
        {updatedContactInfo ? (
          <VStack align="flex-start" spacing="12px">
            <ReviewRequestField
              name={`Phone Number`}
              value={contactInformation.phone && formatPhoneNumber(contactInformation.phone)}
            />
            <ReviewRequestField name={`Email Address`} value={contactInformation.email} />
          </VStack>
        ) : (
          <Text
            as="p"
            textStyle="body-regular"
            textAlign="left"
            mb="16px"
          >{`Has not changed since last renewal.`}</Text>
        )}
      </VStack>
      <Divider />

      {/* Doctor information section */}
      <VStack align="flex-start" spacing={updatedDoctorInfo ? undefined : '24px'}>
        <Flex minWidth={{ md: '640px' }} justifyContent="space-between">
          <Text as="h3" textStyle="heading">{`Doctor's Information`}</Text>
          <Button
            variant="outline"
            onClick={() => goToStep(2)}
            display={{ sm: 'none', md: 'initial' }}
          >{`Edit`}</Button>
        </Flex>
        {updatedDoctorInfo ? (
          <VStack align="flex-start" spacing="12px">
            <ReviewRequestField
              name={`Name`}
              value={formatFullName(doctorInformation.firstName, doctorInformation.lastName)}
            />
            <ReviewRequestField name={`MSP Number`} value={doctorInformation.mspNumber} />
            <ReviewRequestField
              name={`Address`}
              value={formatStreetAddress(
                doctorInformation.addressLine1,
                doctorInformation.addressLine2
              )}
            />
            <ReviewRequestField name={`City`} value={doctorInformation.city} />
            <ReviewRequestField
              name={`Postal Code`}
              value={formatPostalCode(doctorInformation.postalCode)}
            />
            <ReviewRequestField
              name={`Phone Number`}
              value={doctorInformation.phone && formatPhoneNumber(doctorInformation.phone)}
            />
          </VStack>
        ) : (
          <Text
            as="p"
            textStyle="body-regular"
            textAlign="left"
          >{`Has not changed since last renewal.`}</Text>
        )}
      </VStack>
      <Divider />

      {/* Additional information section */}
      <VStack align="flex-start">
        <Flex minWidth={{ md: '640px' }} justifyContent="space-between">
          <Text as="h3" textStyle="heading">{`Additional Information`}</Text>
          <Button
            variant="outline"
            onClick={() => goToStep(3)}
            display={{ sm: 'none', md: 'initial' }}
            mt="16px"
          >{`Edit`}</Button>
        </Flex>
        <VStack align="flex-start" spacing="12px">
          <VStack align="flex-start" spacing="0">
            <ReviewRequestField
              name={`I am using an accessible converted van`}
              value={additionalInformation.usesAccessibleConvertedVan ? 'Yes' : 'No'}
            />
            {additionalInformation.usesAccessibleConvertedVan && (
              <ReviewRequestField
                name={`Loading type`}
                value={titlecase(
                  additionalInformation.accessibleConvertedVanLoadingMethod as string
                )}
              />
            )}
          </VStack>
          <VStack align="flex-start" spacing="0">
            <ReviewRequestField
              name={`I require a wider accessible parking space`}
              value={additionalInformation.requiresWiderParkingSpace ? 'Yes' : 'No'}
            />
            {additionalInformation.requiresWiderParkingSpace && (
              <ReviewRequestField
                name={`Reason for requiring a wider accessible parking space`}
                value={
                  additionalInformation.requiresWiderParkingSpaceReason === 'OTHER'
                    ? (additionalInformation.otherRequiresWiderParkingSpaceReason as string)
                    : titlecase(
                        additionalInformation.requiresWiderParkingSpaceReason as NonNullable<RequiresWiderParkingSpaceReason>
                      )
                }
              />
            )}
          </VStack>
        </VStack>
      </VStack>
      <Divider />

      {/* Donation section */}
      <VStack align="flex-start">
        <Flex minWidth={{ md: '640px' }} justifyContent="space-between">
          <Text as="h3" textStyle="heading">{`Donation`}</Text>
          <Button
            variant="outline"
            onClick={() => goToStep(4)}
            display={{ sm: 'none', md: 'initial' }}
          >{`Edit`}</Button>
        </Flex>
        <VStack align="flex-start" spacing="12px">
          <ReviewRequestField name={`Amount`} value={`$${donationAmount}`} />
        </VStack>
      </VStack>
    </VStack>
  );
};

export default ReviewSection;
