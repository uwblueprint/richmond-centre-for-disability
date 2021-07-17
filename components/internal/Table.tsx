import { useState } from 'react';
import { Table as ChakraUITable, Th, Td, Thead, Tbody, Tr } from '@chakra-ui/react'; // Chakra UI Table
type Props = {
  readonly columns: ReadonlyArray<{
    readonly name: string;
    readonly value: string;
    readonly isSortable: boolean;
  }>;
  readonly data: ReadonlyArray<{
    readonly value: string;
    //readonly dataEntry: {[key: string]: number};
  }>;
};
// const props = {
//     data: [data1, data2, ...],
//     columns: [{name: 'column1', value: 'valueofcolumn1'}, {}]
// }
export default function Table(props: Props) {
  const { columns, data } = props;
  const [arrowDirection, setArrowDirection] = useState(1); // Let 1 = ASC, 0 = No sort, -1 = DESC
  return (
    <>
      <ChakraUITable>
        <Thead>
          <Tr>
            {columns.map((column, i) => {
              if (column.isSortable) {
                return (
                  <Th
                    key={`column-${i}`}
                    //   onClick={() => {
                    //     changeSortOrder(); // Later on
                    //   }}
                  >
                    {`${column.name} (sortable)`}
                  </Th>
                );
              } else {
                return <Th key={`column-${i}`}>{column.name}</Th>;
              }
            })}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((value, i) => {
            if (i == 0 || columns.length % i == 0) {
              return (
                <Tr>
                  <Td>{value}</Td>
                </Tr>
              );
            } else {
              return <Td>{value}</Td>;
            }
          })}
        </Tbody>
      </ChakraUITable>
      <p>{arrowDirection}</p>
      <button onClick={() => setArrowDirection(arrowDirection + 1)}>change state</button>
    </>
  );
}
