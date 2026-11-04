import {
  AsyncTypeahead,
  AsyncTypeaheadProps,
  Menu,
  MenuItem,
  TypeaheadModel,
} from 'react-bootstrap-typeahead'; // Typeahead
import 'react-bootstrap-typeahead/css/Typeahead.css'; //Typeahead styling
import Helmet from 'react-helmet'; // Helmet
import 'bootstrap/dist/css/bootstrap.min.css'; //Bootstrap styling
import { Box, Center, Divider, Text } from '@chakra-ui/layout'; // Chakra UI Layout
import { Spinner } from '@chakra-ui/react'; //Chakra UI React
import { HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, RepeatIcon } from '@chakra-ui/icons';
import { Fragment } from 'react';

// Typeahead props
type Props<T extends TypeaheadModel> = Required<
  Pick<
    AsyncTypeaheadProps<T>,
    | 'isLoading' // boolean to indicate if query is loading
    | 'onSearch' // function to execute query when text is entered in input field
    | 'renderMenuItemChildren' // function to format each result in the menu
    | 'labelKey' // string used for searching and rendering typeahead results
  >
> & {
  results: Array<T>; // array of results to display in the typeahead menu
  placeholder: string; // placeholder text
  onSelect: (selected: T | undefined) => void; // record selected item
  id?: string;
  onInputChange?: (value: string) => void;
  error?: boolean;
  onRetry?: () => void;
  pagination?: {
    offset: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (offset: number) => void;
  };
};

/**
 * Typeahead component to perform asynchronous queries
 * @param props - props
 * @returns Typeahead component which can be used to search with any query
 */
export default function Typeahead<T extends TypeaheadModel>(props: Props<T>) {
  const {
    isLoading,
    onSearch,
    renderMenuItemChildren,
    labelKey,
    results,
    placeholder,
    onSelect,
    onInputChange,
    error,
    onRetry,
    pagination,
    id = 'async-typeahead',
  } = props;
  const filterBy = () => true;

  return (
    <>
      <AsyncTypeahead
        filterBy={filterBy}
        id={id}
        delay={300}
        isLoading={isLoading}
        useCache={false}
        paginate={false}
        minLength={1}
        onSearch={onSearch}
        onInputChange={onInputChange}
        labelKey={labelKey}
        options={results}
        placeholder={placeholder}
        emptyLabel="No results found."
        positionFixed={true}
        inputProps={{
          style: {
            width: '100%',
            maxWidth: '466px',
            height: '44px',
          },
        }}
        onChange={selected => {
          onInputChange?.('');
          selected.length > 0 ? onSelect(selected[0]) : onSelect(undefined);
        }}
        renderMenuItemChildren={renderMenuItemChildren}
        renderMenu={(results, menuProps, props) => {
          menuProps.text = props.text;
          return (
            <Menu {...menuProps} maxHeight="none">
              <Box maxHeight="240px" overflowY="auto">
                {results.length === 0 ? (
                  isLoading ? (
                    <Center height="80px">
                      <Spinner color="primary" mr="8px" />
                      <Text textStyle="body-regular" color="secondary">
                        Searching...
                      </Text>
                    </Center>
                  ) : (
                    <Center height="80px">
                      <Text textStyle="body-regular" color="secondary">
                        {error ? 'Search unavailable.' : 'No results found.'}
                      </Text>
                      {error && onRetry && (
                        <Tooltip label="Retry search">
                          <IconButton
                            aria-label="Retry search"
                            icon={<RepeatIcon />}
                            size="sm"
                            ml={2}
                            onMouseDown={event => event.preventDefault()}
                            onClick={onRetry}
                          />
                        </Tooltip>
                      )}
                    </Center>
                  )
                ) : (
                  results.map((result, index) => (
                    <Fragment key={(pagination?.offset || 0) + index}>
                      <MenuItem option={result} position={index}>
                        {renderMenuItemChildren(result, menuProps, index)}
                      </MenuItem>
                      {index !== results.length - 1 ? <Divider /> : null}
                    </Fragment>
                  ))
                )}
              </Box>
              {pagination &&
                (pagination.totalCount > pagination.pageSize || pagination.offset > 0) && (
                  <HStack width="100%" justify="space-between" bg="white" px={2} py={1}>
                    <Tooltip label="Previous results">
                      <IconButton
                        aria-label="Previous results"
                        size="sm"
                        icon={<ChevronLeftIcon />}
                        isDisabled={isLoading || pagination.offset === 0}
                        onMouseDown={event => event.preventDefault()}
                        onClick={() =>
                          pagination.onPageChange(
                            Math.max(0, pagination.offset - pagination.pageSize)
                          )
                        }
                      />
                    </Tooltip>
                    <Text fontSize="sm" aria-live="polite">
                      {isLoading
                        ? 'Loading...'
                        : `${pagination.offset + (results.length ? 1 : 0)}-${
                            pagination.offset + results.length
                          } of ${pagination.totalCount}`}
                    </Text>
                    <Tooltip label="Next results">
                      <IconButton
                        aria-label="Next results"
                        size="sm"
                        icon={<ChevronRightIcon />}
                        isDisabled={
                          isLoading ||
                          pagination.offset + pagination.pageSize >= pagination.totalCount
                        }
                        onMouseDown={event => event.preventDefault()}
                        onClick={() =>
                          pagination.onPageChange(pagination.offset + pagination.pageSize)
                        }
                      />
                    </Tooltip>
                  </HStack>
                )}
            </Menu>
          );
        }}
      />
      <Helmet>
        <style>
          {`
          .dropdown-menu {
            padding: 0;
          }
          .dropdown-item {
            color: #1A1A1A;
          }
          .dropdown-item.active, .dropdown-item:hover {
            background-color: #F2F7FE;
            color: #1A1A1A;
          }
          .dropdown-item:active {
            background-color: #E2E8F0;
            color: #1A1A1A;
          }
          .form-control.focus {
            border-color: #3182CE;
            box-shadow: 0 0 0 1px #3182CE;
          }
        `}
        </style>
      </Helmet>
    </>
  );
}
