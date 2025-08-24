import { HStack, Text, IconButton, Input } from '@chakra-ui/react'; // Chakra UI
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import { useEffect, useState } from 'react';

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

  const [inputValue, setInputValue] = useState<string | number>(pageNumber + 1); // Display page number as 1-based index

  useEffect(() => {
    setInputValue(pageNumber + 1);
  }, [pageNumber]);

  /**
   * Go to the next page if possible, and invoke callback if defined
   * `pageNumber + 1` moves to the next page (zero-based index)
   * `pageNumber + 2` updates the input field to reflect the 1-based page number
   */
  const goToNextPage = () => {
    if (!isLastPage) {
      onPageChange(pageNumber + 1);
      setInputValue(pageNumber + 2);
    }
  };

  /**
   * Go to the previous page if possible, and invoke callback if defined
   * `pageNumber - 1` moves to the previous page (zero-based index)
   * `pageNumber` updates the input field to reflect the 1-based page number
   */
  const goToPreviousPage = () => {
    if (!isFirstPage) {
      onPageChange(pageNumber - 1);
      setInputValue(pageNumber);
    }
  };

  /**
   * Handle direct page number input
   */
  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setInputValue(value); // Allow empty string for cleared input
    } else {
      const numericValue = Number(value);
      if (!isNaN(numericValue) && numericValue > 0 && numericValue <= totalPages) {
        setInputValue(numericValue);
      }
    }
  };

  /**
   * Navigate to the page number entered in the input field
   * Convert the 1-based user input into zero-based index
   */
  const goToPage = () => {
    const targetPage = Number(inputValue) - 1;
    if (!isNaN(targetPage) && targetPage >= 0 && targetPage < totalPages) {
      onPageChange(targetPage);
    } else {
      setInputValue(pageNumber + 1); // Reset input to the current page if invalid
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
        <Text as="p" textStyle="xsmall" display="inline">
          {totalCount !== 0 ? `${lowerBound}-${upperBound}` : 0}
        </Text>
        <Text as="p" textStyle="xsmall" display="inline" color="texticon.secondary">
          {`of ${totalCount}`}
        </Text>
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
        <Input
          value={inputValue}
          width="50px"
          height="24px"
          textAlign="center"
          onChange={handlePageInput}
          onBlur={goToPage}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              goToPage();
            }
          }}
        />
        <Text as="p" textStyle="xsmall" display="inline" marginX="4px">
          {` / ${totalPages}`}
        </Text>
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
