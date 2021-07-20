import { Box, Text, Divider, SimpleGrid } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/internal/PermitHolderInfoCard'; // Custom Card Component
import { Physician } from '@lib/graphql/types'; // Physician type
import { MouseEventHandler } from 'react'; // React

type DoctorInformationProps = {
  physician: Physician;
  readonly handleEdit: MouseEventHandler;
  readonly isUpdated?: boolean;
};

export default function DoctorInformationCard(props: DoctorInformationProps) {
  const { physician, handleEdit, isUpdated } = props;
  return (
    <PermitHolderInfoCard
      colSpan={7}
      header={`Doctor's Information`}
      updated={isUpdated}
      handleEdit={handleEdit}
    >
      <Divider pt="20px" />
      <SimpleGrid columns={2} spacingX="20px" spacingY="12px" pt="20px">
        <InfoSection title={`Name`}>{`${physician.firstName} ${physician.lastName}`}</InfoSection>
        <InfoSection title={`MSP #`}>{String(physician.mspNumber)}</InfoSection>
        <InfoSection title={`Phone`}>{physician.phone}</InfoSection>
        <InfoSection title={`Address`}>
          {physician.addressLine1} {physician.addressLine2}
          {`${physician.city} ${physician.province}`}
          {`Canada`}
          {physician.postalCode}
        </InfoSection>
      </SimpleGrid>
    </PermitHolderInfoCard>
  );
}

type InfoSectionProps = {
  readonly title: string;
  readonly children: string | ReadonlyArray<string | null | undefined>;
};

function InfoSection({ title, children }: InfoSectionProps) {
  return (
    <>
      <Box w="200px" h="27px">
        <Text as="p" textStyle="body-regular">
          {title}
        </Text>
      </Box>
      <Box>
        {typeof children === 'string' ? (
          <Text as="p" textStyle="body-regular">
            {children}
          </Text>
        ) : (
          children.map(
            (paragraph, i) =>
              paragraph && (
                <Text as="p" key={`paragraph-${i}`} textStyle="body-regular">
                  {paragraph}
                </Text>
              )
          )
        )}
      </Box>
    </>
  );
}
