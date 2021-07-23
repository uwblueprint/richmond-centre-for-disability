import { useState } from 'react'; // useState
import { HStack, Text, IconButton } from '@chakra-ui/react'; // Chakra UI
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'; // Chakra UI Icons

type Props = {
  readonly initialPageNumber?: number; // 0-indexed initial page number, default 0
  readonly pageSize: number; // Number of items per page
  readonly totalCount: number; // Total number of items
  readonly onPageChange?: (pageNumber: number) => void; // Page change callback
};

/**
 * Pagination component for table pagination
 * @param props - props
 * @returns Pagination component that can be used with any table (server-side pagination)
 */
export default function Pagination(props: Props) {
  const { initialPageNumber = 0, pageSize, totalCount, onPageChange } = props;

  const [pageNumber, setPageNumber] = useState(initialPageNumber); // Current page number

  const totalPages = Math.ceil(totalCount / pageSize); // Total number of pages
  const isFirstPage = pageNumber === 0; // Whether current page is first page
  const isLastPage = pageNumber === totalPages - 1; // Whether current page is last page
  const lowerBound = pageNumber * pageSize + 1; // Lower bound of current page (item #)
  const upperBound = isLastPage ? totalCount : (pageNumber + 1) * pageSize; // Upper bound of current page (item #)

  /**
   * Go to the next page if possible, and invoke callback if defined
   */
  const goToNextPage = () => {
    if (!isLastPage) {
      if (onPageChange !== undefined) {
        onPageChange(pageNumber + 1);
      }
      setPageNumber(pageNumber + 1);
    }
  };

  /**
   * Go to the previous page if possible, and invoke callback if defined
   */
  const goToPreviousPage = () => {
    if (!isFirstPage) {
      if (onPageChange !== undefined) {
        onPageChange(pageNumber - 1);
      }
      setPageNumber(pageNumber - 1);
    }
  };

  return (
    <HStack height="32px" display="inline-flex" spacing="20px" verticalAlign="center">
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
          height="32px"
          fontSize="14px"
          variant="unstyled"
          aria-label="previous page"
          disabled={isFirstPage}
          onClick={goToPreviousPage}
        />
        <IconButton
          icon={<ChevronRightIcon />}
          height="32px"
          fontSize="14px"
          variant="unstyled"
          aria-label="next page"
          disabled={isLastPage}
          onClick={goToNextPage}
        />
      </HStack>
    </HStack>
  );
}
