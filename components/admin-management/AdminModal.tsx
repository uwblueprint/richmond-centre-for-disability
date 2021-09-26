import { SyntheticEvent, useState, useEffect } from 'react'; // React
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  Box,
  Stack,
  Input,
  FormControl,
  FormLabel,
  Select,
} from '@chakra-ui/react'; // Chakra UI
import { Employee, Role } from '@lib/graphql/types'; // GraphQL types

//Props
type AdminModalProps = {
  readonly isOpen: boolean;
  readonly title: string;
  readonly admin?: Omit<Employee, 'id' | 'active'>;
  readonly onClose: () => void;
  readonly onSave: (user: Omit<Employee, 'id' | 'active'>) => void;
};

/**
 * Admin modal
 */
export default function AdminModal({ isOpen, title, admin, onClose, onSave }: AdminModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>();

  useEffect(() => {
    if (admin) {
      setFirstName(admin.firstName);
      setLastName(admin.lastName);
      setEmail(admin.email);
      setRole(admin.role);
    }
  }, [admin]);

  // Close modal handler
  const handleClose = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setRole(undefined);
    onClose();
  };

  // Saves and closes modal after submit button pressed
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    if (firstName && lastName && email && role) {
      onSave({
        firstName,
        lastName,
        email,
        role,
      });
    }
    setFirstName('');
    setLastName('');
    setEmail('');
    setRole(undefined);
    onClose();
  };

  return (
    <Modal
      isCentered={true}
      isOpen={isOpen}
      onClose={handleClose}
      size="3xl"
      scrollBehavior="inside"
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <form onSubmit={handleSubmit}>
        <ModalContent paddingX="20px">
          <ModalHeader paddingTop="24px" paddingBottom="12px">
            <Text textStyle="display-medium-bold">{title}</Text>
          </ModalHeader>
          <ModalBody paddingY="20px">
            <Box paddingBottom="32px">
              <Stack direction="row" spacing="20px">
                <FormControl isRequired>
                  <FormLabel>{'First name'}</FormLabel>
                  <Input
                    placeholder="First name"
                    value={firstName}
                    onChange={event => setFirstName(event.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>{'Last name'}</FormLabel>
                  <Input
                    placeholder="Last name"
                    value={lastName}
                    onChange={event => setLastName(event.target.value)}
                  />
                </FormControl>
              </Stack>
            </Box>
            <Box>
              <Stack direction="row" spacing="20px">
                <FormControl isRequired>
                  <FormLabel>{'Email address'}</FormLabel>
                  <Input
                    placeholder="employee@rcd.org"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>{'Role'}</FormLabel>
                  <Select value={role} onChange={event => setRole(event.target.value as Role)}>
                    <option value={undefined} disabled selected>
                      None selected
                    </option>
                    <option value={Role.Secretary}>Front Desk</option>
                    <option value={Role.Accounting}>Accountant</option>
                    <option value={Role.Admin}>Admin</option>
                  </Select>
                </FormControl>
              </Stack>
            </Box>
          </ModalBody>
          <ModalFooter paddingBottom="24px">
            <Button colorScheme="gray" variant="solid" onClick={handleClose}>
              {'Cancel'}
            </Button>
            <Button variant="solid" type="submit" ml={'12px'}>
              {'Save'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
