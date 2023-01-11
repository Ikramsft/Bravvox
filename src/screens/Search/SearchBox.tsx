import React, {useCallback, useState} from 'react';
import {debounce, isString} from 'lodash';
import {Icon, IInputProps, View} from 'native-base';
import {ActivityIndicator} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SearchInput from '../../components/SearchInput';

interface ISearchBoxProps extends IInputProps {
  placeholder?: string;
  loading?: boolean;
  onSearch: (text: string) => void;
  defaultValue?: string;
}

function SearchBox(props: ISearchBoxProps): JSX.Element {
  const {placeholder, onSearch, loading, defaultValue} = props;
  const [searchText, setSearchText] = useState(defaultValue || '');

  const callBack = debounce((val: string) => {
    if (typeof onSearch === 'function') {
      onSearch(val);
    }
  }, 500);

  const debouncedSave = useCallback(callBack, [callBack]);

  const setQueryText = (newValue: string) => {
    setSearchText(newValue);
    debouncedSave(newValue);
  };

  React.useEffect(() => {
    if (isString(defaultValue)) {
      setSearchText(defaultValue);
    }
  }, [defaultValue])
  

  let rightElement = (<View />);
  if (loading) {
    rightElement = (<View ml="2" mr="2"><ActivityIndicator color="gray.400" size="small" /></View>);
  } else if (isString(searchText) && searchText.trim() !== '') {
    rightElement = (
      <Icon as={<MaterialIcons name="close" />} color="gray.400" m="2" ml="5" size="6" onPress={() => setQueryText('')} />
    );
  }
  return (
    <SearchInput
      autoCapitalize="none"
      autoCorrect={false}
      InputRightElement={rightElement}
      placeholder={placeholder}
      value={searchText}
      onChangeText={setQueryText}
    />
  );
}

SearchBox.defaultProps = {
  placeholder: 'Search',
  loading: false,
  defaultValue: '',
};

export default SearchBox;
