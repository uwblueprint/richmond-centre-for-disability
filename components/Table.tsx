import { useEffect } from 'react'; // React
import { Box, Flex, Table as ChakraTable, Th, Td, Thead, Tbody, Tr } from '@chakra-ui/react'; // Chakra UI
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import { useTable, useSortBy, Column } from 'react-table'; // React Table
import { SortOptions } from '@tools/types'; // Sorting types
import { getSortOptions } from '@tools/components/admin/table'; // Get the sort options from the React Table sortBy state

// Table Props
type Props = {
  readonly columns: Array<Column<any>>; // Depends on shape of data
  readonly data: Array<any>; // Depends on shape of data
  readonly onChangeSortOrder?: (sort: SortOptions) => unknown; // Callback after changing sorting
  readonly onRowClick?: (row: any) => unknown;
};

export default function Table(props: Props) {
  const { columns, data, onChangeSortOrder, onRowClick } = props;

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
  }, [sortBy]);

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
                  width={column.width}
                  minWidth={column.minWidth}
                  maxWidth={column.maxWidth}
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
              <Tr
                {...row.getRowProps()}
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                cursor={onRowClick ? 'pointer' : undefined}
                _hover={onRowClick && { background: 'background.interactive' }}
              >
                {row.cells.map((cell, i) => (
                  <Td
                    height="80px"
                    paddingX="0"
                    color="text.secondary"
                    {...cell.getCellProps()}
                    key={`cell-${i}`}
                  >
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