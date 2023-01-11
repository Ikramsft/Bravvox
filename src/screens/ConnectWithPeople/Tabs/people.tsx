/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @format
 */
import React, {useCallback} from 'react';
import {Divider, Spinner, View} from 'native-base';
import {useScrollToTop} from '@react-navigation/native';
import {FlatList, ListRenderItem, StyleSheet} from 'react-native';
import UserCard from '../Cards/UserCard';
import {useConnectionPeople} from '../Queries/useConnectionPeople';
import {People as PeopleItem} from '../types/ConnectionInterface';

function People() {
  const ref = React.useRef(null);
  useScrollToTop(ref);

  const keyExtractor = useCallback(
    (item: PeopleItem, index: number) => `key-${index}-${item.userId}`,
    [],
  );

  const renderItem: ListRenderItem<PeopleItem> = ({item}) => (
    <UserCard from="connectionPeople" item={item} />
  );

  const renderSeparator = () => <Divider my="0.2" />;

  const {peopleList, isLoading, refetch, isFetchingNextPage, onEndReached} = useConnectionPeople();

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={peopleList}
        ItemSeparatorComponent={renderSeparator}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        keyExtractor={keyExtractor}
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
});

export default People;
