import { GridItem, Flex, Text, Spacer, GridItemProps, Button } from '@chakra-ui/react'; // Chakra UI
import { MouseEventHandler, ReactNode } from 'react'; // React

type PermitHolderInfoCardProps = GridItemProps & {
  children: ReactNode;
  header: ReactNode;
  updated?: boolean;
  onEdit?: MouseEventHandler;
};

/**
 * Custom Card component with styling.
 * @param props - Props
 * @returns custom Card.
 */
export default function PermitHolderInfoCard(props: PermitHolderInfoCardProps) {
  const { children, header, updated, onEdit } = props;
  return (
    <GridItem
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      padding="20px 24px 24px"
      background="white"
      border="1px solid"
      borderColor="border.secondary"
      boxSizing="border-box"
      borderRadius="8px"
      {...props}
    >
      <Flex w="100%" justifyContent="flex-start" alignItems="center">
        {typeof header == 'string' ? (
          <Text as="h5" textStyle="display-small-semibold">
            {header}
          </Text>
        ) : (
          <>{header}</>
        )}
        {updated && (
          <Text textStyle="caption" opacity="0.5" ml="12px">
            updated
          </Text>
        )}
        <Spacer />
        {onEdit && (
          <Button color="primary" variant="ghost" textDecoration="underline" onClick={onEdit}>
            <Text textStyle="body-bold">Edit</Text>
          </Button>
        )}
      </Flex>
      {children}
    </GridItem>
  );
}
