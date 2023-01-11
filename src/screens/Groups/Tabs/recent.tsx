/**
 * @format
 */
import React, {useCallback} from 'react';
import {Divider, Spinner, View} from 'native-base';
import {useScrollToTop} from '@react-navigation/native';
import {FlatList, ListRenderItem, StyleSheet} from 'react-native';
import {useGroupsList} from '../Queries/useGroupsList';
import {IGroupCardInfo} from '../types/GroupInterfaces';
import GroupListCard from './GroupListCard';
import SearchInput from '../../../components/SearchInput';

function Recent() {
  const {groupsList, isLoading, refetch, isFetchingNextPage, onEndReached} =
    useGroupsList('recent');

  const ref = React.useRef(null);
  useScrollToTop(ref);

  const keyExtractor = useCallback(
    (item: IGroupCardInfo, index: number) => `key-${index}-${item.id}`,
    [],
  );

  const renderItem: ListRenderItem<IGroupCardInfo> = ({item}) => <GroupListCard item={item} />;

  const renderSeparator = () => <Divider my="0.2" />;

  return (
    <View style={styles.container}>
      <SearchInput placeholder="Search Groups" />
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={groupsList}
        ItemSeparatorComponent={renderSeparator}
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

export default Recent;
