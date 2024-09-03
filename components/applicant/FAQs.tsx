import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Link,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

const NewTabLink: FC<{ href: string }> = ({ href, children }) => {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" color="primary">
      {children}
    </Link>
  );
};

const OVERVIEW_FAQs: ReadonlyArray<{ question: string; answer: ReactNode | string }> = [
  {
    question: 'What is the Accessible Parking Permit Program?',
    answer: (
      <>
        <p>
          Accessible parking is governed by the Motor Vehicle Act which defines a person with a
          disability as a person whose mobility is limited as a result of a permanent or temporary
          disability that makes it impossible or difficult to walk.
        </p>
        <p>
          Through the{' '}
          <NewTabLink href="https://www.rcdrichmond.org/Parking/ParkingPermit.php">
            RCD Accessible Parking Permit Program
          </NewTabLink>{' '}
          valid permit holders can park in a designated accessible parking space anywhere in B.C.,
          elsewhere in Canada or even outside of Canada.
        </p>
        <p>
          Under the Rules of Use of the Accessible Parking Permit Program in B.C. the permit has
          been designed to travel with the eligible permit holder and can be used in any vehicle.
          This means that someone with a mobility-related disability might benefit from having a
          permit even if they do not own a vehicle or no longer drive.
        </p>
        <p>
          To successfully use your permit, you must display your permit by hanging it from your
          rear-view mirror. You will also be issued a wallet card which you must carry with you to
          confirm that you are the valid permit holder.
        </p>
      </>
    ),
  },
  {
    question: 'How do I apply for a parking permit?',
    answer: (
      <>
        <p>
          If you have mobility limitations and wish to apply for a parking permit, you must obtain a
          parking permit application form from the RCD website or request one be mailed to you. We
          require a certification from a medical professional with a valid MSP number on the
          application form.
        </p>
        <p>
          Please complete the form in its entirety. Once complete, you can mail it to us, or scan
          the form and email it to us at{' '}
          <NewTabLink href="mailto:parkingpermits@rcdrichmond.org">
            parkingpermits@rcdrichmond.org
          </NewTabLink>
          , or fax to our office at 604-232-2415.
        </p>
      </>
    ),
  },
  {
    question: 'Who is eligible for an Accessible Parking Permit?',
    answer: (
      <>
        <p>
          The permit will be issued based on a physician’s recommendation and is available to anyone
          with a permanent or temporary mobility limitation provided they meet one (1) or more of
          the following conditions:
        </p>
        <UnorderedList>
          <ListItem>
            The applicant cannot walk any distance without assistance of another person or a
            mobility aid
          </ListItem>
          <ListItem>The applicant cannot walk 100 metres without risk to health</ListItem>
          <ListItem>
            The applicant has a disability that affects mobility, and the ability to walk
            specifically
          </ListItem>
        </UnorderedList>
        <p>
          Individuals who are blind, or in cases where safety is a consideration, may also be
          considered as eligible.
        </p>
      </>
    ),
  },
  {
    question: 'If I qualify for a parking permit, will I have to reapply?',
    answer: (
      <>
        <p>There are two types of parking permits for people with disabilities:</p>
        <p>
          Permanent permits are valid for three (3) years at which time you can renew your permit
          for an additional three years. Permit renewals for permanent permits can be renewed
          online.
        </p>
        <p>
          Temporary permits are valid for a period of one month to one year. Upon expiration, you
          may reapply with a new application form signed by a medical professional for a new permit.
        </p>
      </>
    ),
  },
  {
    question: 'How long is my parking permit good for?',
    answer: (
      <>
        <p>There are two types of parking permits for people with disabilities:</p>
        <p>Permanent Parking Permit: Valid for a period of three years, and renewable.</p>
        <p>
          Temporary Parking Permit: Valid for a period of one month to twelve months, and not
          renewable. If you require an extension of your temporary parking permit, you must reapply.
        </p>
      </>
    ),
  },
  {
    question: 'My parking permit is about to expire. How do I renew it?',
    answer: (
      <>
        <p>
          RCD will send you a Renewal Form approximately one (1) month before your permit is set to
          expire. This is applicable to all permanent permit holders. Once you receive your renewal
          notice you can renew your permit online, over the phone or by mailing in your completed
          renewal form. There is a processing fee to renew your permit (fee is $31 as at August
          2023). As well, we ask that you also return your expired permit.
        </p>
        <p>
          Use the RCD Accessible Parking Permit Online Portal (online portal) to update your contact
          information or renew your permit.
        </p>
        <p>
          You can now renew your permanent parking permit online.{' '}
          <NewTabLink href="https://www.rcdrichmond.org/Parking/ParkingPermit.php">
            Click here
          </NewTabLink>{' '}
          for more information on how to renew online.
        </p>
      </>
    ),
  },
  {
    question: 'My permit has expired, what do I do?',
    answer: (
      <>
        <p>
          If your accessible parking permit has expired, it is no longer valid. Please contact us at
          604-232-2404 to discuss the best way to renew your permit. Permanent permit holder may
          renew within 24 months after expiration. Beyond 24 months a new application with proper
          certification is required, including applicants who had a permit more than 2 years ago.
        </p>
        <p>
          Temporary parking permit holders must see your doctor and submit a new application form if
          an accessible parking permit is deemed needed by medical professionals.
        </p>
      </>
    ),
  },
  {
    question: 'What happens if I continue to use an expired permit?',
    answer: (
      <>
        <p>
          Your parking permit has a registration number that is unique to you. It also has an expiry
          date that shows the month and year that your permit will expire. If you continue to use an
          expired permit, you are at risk of a fine and/or in some instances it is possible that
          your vehicle could even be towed. All such cost incurred will be your own responsibility.
          For permanent permit holders, we will send you one (1) renewal form a month ahead that
          your permit is up for renewal.
        </p>
      </>
    ),
  },
  {
    question: 'What happens if I have lost my parking permit?',
    answer: (
      <>
        <p>
          If you have lost your parking permit, please notify us right away. If you would like to
          request a replacement process, please complete the Replacement Declaration Form and we
          will issue a replacement permit. However, there will be a processing fee (fee is $31 as at
          August 2023). As well you are required to complete a declaration form that attests that in
          event that you find the lost permit you will return it to our office as the permit is no
          longer valid. Any permit holder using a permit that has been reported lost is at risk of a
          ticket or even towing of vehicle as this permit is no longer valid.{' '}
          <NewTabLink href="https://www.rcdrichmond.org/Parking/Permit_Replacement_Declaration_Form_Fillable_2024v.pdf">
            Click here
          </NewTabLink>{' '}
          to download the Replacement Declaration Form.
        </p>
      </>
    ),
  },
  {
    question: 'What happens if my parking permit was stolen?',
    answer: (
      <>
        <p>
          If your permit has been stolen, please notify us right away. You must also contact the
          police to report the theft. The police will ask you for your permit number and Personal
          Identification Number. These can be found on your wallet card.
        </p>
        <p>
          The police will also give you an incident or case number to include with your request for
          a Replacement Permit.{' '}
          <NewTabLink href="https://www.rcdrichmond.org/Parking/Permit_Replacement_Declaration_Form_Fillable_2024v.pdf">
            Click here
          </NewTabLink>{' '}
          to download the Replacement Declaration Form.
        </p>
      </>
    ),
  },
  {
    question: "What should I do if I find someone's parking permit?",
    answer: (
      <>
        <p>
          All found parking permits should be returned to the official issuing agency. The mailing
          address is located on the back of the Parking Permit. If you require further information,
          please do not hesitate to give us a call at 604-232-2404.
        </p>
      </>
    ),
  },
  {
    question: 'Does having a parking permit mean I am a member of RCD?',
    answer: (
      <>
        <p>
          Having a RCD Accessible Parking Permit is a service that we provide for eligible people
          with disabilities in B.C. Having a parking permit does not automatically make you a member
          of the RCD. However, many of our parking permit holders have indicated that they would
          like to join RCD and become a member as a way of continuing to help to keep the Accessible
          Parking Permit Program strong and to support our work with people and communities with
          disabilities across British Columbia.
        </p>
      </>
    ),
  },
  {
    question: 'How can I donate to RCD?',
    answer: (
      <>
        <p>
          It’s easy. You will find everything you need to know about donating to RCD in the Join and
          Donate pages on this website.
        </p>
      </>
    ),
  },
];

