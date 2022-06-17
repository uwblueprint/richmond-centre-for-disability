import {
  AccessibleConvertedVanLoadingMethod,
  RequiresWiderParkingSpaceReason,
} from '@lib/graphql/types';
import { DonationAmount } from '@tools/applicant/renewal-form';
import { useState } from 'react';
import { createContainer } from 'unstated-next'; // Unstated Next

/**
 * Hook for managing the state of the applicant renewal request form
 * @returns State and utils of RenewalForm container
 */
const useRenewalForm = () => {
  // Form state
  const [updatedAddress, setUpdatedAddress] = useState(false);
  const [updatedContactInfo, setUpdatedContactInfo] = useState(false);
  const [updatedDoctorInfo, setUpdatedDoctorInfo] = useState(false);
  const [personalAddressInformation, setPersonalAddressInformation] = useState<{
    addressLine1: string;
    addressLine2: string;
    city: string;
    postalCode: string;
  }>({
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
  });
  const [contactInformation, setContactInformation] = useState<{
    phone: string;
    email: string;
    receiveEmailUpdates: boolean;
  }>({
    phone: '',
    email: '',
    receiveEmailUpdates: false,
  });
  const [doctorInformation, setDoctorInformation] = useState<{
    firstName: string;
    lastName: string;
    mspNumber: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postalCode: string;
    phone: string;
  }>({
    firstName: '',
    lastName: '',
    mspNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    phone: '',
  });
  const [additionalInformation, setAdditionalInformation] = useState<{
    usesAccessibleConvertedVan: boolean;
    accessibleConvertedVanLoadingMethod: AccessibleConvertedVanLoadingMethod | null;
    requiresWiderParkingSpace: boolean;
    requiresWiderParkingSpaceReason: RequiresWiderParkingSpaceReason | null;
    otherRequiresWiderParkingSpaceReason: string | null;
  }>({
    usesAccessibleConvertedVan: false,
    accessibleConvertedVanLoadingMethod: null,
    requiresWiderParkingSpace: false,
    requiresWiderParkingSpaceReason: null,
    otherRequiresWiderParkingSpaceReason: null,
  });
  const [donationAmount, setDonationAmount] = useState<DonationAmount>(5);

  return {
    updatedAddress,
    setUpdatedAddress,
    updatedContactInfo,
    setUpdatedContactInfo,
    updatedDoctorInfo,
    setUpdatedDoctorInfo,
    personalAddressInformation,
    setPersonalAddressInformation,
    contactInformation,
    setContactInformation,
    doctorInformation,
    setDoctorInformation,
    additionalInformation,
    setAdditionalInformation,
    donationAmount,
    setDonationAmount,
  };
};

export default createContainer(useRenewalForm);
