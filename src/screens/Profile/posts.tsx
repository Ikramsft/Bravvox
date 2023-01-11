/**
 * @format
 */
import React, {useCallback} from 'react';
import {Spinner} from 'native-base';
import {ListRenderItem, StyleSheet} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import NewsFeedLayout from '../Home/NewsFeed/NewsFeedLayout';
import {INewsFeedData} from '../Home/types/NewsFeedInterface';
import {useProfileNewsFeed} from './Queries/useProfileNewsFeed';
import {ProfileScreenProps} from '.';

interface IPostProps extends ProfileScreenProps {
  userId: string;
  postCount: number;
  setPostCount: (value: number) => void;
}

function Posts(props: IPostProps) {
  const {userId, navigation, postCount, setPostCount} = props;

  const {totalCount, feedList, isLoading, refetch, isFetchingNextPage, onEndReached} =
    useProfileNewsFeed(userId);

  React.useEffect(() => {
    if (totalCount !== postCount) {
      setPostCount(totalCount);
    }
  }, [postCount, setPostCount, totalCount]);

  const renderItem: ListRenderItem<INewsFeedData> = ({item, index}) => (
    <NewsFeedLayout
      isMember
      addTopSpace={index !== 0}
      from="profile"
      id={userId}
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