const TRAVELLING_FAQs: ReadonlyArray<{ question: string; answer: ReactNode | string }> = [
  {
    question: 'Visiting British Columbia and in need of a parking permit?',
    answer: (
      <>
        <p>
          If you are visiting British Columbia and have a valid parking permit in your home country,
          agreements are in place to ensure that you may enjoy the same rights and privileges here
          as you do in your home country. Please contact us to let us know about the details of your
          trip and we can help by issuing a temporary permit that is recognized in B.C. To obtain a
          temporary permit, you will need to present official documentation from the issuing agency
          in your country. This information is needed to help to confirm that you are a valid
          accessible parking permit holder in your home jurisdiction. There is a Canadian processing
          fee for any permit issued (fee is $31 as at August 2023).
        </p>
      </>
    ),
  },
  {
    question: 'Accessible Parking Permits for Existing Valid Permit Holders Who Ride Motorcycle',
    answer: (
      <>
        <p>
          Working in partnership with the Provincial Accessibility Secretariat, ICBC, and the
          Ministry of Transportation, RCD has also created a parking permit for existing valid
          permit holders who ride a motorcycle. This permit is in the form of a decal which can be
          affixed to the windscreen or to the front of your motorcycle. This permit will be updated
          every year upon request (at no cost) and is available to all current valid permit holders
          who ride a motorcycle.
        </p>
      </>
    ),
  },
  {
    question: 'Your processing fees',
    answer: (
      <>
        <p>
          Every year RCD receives more than 8,000 calls and process more than 3,000 permits. Your
          processing fee helps to cover the cost of delivering the program and helps to keep the
          Accessible Parking Permit Program strong. It is also worth noting that we deliver this
          valuable community service across British Columbia without any funding from government. It
          is all done through the processing fee that you pay as well as any donations that you
          make. As well, we have an established policy that hardship assistance is available upon
          request to anyone who does not have the economic resources to cover the cost of the
          processing fee. Processing fee is $31 as at August 2023.
        </p>
      </>
    ),
  },
  {
    question: 'Contact Us',
    answer: (
      <>
        <p>
          Should you require more information regarding the Accessible Parking Permit Program or any
          of the programs and services that we provide, please do not hesitate to call our staff at
          604-232-2404 and we are more than happy to help.
        </p>
        <p>
          <NewTabLink href="https://rcdrichmond.org/ContactUs/ContactUs.php">Click here</NewTabLink>{' '}
          for details on our location, directions on best ways to find us and our hours of
          operation.
        </p>
      </>
    ),
  },
];

