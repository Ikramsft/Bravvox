/**
 * @format
 */
import React, {useCallback} from 'react';
import {Spinner} from 'native-base';
import {Tabs} from 'react-native-collapsible-tab-view';
import {ListRenderItem, StyleSheet} from 'react-native';

import {GroupProfileScreenProps} from '.';
import {INewsFeedData} from '../Home/types/NewsFeedInterface';
import NewsFeedLayout from '../Home/NewsFeed/NewsFeedLayout';
import {useGroupNewsFeed} from './Queries/useGroupNewsFeed';

interface IPostProps extends GroupProfileScreenProps {
  groupId: string;
  isGroupActive: boolean;
  isMember: boolean;
}

function Posts(props: IPostProps) {
  const {groupId, navigation, isGroupActive, isMember} = props;

  const {feedList, isLoading, refetch, isFetchingNextPage, onEndReached} = useGroupNewsFeed(
    groupId,
    isGroupActive,
  );

  const renderItem: ListRenderItem<INewsFeedData> = ({item, index}) => (
    <NewsFeedLayout
      addTopSpace={index !== 0}
      from="group"
      id={groupId}
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

const styles = StyleSheet.create({listStyle: {paddingBottom: 50}});

export default Posts;
