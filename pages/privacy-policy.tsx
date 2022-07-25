import Layout from '@components/applicant/Layout';
import { NextPage } from 'next';
import { GridItem, ListItem, Text, UnorderedList, VStack } from '@chakra-ui/react';

const PrivacyPolicy: NextPage = () => {
  return (
    <Layout>
      <GridItem colSpan={12} colStart={1} marginBottom="120px">
        <VStack align="flex-start" spacing="24px" textAlign="left">
          <Text as="h1" textStyle="display-large">
            Personal Information Protection Policy
          </Text>
          {/* Intro section */}
          <VStack align="flex-start" spacing="24px">
            <Text as="p" textStyle="body-regular">
              At Richmond Centre for Disability (RCD), we are committed to providing our members and
              service recipients (users) with exceptional service. As providing this service
              involves the collection, use and disclosure of some personal information about our
              users and members, protecting their personal information is one of our highest
              priorities.
            </Text>
            <Text as="p" textStyle="body-regular">
              While we have always respected our users and members privacy and safeguarded their
              personal information, we have strengthened our commitment to protecting personal
              information as a result of British Columbia’s Personal Information Protection Act
              (PIPA). PIPA, which came into effect on January 1, 2004, sets out the ground rules for
              how B.C. businesses and not-for-profit organizations may collect, use, and disclose
              personal information.
            </Text>
            <Text as="p" textStyle="body-regular">
              We will inform our users and members of why and how we collect, use, and disclose
              their personal information, obtain their consent where required, and only handle their
              personal information in a manner that a reasonable person would consider appropriate
              in the circumstances.
            </Text>
            <Text as="p" textStyle="body-regular">
              This Personal Information Protection Policy, in compliance with PIPA, outlines the
              principles and practices we will follow in protecting users’ and members’ personal
              information. Our privacy commitment includes ensuring the accuracy, confidentiality,
              and security of our users’ and members’ personal information and allowing our users
              and members to request access to, and correction of, their personal information.
            </Text>
          </VStack>
          {/* Scope of policy */}
          <VStack align="flex-start" spacing="24px">
            <Text as="h2" textStyle="body-bold">
              Scope of this Policy
            </Text>
            <Text as="p" textStyle="body-regular">
              This policy also applies to any service providers collecting, using, or disclosing
              personal information on behalf of RCD.
            </Text>
          </VStack>
          {/* Definitions */}
          <VStack align="flex-start" spacing="24px">
            <Text as="h2" textStyle="body-bold">
              Definitions
            </Text>
            <Text as="p" textStyle="body-regular">
              <b>
                <i>Personal Information</i>
              </b>{' '}
              – means information about an identifiable individual{' '}
              <i>
                including name, date of birth, home address, phone number, email address, gender,
                medical information, and credit history
              </i>
              .
            </Text>
          </VStack>
          {/* Policy 1 */}
          <VStack align="flex-start" spacing="24px">
            <Text as="h2" textStyle="body-bold">
              Policy 1 – Collecting Personal Information
            </Text>
            <VStack align="flex-start" spacing="0">
              <Text as="p" textStyle="body-regular">
                1.1 Unless the purposes for collecting personal information are obvious and the user
                and member voluntarily provides his or her personal information for those purposes,
                we will communicate the purposes for which personal information is being collected,
                either orally or in writing, before or at the time of collection.
              </Text>
              <Text as="p" textStyle="body-regular">
                1.2 We will only collect user and member information that is necessary to fulfill
                the following purposes:
                <UnorderedList>
                  <ListItem>To verify identity;</ListItem>
                  <ListItem>To deliver requested products and services;</ListItem>
                  <ListItem>To enrol the individual in a program;</ListItem>
                  <ListItem>To send out association membership information;</ListItem>
                  <ListItem>To contact for fundraising;</ListItem>
                  <ListItem>To ensure a high standard of service;</ListItem>
                  <ListItem>To meet regulatory requirements;</ListItem>
                  <ListItem>To collect and process payments.</ListItem>
                </UnorderedList>
              </Text>
            </VStack>
          </VStack>
          {/* Policy 2 */}
          <VStack align="flex-start" spacing="24px">
            <Text as="h2" textStyle="body-bold">
              Policy 2 – Consent
            </Text>
            <VStack align="flex-start" spacing="0">
              <Text as="p" textStyle="body-regular">
                2.1 We will obtain user and member consent to collect, use or disclose personal
                information (except where, as noted below, we are authorized to do so without
                consent).
              </Text>
              <Text as="p" textStyle="body-regular">
                2.2 Consent can be provided orally, in writing, electronically, through an
                authorized representative or it can be implied where the purpose for collecting
                using or disclosing the personal information would be considered obvious and the
                user and member voluntarily provides personal information for that purpose.
              </Text>
              <Text as="p" textStyle="body-regular">
                2.3 Consent may also be implied where a user and member is given notice and a
                reasonable opportunity to opt-out of his or her personal information being used for
                mail-outs, the marketing of new services or products, fundraising and the user and
                member does not opt-out.
              </Text>
              <Text as="p" textStyle="body-regular">
                2.4 Subject to certain exceptions (e.g., the personal information is necessary to
                provide the service or product, or the withdrawal of consent would frustrate the
                performance of a legal obligation), users and members can withhold or withdraw their
                consent for RCD to use their personal information in certain ways. A user’s,
                customer’s, member’s decision to withhold or withdraw their consent to certain uses
                of personal information may restrict our ability to provide a particular service or
                product. If so, we will explain the situation to assist the user and member in
                making the decision.
              </Text>
              <Text as="p" textStyle="body-regular">
                2.5 We may collect, use or disclose personal information without the user’s,
                customer’s, member’s knowledge or consent in the following limited circumstances:
                <UnorderedList>
                  <ListItem>
                    When the collection, use or disclosure of personal information is permitted or
                    required by law;
                  </ListItem>
                  <ListItem>
                    In an emergency that threatens an individual&apos;s life, health, or personal
                    security;
                  </ListItem>
                  <ListItem>
                    When the personal information is available from a public source (e.g., a
                    telephone directory);
                  </ListItem>
                  <ListItem>When we require legal advice from a lawyer;</ListItem>
                  <ListItem>
                    For the purposes of collecting a debt; • To protect ourselves from fraud;
                  </ListItem>
                  <ListItem>
                    To investigate an anticipated breach of an agreement or a contravention of law.
                  </ListItem>
                </UnorderedList>
              </Text>
            </VStack>
          </VStack>
          {/* Policy 3 */}
          <VStack align="flex-start" spacing="24px">
            <Text as="h2" textStyle="body-bold">
              Policy 3 – Using and Disclosing Personal Information
            </Text>
            <VStack align="flex-start" spacing="0">
              <Text as="p" textStyle="body-regular">
                3.1 We will only use or disclose user and member personal information where
                necessary to fulfill the purposes identified at the time of collection:
                <UnorderedList>
                  <ListItem>
                    To conduct user and member surveys in order to enhance the provision of our
                    services;
                  </ListItem>
                  <ListItem>
                    To contact our users and members directly about products and services that may
                    be of interest;
                  </ListItem>
                </UnorderedList>
              </Text>
              <Text as="p" textStyle="body-regular">
                3.2 We will not use or disclose user and member personal information for any
                additional purpose unless we obtain consent to do so.
              </Text>
              <Text as="p" textStyle="body-regular">
                3.3 We will not sell user and member lists or personal information to other parties.
              </Text>
            </VStack>
          </VStack>
          {/* Policy 4 */}
          <VStack align="flex-start" spacing="24px">
            <Text as="h2" textStyle="body-bold">
              Policy 4 – Retaining Personal Information
            </Text>
            <VStack align="flex-start" spacing="0">
              <Text as="p" textStyle="body-regular">
                4.1 If we use user and member personal information to make a decision that directly
                affects the user and member, we will retain that personal information for at least
                one year so that the user and member has a reasonable opportunity to request access
                to it.
              </Text>
              <Text as="p" textStyle="body-regular">
                4.2 Subject to policy 4.1, we will retain user and member personal information only
                as long as necessary to fulfill the identified purposes or a legal or business
                purpose.
              </Text>
            </VStack>
          </VStack>
          {/* Policy 5 */}
          <VStack align="flex-start" spacing="24px">
            <Text as="h2" textStyle="body-bold">
              Policy 5 – Ensuring Accuracy of Personal Information
            </Text>
            <VStack align="flex-start" spacing="0">
              <Text as="p" textStyle="body-regular">
                5.1 We will make reasonable efforts to ensure that user and member personal
                information is accurate and complete where it may be used to make a decision about
                the user and member or disclosed to another organization.
              </Text>
              <Text as="p" textStyle="body-regular">
                5.2 Users and members may request correction to their personal information in order
                to ensure its accuracy and completeness. A request to correct personal information
                must be made in writing and provide sufficient detail to identify the personal
                information and the correction being sought.
              </Text>
              <Text as="p" textStyle="body-regular">
                5.3 If the personal information is demonstrated to be inaccurate or incomplete, we
                will correct the information as required and send the corrected information to any
                organization to which we disclosed the personal information in the previous year. If
                the correction is not made, we will note the users’ and members’ correction request
                in the file.
              </Text>
            </VStack>
          </VStack>
          {/* Policy 6 */}
          <VStack align="flex-start" spacing="24px">
            <Text as="h2" textStyle="body-bold">
              Policy 6 – Securing Personal Information
            </Text>
            <VStack align="flex-start" spacing="0">
              <Text as="p" textStyle="body-regular">
                6.1 We are committed to ensuring the security of user and member personal
                information in order to protect it from unauthorized access, collection, use,
                disclosure, copying, modification or disposal or similar risks.
              </Text>
              <Text as="p" textStyle="body-regular">
                6.2 The following security measures will be followed to ensure that user and member
                personal information is appropriately protected: the use of locked filing cabinets;
                the use of user IDs, passwords, encryption, firewalls; restricting employee access
                to personal information as appropriate.
              </Text>
              <Text as="p" textStyle="body-regular">
                6.3 We will use appropriate security measures when destroying user’s, customer’s,
                member’s personal information such as: shredding documents, deleting electronically
                stored information.
              </Text>
              <Text as="p" textStyle="body-regular">
                6.4 We will continually review and update our security policies and controls as
                technology changes to ensure ongoing personal information security.
              </Text>
            </VStack>
          </VStack>
          {/* Policy 7 */}
          <VStack align="flex-start" spacing="24px">
            <Text as="h2" textStyle="body-bold">
              Policy 7 – Providing Users and members Access to Personal Information
            </Text>
            <VStack align="flex-start" spacing="0">
              <Text as="p" textStyle="body-regular">
                7.1 Users and members have a right to access their personal information, subject to
                limited exceptions.
              </Text>
              <Text as="p" textStyle="body-regular">
                7.2 A request to access personal information must be made in writing and provide
                sufficient detail to identify the personal information being sought.
              </Text>
              <Text as="p" textStyle="body-regular">
                7.3 Upon request, we will also tell users and members how we use their personal
                information and to whom it has been disclosed if applicable.
              </Text>
              <Text as="p" textStyle="body-regular">
                7.4 We will make the requested information available within 30 business days, or
                provide written notice of an extension where additional time is required to fulfill
                the request.
              </Text>
              <Text as="p" textStyle="body-regular">
                7.5 A minimal fee may be charged for providing access to personal information. Where
                a fee may apply, we will inform the user and member of the cost and request further
                direction from the user and member on whether or not we should proceed with the
                request.
              </Text>
              <Text as="p" textStyle="body-regular">
                7.6 If a request is refused in full or in part, we will notify the user and member
                in writing, providing the reasons for refusal and the recourse available to the user
                and member.
              </Text>
            </VStack>
          </VStack>
          {/* Policy 8 */}
          <VStack align="flex-start" spacing="24px">
            <Text as="h2" textStyle="body-bold">
              Policy 8 – Questions and Complaints: RCD Executive Director
            </Text>
            <VStack align="flex-start" spacing="0">
              <Text as="p" textStyle="body-regular">
                8.1 The RCD Executive Director is responsible for ensuring RCD’s compliance with
                this policy and the Personal Information Protection Act.
              </Text>
              <Text as="p" textStyle="body-regular">
                8.2 Users and members should direct any complaints, concerns or questions regarding
                RCD’s compliance in writing to RCD Executive Director.
              </Text>
              <VStack align="flex-start" spacing="0">
                <Text as="p" textStyle="body-regular">
                  Contact information for RCD Executive Director:
                </Text>
                <Text as="p" textStyle="body-regular">
                  Ella Huang
                </Text>
                <Text as="p" textStyle="body-regular">
                  Executive Director
                </Text>
                <Text as="p" textStyle="body-regular">
                  Email: ella@rcdrichmond.org RCD
                </Text>
                <Text as="p" textStyle="body-regular">
                  General Enquiry Email: rcd@rcdrichmond.org
                </Text>
              </VStack>
            </VStack>
          </VStack>
        </VStack>
      </GridItem>
    </Layout>
  );
};

export default PrivacyPolicy;