const FAQs: FC = () => {
  return (
    <VStack align="stretch" spacing={{ sm: '32px', md: '24px' }} mt={{ sm: '32px', md: '24px' }}>
      <VStack align="flex-start">
        <Text as="h2" textStyle="display-small-semibold">
          Overview of the parking permit program
        </Text>
        <Accordion allowMultiple alignSelf="stretch">
          {OVERVIEW_FAQs.map(({ question, answer }, i) => (
            <AccordionItem key={`question-${i}`}>
              <h2>
                <AccordionButton>
                  <Box as="h3" flex="1" textAlign="left" textStyle="body-regular">
                    {question}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel as="p" pb={4} textAlign="left">
                <VStack align="flex-start" spacing="8px">
                  {answer}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </VStack>
      <VStack align="flex-start">
        <Text as="h2" textStyle="display-small-semibold">
          Travelling with your BC parking permit
        </Text>
        <Accordion allowMultiple alignSelf="stretch">
          {TRAVELLING_FAQs.map(({ question, answer }, i) => (
            <AccordionItem key={`question-${i}`}>
              <h2>
                <AccordionButton>
                  <Box as="h3" flex="1" textAlign="left" textStyle="body-regular">
                    {question}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel as="p" pb={4} textAlign="left">
                <VStack align="flex-start" spacing="8px">
                  {answer}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </VStack>
    </VStack>
  );
};

export default FAQs;
