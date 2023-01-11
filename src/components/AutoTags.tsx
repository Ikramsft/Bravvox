import _, {debounce} from 'lodash';
import {IInputProps, Input, Text, View} from 'native-base';
import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {AutocompleteProps} from 'react-native-autocomplete-input';
import Autocomplete from '../lib/Autocomplete/Autocomplete';
import {theme} from '../theme';

// type ITagData = {
//   id?: any;
//   name: any;
// };

export interface IAutoTagsProps extends JSX.IntrinsicAttributes, AutocompleteProps<any> {
  renderTags?: (tags: any) => JSX.Element;
  tagsOrientedBelow?: boolean;
  tagStyles?: ViewStyle;
  tagsSelected: any[];
  handleDelete: (index: number) => void;
  allowBackspace?: boolean;
  onChangeText?: (text: string) => void;
  createTagOnSpace?: boolean;
  onCustomTagCreated?: (query: string) => void;
  suggestions?: any[];
  filterData?: (query: string) => any[];
  handleAddition: (tag: any) => void;
  renderSuggestion?: (item: any) => JSX.Element;
  children?: React.ReactNode;
  placeholder?: string;
  getSuggestions: (query: string) => Promise<any[]>;
  suggestionsLoading?: boolean;
  filterKey?: string;
  listContainerStyle?: ViewStyle;
}

const styles = StyleSheet.create({
  AutoTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.primary[500],
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  autoComplete: {
    borderWidth: 0,
    height: 50,
    fontSize: 14,
    margin: 0,
    padding: 0,
  },
  // eslint-disable-next-line react-native/no-color-literals
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    backgroundColor: '#f9fafb',
    width: 300,
  },
  // eslint-disable-next-line react-native/no-color-literals
  tag: {
    backgroundColor: 'rgb(244, 244, 244)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    marginLeft: 5,
    borderRadius: 30,
    padding: 8,
  },
  // eslint-disable-next-line react-native/no-color-literals
  inputContainerStyle: {
    borderRadius: 0,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    borderColor: 'transparent',
    alignItems: 'stretch',
    flexDirection: 'column',
    backgroundColor: '#f9fafb',
  },
  containerStyle: {
    width: '100%',
    // paddingHorizontal: 5,
  },
  emptyView: {
    height: 100,
    alignItems: 'center',
    width: '100%',
    paddingTop: 30,
  },
});

