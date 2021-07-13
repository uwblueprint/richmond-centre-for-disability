import PersonalInformationCard from '@components/requests/PersonalInformationCard';
import DoctorInformationCard from '@components/requests/DoctorInformationCard';

export default function Request() {
  const info = {
    name: 'Christian Chan',
    userId: 123,
    phoneNumber: '123467',
    address: '123 waterloo street',
    email: 'emilio@mena.com',
  };

  const doc_info = {
    name: 'emilio',
    userId: 123,
    phoneNumber: '123467',
    address: '123 waterloo street',
    email: 'emilio@mena.com',
    updated: true,
  };

  return (
    <div>
      <div>
        <PersonalInformationCard {...info} />
      </div>
      <div>
        <DoctorInformationCard {...doc_info} />
      </div>
    </div>
  );
}
