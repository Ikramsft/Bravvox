import {Spinner} from 'native-base';
import React, {useCallback} from 'react';
import {ListRenderItem, StyleSheet} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import {EventProfileScreenProps} from './index';
import {INewsFeedData} from '../Home/types/NewsFeedInterface';
import NewsFeedLayout from '../Home/NewsFeed/NewsFeedLayout';
import {useEventNewsFeed} from './Queries/useEventNewsFeed';

interface IEventProps extends EventProfileScreenProps {
  eventId: string;
  isMember: boolean;
}

function Event(props: IEventProps) {
  const {eventId, navigation, isMember} = props;

  const {feedList, isLoading, refetch, isFetchingNextPage, onEndReached} =
    useEventNewsFeed(eventId);

  const renderItem: ListRenderItem<INewsFeedData> = ({item, index}) => (
    <NewsFeedLayout
      addTopSpace={index !== 0}
      from="event"
      id={eventId}
      isMember={isMember}
      key={item.documentId}
      navigation={navigation}
      newsFeed={item}
    />
  );

  const keyExtractor = useCallback(
    (item: INewsFeedData, index: number) => `key-${index}-${item.documentId}`,
    [],
  );

  return (
    <Tabs.FlatList
      contentContainerStyle={styles.listStyle}
      data={feedList}
      keyboardShouldPersistTaps="handled"
      keyExtractor={keyExtractor}
      ListFooterComponent={isFetchingNextPage ? <Spinner mb={20} mt={20} /> : null}
      ListHeaderComponent={isLoading ? <Spinner mb={20} mt={20} /> : null}
      refreshing={isLoading}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      onRefresh={refetch}
    />
  );
}

export default Event;

const styles = StyleSheet.create({
  listStyle: {paddingBottom: 50},
});
