/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @format
 */
import React, {useCallback, useMemo} from 'react';
import {Divider, Spinner, View, Text} from 'native-base';
import {filter} from 'lodash';
import {useScrollToTop} from '@react-navigation/native';
import {FlatList, ListRenderItem, StyleSheet} from 'react-native';
import UserCard from '../Cards/UserCard';
import {useSearch} from '../Queries/useSearch';

interface PeopleTabProps {
  jumpTo: (key: string) => void,
  searchText: string,
  onSearch: (text: string) => void,
  route: {
    key: string;
    title: string;
  }
}

function People({jumpTo, searchText, onSearch, route}: PeopleTabProps): JSX.Element {
  const type = 'accounts';
  const enabled = route.key === 'people'
  const searchParams = {
    keyword: searchText.toLowerCase(),
    type,
  };
  const {isLoading, refetch, onEndReached, isFetchingNextPage, searchResult, isError, error} =
    useSearch(searchParams, enabled);
  const ref = React.useRef(null);
  useScrollToTop(ref);

  const keyExtractor = useCallback((item: any, index: number) => `key-${index}-${item.id}`, []);

  const renderItem: ListRenderItem<any> = ({item}) => (
    <UserCard item={item} searchParams={searchParams} />
  );

  const renderSeparator = () => <Divider my="0.2" />;

  const data = useMemo(() => {
    return searchResult && filter(searchResult, i => i.relationship !== 'self');
  }, [searchResult]);
  
  const emptyContent = () => {
    if (!isLoading) {
      if (searchText !== '' && searchText.length >= 3) {
        return (
          <View style={styles.emptyContainer}>
            <Text>No exact matches found</Text>
          </View>
        );
      }
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* <SearchBox loading={isLoading} placeholder="Search for People" onSearch={onSearch} /> */}
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={data}
        ItemSeparatorComponent={renderSeparator}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        keyExtractor={keyExtractor}
        ListEmptyComponent={emptyContent}
        ListFooterComponent={isFetchingNextPage ? <Spinner mb={20} mt={20} /> : null}
        ListHeaderComponent={isLoading ? <Spinner mb={20} mt={20} /> : null}
        ref={ref}
        refreshing={isLoading}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        onRefresh={refetch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingBottom: 50,
  },
  emptyContainer: {
    // flex: 1,
    minHeight: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default People;
