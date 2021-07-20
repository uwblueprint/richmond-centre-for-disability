import { GridItem, Flex, Text, Link, Spacer, GridItemProps } from '@chakra-ui/react'; // Chakra UI
import { MouseEventHandler, ReactNode } from 'react'; // React

type PermitHolderInfoCardProps = GridItemProps & {
  children: ReactNode;
  header: ReactNode;
  updated?: boolean;
  handleEdit: MouseEventHandler;
};

/**
 * Custom Card component with styling.
 * @param props - Props
 * @returns custom Card.
 */
export default function PermitHolderInfoCard(props: PermitHolderInfoCardProps) {
  const { children, header, updated, handleEdit } = props;
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
        <Link textStyle="body-bold" color="primary" textDecoration="underline" onClick={handleEdit}>
          Edit
        </Link>
      </Flex>
      {children}
    </GridItem>
  );
}
