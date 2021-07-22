import { useEffect } from 'react'; // React
import { Box, Flex, Table as ChakraTable, Th, Td, Thead, Tbody, Tr } from '@chakra-ui/react'; // Chakra UI
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import { useTable, useSortBy, Column } from 'react-table'; // React Table
import { SortOptions } from '@tools/types'; // Sorting types
import { getSortOptions } from '@tools/components/internal/table'; // Get the sort options from the React Table sortBy state

// Table Props
type Props = {
  readonly columns: Array<Column<any>>; // Depends on shape of data
  readonly data: Array<any>; // Depends on shape of data
  readonly onChangeSortOrder?: (sort: SortOptions) => unknown; // Callback after changing sorting
};

export default function Table(props: Props) {
  const { columns, data, onChangeSortOrder } = props;

  // Table rendering functions
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
  } = useTable(
    {
      columns,
      data,
      manualSortBy: true,
    },
    useSortBy
  );

  // Call onChangeSortOrder function when sorting changes
  useEffect(() => {
    if (onChangeSortOrder !== undefined) {
      onChangeSortOrder(getSortOptions(sortBy));
    }
  }, [onChangeSortOrder, sortBy]);

  return (
    <Box>
      <ChakraTable {...getTableProps()}>
        <Thead>
          {headerGroups.map(headerGroup => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map(column => (
                <Th
                  height="40px"
                  paddingX="0"
                  paddingY="8px"
                  fontSize="18px"
                  color="text.secondary"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={column.id}
                >
                  <Flex>
                    <Box height="24px" display="inline">
                      {column.render('Header')}
                    </Box>
                    <Box height="24px" display="inline" marginLeft="4px">
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <ArrowDownIcon aria-label="sorted descending" />
                        ) : (
                          <ArrowUpIcon aria-label="sorted ascending" />
                        )
                      ) : null}
                    </Box>
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={row.id}>
                {row.cells.map(cell => (
                  <Td height="80px" paddingX="0" {...cell.getCellProps()} key={row.id}>
                    {cell.render('Cell')}
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </ChakraTable>
    </Box>
  );
}
