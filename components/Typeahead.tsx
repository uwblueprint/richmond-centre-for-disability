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
import { Box, Center, Divider, VStack, Text } from '@chakra-ui/layout'; // Chakra UI

// Typeahead props
type Props<T extends TypeaheadModel> = Pick<
  AsyncTypeaheadProps<T>,
  'isLoading' | 'onSearch' | 'renderMenuItemChildren'
> & {
  results: Array<T>;
  placeholder: string;
};

export default function Typeahead<T extends TypeaheadModel>(props: Required<Props<T>>) {
  const { isLoading, onSearch, renderMenuItemChildren, results, placeholder } = props;
  const filterBy = () => true;

  return (
    <>
      <AsyncTypeahead
        filterBy={filterBy}
        id="async-typeahead"
        isLoading={isLoading}
        minLength={3}
        onSearch={onSearch}
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
        renderMenuItemChildren={renderMenuItemChildren}
        renderMenu={(results, menuProps, props) => {
          menuProps.text = props.text;
          return (
            <VStack>
              <Box></Box>
              <Menu {...menuProps} maxHeight="280px">
                {results.length === 0 ? (
                  isLoading ? (
                    <Center height="80px">
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
