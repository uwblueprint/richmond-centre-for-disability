import { HStack, Text, IconButton } from '@chakra-ui/react'; // Chakra UI
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'; // Chakra UI Icons

type Props = {
  readonly pageSize: number; // Number of items per page
  readonly totalCount: number; // Total number of items
  readonly pageNumber: number; // Current page number
  readonly onPageChange: (pageNumber: number) => void; // Page change callback
};

/**
 * Pagination component for table pagination
 * @param props - props
 * @returns Pagination component that can be used with any table (server-side pagination)
 */
export default function Pagination(props: Props) {
  const { pageSize, totalCount, pageNumber, onPageChange } = props;

  const totalPages = totalCount === 0 ? 1 : Math.ceil(totalCount / pageSize); // Total number of pages
  const isFirstPage = pageNumber === 0; // Whether current page is first page
  const isLastPage = pageNumber === totalPages - 1; // Whether current page is last page
  const lowerBound = totalCount === 0 ? 0 : pageNumber * pageSize + 1; // Lower bound of current page (item #)
  const upperBound = isLastPage ? totalCount : (pageNumber + 1) * pageSize; // Upper bound of current page (item #)

  /**
   * Go to the next page if possible, and invoke callback if defined
   */
  const goToNextPage = () => {
    if (!isLastPage) {
      onPageChange(pageNumber + 1);
    }
  };

  /**
   * Go to the previous page if possible, and invoke callback if defined
   */
  const goToPreviousPage = () => {
    if (!isFirstPage) {
      onPageChange(pageNumber - 1);
    }
  };

  return (
    <HStack
      height="24px"
      display="inline-flex"
      marginY="16px"
      spacing="20px"
      verticalAlign="center"
    >
      <HStack spacing="4px">
        <Text as="p" textStyle="xsmall" display="inline">{`${lowerBound}-${upperBound}`}</Text>
        <Text
          as="p"
          textStyle="xsmall"
          display="inline"
          color="texticon.secondary"
        >{`of ${totalCount}`}</Text>
      </HStack>
      <HStack spacing="0">
        <IconButton
          icon={<ChevronLeftIcon />}
          height="24px"
          size="sm"
          variant="unstyled"
          aria-label="previous page"
          disabled={isFirstPage}
          onClick={goToPreviousPage}
        />
        <IconButton
          icon={<ChevronRightIcon />}
          height="24px"
          size="sm"
          variant="unstyled"
          aria-label="next page"
          disabled={isLastPage}
          onClick={goToNextPage}
        />
      </HStack>
    </HStack>
  );
}
