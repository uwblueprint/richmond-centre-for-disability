import { Step } from '@tools/applicant/renewal-form'; // Page tools
import RenewalFlow from '@containers/RenewalFlow'; // Request state
import IdentityVerification from '@components/applicant/renewals/IdentityVerification';
import RenewalForm from '@components/applicant/renewals/RenewalForm';
import Layout from '@components/applicant/Layout';
import RenewalFormContainer from '@containers/RenewalForm';

export default function Renew() {
  // Request state
  const { currentStep } = RenewalFlow.useContainer();

  return (
    <Layout footer={currentStep === Step.IDENTITY_VERIFICATION ? false : undefined}>
      {currentStep === Step.IDENTITY_VERIFICATION ? (
        <IdentityVerification />
      ) : (
        <RenewalFormContainer.Provider>
          <RenewalForm />
        </RenewalFormContainer.Provider>
      )}
    </Layout>
  );
}
