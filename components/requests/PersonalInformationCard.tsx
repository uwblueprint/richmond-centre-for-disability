import { Box } from '@chakra-ui/react';

type personalInformationProps = {
  readonly name: string;
  readonly userId: number;
  readonly email: string;
  readonly phoneNumber: string;
  readonly address: string;
};

export default function PersonalInformationCard(props: personalInformationProps) {
  return (
    //   <Container>
    //     <VStack>
    //       <Box w="521px" h='573px' bg="tomato">
    //           {/* ${{name, userId, email, phoneNumber, address}} */}
    //           {props.name}
    //           {props.email}
    //       </Box>
    //     </VStack>
    //   </Container>

    <Box w="521px" h="573px" bg="tomato" p="20px">
      {/* ${{name, userId, email, phoneNumber, address}} */}
      <Box bg="blue" border="1px" borderColor="gray.200">
        {props.phoneNumber}
      </Box>
      <Box border="1px" borderColor="gray.200">
        {props.name}
      </Box>
      <Box border="1px" borderColor="gray.200">
        {props.email}
      </Box>
    </Box>
  );
}

//maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden"
// const renderPersonalInformationCard = (info: personalInformationInfo) => {
//   <Box bg="tomato" w="100%" p={4} color="white">
//     This is the Box
//   </Box>
// }

// export function PersonalInformationCard({ info }: Props) {
//   return renderPersonalInformationCard
// }
