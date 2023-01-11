/**
 * @format
 */
import React, {useCallback} from 'react';
import {Divider, Spinner, View} from 'native-base';
import {FlatList, ListRenderItem, StyleSheet} from 'react-native';
import {useScrollToTop} from '@react-navigation/native';
import {IEventData, useEventList} from '../Queries/useEventList';
import EventListCard from './EventListCard';
import SearchInput from '../../../components/SearchInput';

function Recent() {
  const {eventList, isLoading, refetch, isFetchingNextPage, onEndReached} = useEventList('popular');

  const keyExtractor = useCallback(
    (item: IEventData, index: number) => `key-${index}-${item.id}`,
    [],
  );

  const ref = React.useRef(null);
  useScrollToTop(ref);

  const renderItem: ListRenderItem<IEventData> = ({item}) => <EventListCard item={item} />;

  const renderSeparator = () => <Divider my="0.2" />;

  return (
    <View style={styles.container}>
      <SearchInput placeholder="Search Events"/>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={eventList}
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
