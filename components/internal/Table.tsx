import { Box, Table as ChakraTable, Th, Td, Thead, Tbody, Tr } from '@chakra-ui/react'; // Chakra UI
import { useTable, Column } from 'react-table'; // React Table

// Table Props
type Props = {
  readonly columns: Array<Column<any>>; // Depends on shape of data
  readonly data: Array<any>; // Depends on shape of data
};

export default function Table(props: Props) {
  const { columns, data } = props;

  // Table rendering functions
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

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
                  fontSize="18px"
                  color="text.secondary"
                  {...column.getHeaderProps()}
                  key={column.id}
                >
                  {column.render('Header')}
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
