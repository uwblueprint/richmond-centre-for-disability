import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { AsyncTypeahead, AsyncTypeaheadProps, TypeaheadModel } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { SearchIcon } from '@chakra-ui/icons';
import Helmet from 'react-helmet';
import 'bootstrap/dist/css/bootstrap.min.css';

type Props<T extends TypeaheadModel> = Pick<
  AsyncTypeaheadProps<T>,
  'isLoading' | 'onSearch' | 'renderMenuItemChildren'
> & {
  results: Array<T>;
  placeholder: string;
};

export default function Typeahead<T extends TypeaheadModel>(props: Props<T>) {
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
        positionFixed={true}
        // inputProps={{
        //   style:{
        //     'width':'400px',
        //     'color':'#A1A1A1'
        // }}}
        renderInput={({ inputRef, referenceElementRef, size: _size, ...inputProps }) => (
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="text.filler" />
            </InputLeftElement>
            <Input
              backgroundColor="white"
              borderColor="border.secondary"
              maxwidth="500px"
              minWidth="400px"
              {...inputProps}
              // onChange={() => {onChange(selected)}}
              ref={input => {
                // ! Fix react-bootstrap-typeahead type issues
                if (inputRef) {
                  (inputRef as (instance: HTMLInputElement | null) => void)(input);
                }
                referenceElementRef(input);
              }}
            />
          </InputGroup>
        )}
        renderMenuItemChildren={renderMenuItemChildren}
      />
      <Helmet>
        <style>
          {`
          .dropdown-item {
            color: #1A1A1A;
          }
          .dropdown-item.active {
            background-color: #F2F7FE;
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
