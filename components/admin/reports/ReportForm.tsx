import { ChangeEvent, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';

export type ReportFormInput<Column extends string> = {
  readonly startDate: string;
  readonly endDate: string;
  readonly columns: Array<Column>;
};

type Props<Column extends string> = {
  readonly description: string;
  readonly dateLabel: string;
  readonly columns?: ReadonlyArray<{ name: string; value: Column }>;
  readonly loading: boolean;
  readonly onExport: (input: ReportFormInput<Column>) => void;
};

export default function ReportForm<Column extends string>(props: Props<Column>) {
  const { description, dateLabel, columns, loading, onExport } = props;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<Set<Column>>(new Set());

  const areAllColumnsSelected = useMemo(
    () => !!columns && columns.every(({ value }) => selectedColumns.has(value)),
    [columns, selectedColumns]
  );

  const handleSelectColumn = (column: Column) => (event: ChangeEvent<HTMLInputElement>) => {
    const updatedSelectedColumns = new Set([...selectedColumns]);
    event.target.checked
      ? updatedSelectedColumns.add(column)
      : updatedSelectedColumns.delete(column);
    setSelectedColumns(updatedSelectedColumns);
  };

  const handleSelectAllColumns = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedColumns(
      new Set(event.target.checked && columns ? columns.map(({ value }) => value) : [])
    );
  };

  const canExport = !!startDate && !!endDate && (!columns || selectedColumns.size > 0);

  return (
    <Box padding="24px" textAlign="left">
      <Text textStyle="body-regular" color="text.secondary" marginBottom="32px">
        {description}
      </Text>
      <Box marginBottom="32px">
        <Text textStyle="heading" marginBottom="16px">
          {dateLabel}
        </Text>
        <Stack direction="row" spacing="20px">
          <FormControl isRequired width="auto">
            <FormLabel>Start date</FormLabel>
            <Input
              type="date"
              width="184px"
              value={startDate}
              onChange={event => setStartDate(event.target.value)}
            />
          </FormControl>
          <FormControl isRequired width="auto">
            <FormLabel>End date</FormLabel>
            <Input
              type="date"
              width="184px"
              value={endDate}
              onChange={event => setEndDate(event.target.value)}
            />
          </FormControl>
        </Stack>
      </Box>
      {columns && (
        <Box marginBottom="32px">
          <Text textStyle="heading" marginBottom="16px">
            Columns to Export
          </Text>
          <Checkbox
            paddingBottom="6px"
            fontWeight="bold"
            isChecked={areAllColumnsSelected}
            onChange={handleSelectAllColumns}
          >
            Select All
          </Checkbox>
          <SimpleGrid columns={3} spacingX="20px" spacingY="6px">
            {columns.map(({ name, value }) => (
              <Checkbox
                key={value}
                isChecked={selectedColumns.has(value)}
                onChange={handleSelectColumn(value)}
              >
                {name}
              </Checkbox>
            ))}
          </SimpleGrid>
        </Box>
      )}
      <Button
        height="48px"
        leftIcon={<DownloadIcon />}
        isLoading={loading}
        isDisabled={!canExport}
        onClick={() => onExport({ startDate, endDate, columns: [...selectedColumns] })}
      >
        Export as CSV
      </Button>
    </Box>
  );
}
