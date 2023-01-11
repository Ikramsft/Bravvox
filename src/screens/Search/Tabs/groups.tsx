/**
 * @format
 */
import React, {useCallback} from 'react';
import {Divider, Spinner, Text, View} from 'native-base';
import {useScrollToTop} from '@react-navigation/native';
import {FlatList, ListRenderItem, StyleSheet} from 'react-native';
import GroupCard from '../Cards/GroupCard';
import {useSearch} from '../Queries/useSearch';

interface GroupsTabProps {
  jumpTo: (key: string) => void,
  searchText: string,
  onSearch: (text: string) => void,
  route: {
    key: string;
    title: string;
  }
}

function Groups({
  jumpTo,
  searchText,
  onSearch,
  route,
}: GroupsTabProps): JSX.Element {
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const type = 'groups';
  const enabled = route.key === 'groups'
  const searchParams = {
    keyword: searchText.toLowerCase(),
    type,
  };
  const {isLoading, refetch, onEndReached, isFetchingNextPage, searchResult, isError, error} =
    useSearch(searchParams, enabled);
  const keyExtractor = useCallback((item: any, index: number) => `key-${index}-${item.id}`, []);

  const renderItem: ListRenderItem<any> = ({item}) => <GroupCard item={item} />;

  const renderSeparator = () => <Divider my="0.2" />;

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
    return <View style={styles.emptyContainer} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={searchResult}
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
    minHeight: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Groups;
