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
import { Center, Divider, VStack, Text } from '@chakra-ui/layout'; // Chakra UI Layout
import { Spacer, Spinner } from '@chakra-ui/react'; //Chakra UI React

// Typeahead props
type Props<T extends TypeaheadModel> = Pick<
  AsyncTypeaheadProps<T>,
  | 'isLoading' // boolean to indicate if query is loading
  | 'onSearch' // function to execute query when text is entered in input field
  | 'renderMenuItemChildren' // function to format each result in the menu
  | 'labelKey' // string used for searching and rendering typeahead results
> & {
  results: Array<T>; // array of results to display in the typeahead menu
  placeholder: string; // placeholder text
  onSelected: (selected: T | undefined) => void; // record selected item
};

/**
 * Typeahead component to perform asynchronous queries
 * @param props - props
 * @returns Typeahead component which can be used to search with any query
 */
export default function Typeahead<T extends TypeaheadModel>(props: Required<Props<T>>) {
  const {
    isLoading,
    onSearch,
    renderMenuItemChildren,
    labelKey,
    results,
    placeholder,
    onSelected,
  } = props;
  const filterBy = () => true;

  return (
    <>
      <AsyncTypeahead
        filterBy={filterBy}
        id="async-typeahead"
        isLoading={false} // always false to hide spinner in input field when loading
        minLength={3}
        onSearch={onSearch}
        labelKey={labelKey}
        options={results}
        placeholder={placeholder}
        emptyLabel="No results found."
        positionFixed={true}
        inputProps={{
          style: {
            width: '466px',
            height: '44px',
          },
        }}
        onChange={selected => {
          selected.length > 0 ? onSelected(selected[0]) : onSelected(undefined);
        }}
        renderMenuItemChildren={renderMenuItemChildren}
        renderMenu={(results, menuProps, props) => {
          menuProps.text = props.text;
          return (
            <VStack>
              <Spacer height="8px" />
              <Menu {...menuProps} maxHeight="280px">
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
                        No results found.
                      </Text>
                    </Center>
                  )
                ) : (
                  results.map((result, index) => (
                    <>
                      <MenuItem option={result} position={index}>
                        {renderMenuItemChildren(result, menuProps, index)}
                      </MenuItem>
                      {index !== results.length - 1 ? (
                        <Divider width="466px" borderWidth="0" color="border.secondary" />
                      ) : null}
                    </>
                  ))
                )}
              </Menu>
            </VStack>
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
