import PersonalInformationCard from '@components/requests/PersonalInformationCard';

export default function Request() {
  const info = {
    name: 'emilio',
    userId: 123,
    phoneNumber: '123467',
    address: '123 waterloo street',
    email: 'emilio@mena.com',
  };
  return <PersonalInformationCard {...info} />;
}

// function Request() {
//   return <div>About</div>
// }

// export default Request
