import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import React from 'react';
import {
  AsyncTypeahead,
  AsyncTypeaheadProps,
  Highlighter,
  Menu,
  MenuItem,
  TypeaheadModel,
} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { SearchIcon } from '@chakra-ui/icons';
import 'bootstrap/dist/css/bootstrap.min.css';

type Props<T extends TypeaheadModel> = Pick<AsyncTypeaheadProps<T>, 'isLoading' | 'onSearch'> & {
  results: Array<T>;
  placeholder: string;
};

export default function Typeahead<T extends TypeaheadModel>(props: Props<T>) {
  const { isLoading, onSearch, results, placeholder } = props;
  const filterBy = () => true;

  return (
    <AsyncTypeahead
      filterBy={filterBy}
      id="async-typeahead"
      isLoading={isLoading}
      minLength={3}
      onSearch={onSearch}
      options={results}
      placeholder={placeholder}
      positionFixed={true}
      renderInput={({ inputRef, referenceElementRef, ...inputProps }) => (
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="text.filler" />
          </InputLeftElement>
          <Input
            backgroundColor="white"
            borderColor="border.secondary"
            width="500px"
            {...inputProps}
            ref={input => {
              inputRef(input);
              referenceElementRef(input);
            }}
          />
        </InputGroup>
      )}
      renderMenu={(results, menuProps, props) => (
        <Menu {...menuProps}>
          {results.map((result, index) => (
            <MenuItem key={index} option={result} position={index}>
              <Highlighter search={props.text}>{result.label}</Highlighter>
            </MenuItem>
          ))}
        </Menu>
      )}
    />
  );
}
