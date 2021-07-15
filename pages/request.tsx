import PersonalInformationCard from '@components/requests/PersonalInformationCard';
import DoctorInformationCard from '@components/requests/DoctorInformationCard';
import ReasonForReplacementCard from '@components/requests/ReasonForReplacementCard';
// import PaymentInformationCard from '@components/requests/PaymentInformationCard';
import { GridItem, Box, Flex, Grid, SimpleGrid } from '@chakra-ui/react'; // Chakra UI

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

  // const payment_info = {
  //   permitFee: 26,
  //   dontation: 20,
  //   address: '123 waterloo street',
  // };

  const replacement_info = {
    cause: 'Stolen',
    timestamp: 'November 5, 1994, 8:15 pm',
    locationLost: 'Library',
    description:
      'I was biking and 2 monkeys and a goose suddenly attacked me, I was held at banana point. I had to give in as the goose and monkeys started to hiss at me T_T',
  };

  return (
    <Box w="100%" justifyContent="center">
      <Flex flexDirection="column">
        <Flex flexGrow={1} width="100%">
          <Grid
            flexGrow={1}
            width="100%"
            marginX="300px"
            marginY="32px"
            maxWidth={{ xl: '1200px' }}
            templateColumns="repeat(14, 1fr)"
            gap={12}
          >
            <GridItem colSpan={3} colStart={1} mt="28px">
              <PersonalInformationCard {...info} />
            </GridItem>
            <GridItem colSpan={5} colStart={7} mt="28px">
              <SimpleGrid columns={1} spacingY="18px">
                <DoctorInformationCard {...doc_info} />
                <ReasonForReplacementCard {...replacement_info} />
                {/* <PaymentInformationCard {...payment_info} /> */}
              </SimpleGrid>
            </GridItem>
          </Grid>
        </Flex>
      </Flex>
    </Box>
  );
}
