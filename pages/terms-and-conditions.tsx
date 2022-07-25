import Layout from '@components/applicant/Layout';
import { NextPage } from 'next';
import { GridItem, Text, VStack } from '@chakra-ui/react';
import { Children, FC, ReactNode } from 'react';
import Link from 'next/link';
import { Link as ChakraLink } from '@chakra-ui/react';

const TermsAndConditions: NextPage = () => {
  return (
    <Layout>
      <GridItem colSpan={12} colStart={1}>
        <VStack align="flex-start" spacing="24px">
          <Text textStyle="display-large">Terms and Conditions</Text>
          <Text as="p" textStyle="body-bold" marginBottom="12px" textAlign="left">
            {`Please read these terms of use ("terms of use", "agreement") carefully before using The
            Permit Renewal service website (“website”, "service") operated by the Richmond Centre
            for Disability ("us", 'we", "our").`}
          </Text>
          <Section title={`Conditions of use`}>
            {`By using this website, you certify that you have read and reviewed this Agreement and
            that you agree to comply with its terms. If you do not want to be bound by the terms of
            this Agreement, you are advised to leave the website accordingly. Richmond Centre for
            Disability (RCD) only grants use and access of this website, its products, and its
            services to those who have accepted its terms.`}
          </Section>
          <Section title={`Privacy policy`}>
            <Text as="p" textStyle="body-regular" textAlign="left">
              Before you continue using RCD Parking Permit Self-service portal, we advise you to
              read our{' '}
              <Link href="/privacy-policy">
                <ChakraLink color="primary">privacy policy</ChakraLink>
              </Link>{' '}
              regarding our user data collection. It will help you better understand our practices.
            </Text>
          </Section>
          <Section title={`User information`}>
            {`As a user of this website, you may be asked to provide private information. You are
            responsible for ensuring the accuracy of this information, and you are responsible for
            maintaining the safety and security of your identifying information. You are also
            responsible for all activities that occur under your login.`}
            {`If you think there are any
            possible issues regarding the security of your private information on the website,
            inform us immediately so we may address it accordingly. We reserve all rights to
            terminate accounts, edit or remove content and cancel orders in their sole discretion.`}
          </Section>
          <Section title={`Applicable law`}>
            {`By visiting this website, you agree that the laws of British Columbia province, without
            regard to principles of conflict laws, will govern these terms and conditions, or any
            dispute of any sort that might come between Richmond Centre for Disability and you, or
            its business partners and associates.`}
          </Section>
          <Section title={`Disputes`}>
            {`Any dispute related in any way to your visit to this website from us shall be arbitrated
            by British Columbia province court and you consent to exclusive jurisdiction and venue
            of such courts.`}
          </Section>
          <Section title={`Indemnification`}>
            {`You agree to indemnify RCD and its affiliates and hold RCD harmless against legal claims
            and demands that may arise from your use or misuse of our services. We reserve the right
            to select our own legal counsel.`}
          </Section>
          <Section title={`Limitation on liability`}>
            {`RCD is not liable for any damages that may occur to you as a result of your misuse of
            our website. RCD reserves the right to edit, modify, and change this Agreement any time.
            We shall let our users know of these changes through electronic mail. This Agreement is
            an understanding between RCD and the user, and this supersedes and replaces all prior
            agreements regarding the use of this website.`}
          </Section>
        </VStack>
      </GridItem>
    </Layout>
  );
};

const Section: FC<{ title: string; children: ReactNode }> = props => {
  const { title, children } = props;

  return (
    <VStack align="flex-start" spacing="0">
      <Text textStyle="body-bold" textAlign="left">
        {title}
      </Text>
      {Children.count(children) === 1 ? (
        typeof children === 'string' ? (
          <Text as="p" textStyle="body-regular" textAlign="left">
            {children}
          </Text>
        ) : (
          children
        )
      ) : (
        <VStack align="flex-start" spacing="24px">
          {Children.map(children, (paragraph, i) => (
            <Text key={`paragraph-${i}`} as="p" textStyle="body-regular" textAlign="left">
              {paragraph}
            </Text>
          ))}
        </VStack>
      )}
    </VStack>
  );
};

export default TermsAndConditions;
