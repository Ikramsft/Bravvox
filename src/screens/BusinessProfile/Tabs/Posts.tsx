/**
 * @format
 */
import React, {useCallback} from 'react';
import {Spinner} from 'native-base';
import {Tabs} from 'react-native-collapsible-tab-view';
import {ListRenderItem, StyleSheet} from 'react-native';

import {INewsFeedData} from '../../Home/types/NewsFeedInterface';
import NewsFeedLayout from '../../Home/NewsFeed/NewsFeedLayout';
import {useBusinessNewsFeed} from '../Queries/useBusinessNewsFeed';
import {BusinessProfileScreenProps} from '..';

interface IPostProps extends BusinessProfileScreenProps {
  businessId: string;
  isBusinessActive: boolean;
  isMember: boolean;
}

function Posts(props: IPostProps) {
  const {businessId, navigation, isBusinessActive, isMember} = props;

  const {feedList, isLoading, refetch, isFetchingNextPage, onEndReached} = useBusinessNewsFeed(
    businessId,
    isBusinessActive,
  );

  const renderItem: ListRenderItem<INewsFeedData> = ({item}) => (
    <NewsFeedLayout
      from="business"
      id={businessId}
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
