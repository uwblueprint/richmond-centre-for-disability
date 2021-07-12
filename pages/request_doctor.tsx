import DoctorInformationCard from '@components/requests/DoctorInformationCard';

export default function Request() {
  const info = {
    name: 'emilio',
    userId: 123,
    phoneNumber: '123467',
    address: '123 waterloo street',
    email: 'emilio@mena.com',
    updated: true,
  };
  return <DoctorInformationCard {...info} />;
}
