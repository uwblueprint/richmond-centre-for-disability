import { AsyncTypeahead, AsyncTypeaheadProps } from 'react-bootstrap-typeahead';

type Props = Pick<AsyncTypeaheadProps<string>, 'isLoading' | 'onSearch'> & {
  results: Array<string>; //todo: change type
  placeholder: string;
};

export default function Typeahead(props: Props) {
  const { isLoading, onSearch, results, placeholder } = props;
  const filterBy = () => true;

  return (
    <AsyncTypeahead
      id="test-async-typeahead" //todo
      filterBy={filterBy}
      promptText={placeholder}
      options={results}
      isLoading={isLoading}
      onSearch={onSearch}
    />
  );
}
