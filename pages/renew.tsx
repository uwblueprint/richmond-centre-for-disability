import { Step } from '@tools/applicant/renewal-form'; // Page tools
import Request from '@containers/Request'; // Request state
import IdentityVerification from '@components/applicant/renewals/IdentityVerification';
import RenewalForm from '@components/applicant/renewals/RenewalForm';
import Layout from '@components/applicant/Layout';

export default function Renew() {
  // Request state
  const { currentStep } = Request.useContainer();

  return (
    <Layout footer={currentStep === Step.IDENTITY_VERIFICATION ? false : undefined}>
      {currentStep === Step.IDENTITY_VERIFICATION ? <IdentityVerification /> : <RenewalForm />}
    </Layout>
  );
}