function AutoTags(props: IAutoTagsProps) {
  const {
    renderTags: propsRenderTags,
    tagsOrientedBelow,
    tagStyles,
    tagsSelected,
    handleDelete,
    allowBackspace,
    onChangeText,
    createTagOnSpace,
    onCustomTagCreated,
    // suggestions,
    filterData: propsFilterData,
    handleAddition,
    placeholder,
    inputContainerStyle,
    renderSuggestion,
    containerStyle,
    autoFocus,
    getSuggestions,
    filterKey,
    listContainerStyle,
    // suggestionsLoading,
  } = props;
  const FILTER_USING_ID = true;
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getDebouncedSuggestions = async (word: string) => {
    if (word && word.trim().length > 2) {
      try {
        setSuggestionsLoading(true);
        const data = await getSuggestions(word);
        setSuggestions(data);
        setSuggestionsLoading(false);
      } catch (error) {
        setSuggestions([]);
        setSuggestionsLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const callBack = debounce((val: string) => {
    if (typeof getSuggestions === 'function') {
      getDebouncedSuggestions(val);
    }
  }, 1000);

  const debouncedSave = useCallback(callBack, [callBack]);

  const setQueryText = (newValue: string) => {
    setQuery(newValue);
    if (newValue?.length > 2) {
      setSuggestionsLoading(true);
    }
    debouncedSave(newValue);
  };

  const renderTags = () => {
    if (propsRenderTags) {
      return propsRenderTags(tagsSelected);
    }

    const tagMargins = tagsOrientedBelow ? {marginBottom: 5} : {marginTop: 5};

    return (
      <View style={tagStyles || styles.tags}>
        {tagsSelected.map((t, i) => {
          return (
            <TouchableHighlight
              key={`touchable_highlight_tag_${t.id}`}
              style={[tagMargins, styles.tag]}
              onPress={() => handleDelete(i)}>
              <Text>{t.name}</Text>
            </TouchableHighlight>
          );
        })}
      </View>
    );
  };

  const handleInput = (text: string) => {
    if (submitting) return;
    if (allowBackspace) {
      // TODO: on ios, delete last tag on backspace event && empty query
      // (impossible on android atm, no listeners for empty backspace)
    }
    if (onChangeText) {
      onChangeText(text);
      return;
    }
    if (
      createTagOnSpace &&
      onCustomTagCreated &&
      text.length > 1 &&
      text.charAt(text.length - 1) === ' '
    ) {
      setQueryText('');
      onCustomTagCreated(text.trim());
      return;
    }
    if (createTagOnSpace && !onCustomTagCreated) {
      console.error(
        'When enabling createTagOnSpace, you must provide an onCustomTagCreated function',
      );
    }

    if (text.charAt(text.length - 1) === '\n') {
      return; // prevent onSubmit bugs
    }

    // this.setState({ query: text });
    setQueryText(text);
  };

  const filterUsingID = () => {
    const fk = filterKey || 'id';
    const filterIds = _.map(tagsSelected, i => i[fk]);
    const res = _.filter(suggestions, i => filterIds.indexOf(i[fk]) < 0);
    // console.log(res);
    return res;
  };

  const filterData = () => {
    if (!query || query.trim() === '' || !suggestions) {
      return [];
    }
    if (propsFilterData) {
      return propsFilterData(query);
    }

    if (FILTER_USING_ID) {
      return filterUsingID();
    }
    // let suggestions = suggestions;
    const results: {name: string}[] = [];
    const query1 = query.toUpperCase();
    suggestions.forEach((i: {name: string}) => {
      if (i.name.toUpperCase().includes(query1)) {
        results.push(i);
      }
    });
    console.log('results', results);
    // eslint-disable-next-line consistent-return
    return results;
  };

  const onSubmitEditing = () => {
    // const { query } = this.state;
    const query1 = query;
    if (!onCustomTagCreated || query1.trim() === '') return;
    setQueryText('');
    onCustomTagCreated(query1);
    // this.setState({ query: "" }, () => onCustomTagCreated(query));

    // prevents an issue where handleInput() will overwrite
    // the query clear in some circumstances
    // this.submitting = true;
    setSubmitting(true);
    setTimeout(() => {
      //   this.submitting = false;
      setSubmitting(false);
    }, 30);
  };

  const addTag = (tag: any) => {
    if (handleAddition) {
      handleAddition(tag);
    }
    setQueryText('');
  };

  const renderItem = ({item}: {item: any}): JSX.Element => (
    <TouchableOpacity onPress={() => addTag(item)}>
      {renderSuggestion ? renderSuggestion(item) : <Text>{item.name}</Text>}
    </TouchableOpacity>
  );
  const data = filterData();

  return (
    <View style={styles.AutoTags}>
      {!tagsOrientedBelow && tagsSelected && renderTags()}
      <Autocomplete
        autoFocus={autoFocus !== false}
        containerStyle={[styles.containerStyle, containerStyle]}
        data={data || []}
        defaultValue={query}
        flatListProps={{
          keyExtractor: (item: any, idx: number) => idx.toString(),
          renderItem,
          keyboardShouldPersistTaps: 'always',
          contentContainerStyle: {
            flexGrow: 1,
            width: '100%',
            alignItems: 'center',
            jusifyContent: 'center',
          },
          style: {
            maxHeight: 150,
            flex: 1,
          },
          ListEmptyComponent: (
            <View style={styles.emptyView}>
              {suggestionsLoading ? (
                <ActivityIndicator color={theme.colors.primary[500]} size="large" />
              ) : (
                <Text
                  alignItems="center"
                  justifyContent="center"
                  pb="3"
                  pt="3"
                  size="md"
                  textAlign="center">
                  No Data Found!
                </Text>
              )}
            </View>
          ),
        }}
        hideResults={query.length < 3}
        inputContainerStyle={[styles.inputContainerStyle, inputContainerStyle]}
        // multiline
        // numberOfLines={4}
        listContainerStyle={[
          {backgroundColor: tagsOrientedBelow ? '#f9fafb' : 'transparent', borderWidth: 0},
          listContainerStyle,
        ]}
        placeholder={placeholder}
        renderTextInput={(
          props1: JSX.IntrinsicAttributes & IInputProps & React.RefAttributes<unknown>,
        ) => <Input {...props1} variant="unstyled" />}
        style={styles.autoComplete}
        underlineColorAndroid="transparent"
        value={query}
        onChangeText={(text: string) => handleInput(text)}
        onSubmitEditing={onSubmitEditing}
      />
      {/* {tagsOrientedBelow && tagsSelected && renderTags()} */}
    </View>
  );
}

AutoTags.defaultProps = {
  renderTags: null,
  tagsOrientedBelow: false,
  tagStyles: {},
  allowBackspace: false,
  onChangeText: null,
  createTagOnSpace: false,
  onCustomTagCreated: null,
  suggestions: [],
  filterData: null,
  renderSuggestion: null,
  children: null,
  placeholder: '',
  suggestionsLoading: false,
  filterKey: 'id',
  listContainerStyle: {},
};

export default AutoTags;
