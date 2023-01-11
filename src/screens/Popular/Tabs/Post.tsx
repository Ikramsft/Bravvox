/**
 * @format
 */
import React, {useCallback} from 'react';
import {useScrollToTop, useNavigation} from '@react-navigation/native';
import {Spinner, View} from 'native-base';
import {ListRenderItem} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {RootNavigationType} from '../../Home';
import {RootStackParamList} from '../../../navigation';
import {usePostFeed} from '../usePostFeed';
import {KEYBOARD_EXTRA_HEIGHT} from '../../../constants/common';
import {BravvoxBRedIcon} from '../../../assets/svg';
import {INewsFeedData} from '../../Home/types/NewsFeedInterface';
import NewsFeedLayout from '../../Home/NewsFeed/NewsFeedLayout';

export type GroupsScreenProps = BottomTabScreenProps<RootStackParamList, 'Events'>;

function Post() {
  const navigation = useNavigation<RootNavigationType>();
  const ref = React.useRef(null);
  useScrollToTop(ref);

  const {postList, isLoading, refetch, isFetchingNextPage, onEndReached} = usePostFeed();

  const keyExtractor = useCallback((item: INewsFeedData, index: number) => `key-${index}`, []);

  React.useLayoutEffect(() => {
    const headerTitle = () => (
      <View ml={-3} width={10}>
        <BravvoxBRedIcon height={40} width={20} />
      </View>
    );
    navigation.setOptions({headerTitle, headerTitleAlign: 'left'});
  }, [navigation]);

  const renderItem: ListRenderItem<INewsFeedData> = ({item}) => {
    return (
      <NewsFeedLayout
        isMember
        from="popular"
        key={item.documentId}
        navigation={navigation}
        newsFeed={item}
      />
    );
  };

  return (
    <KeyboardAwareFlatList
      data={postList}
      extraHeight={KEYBOARD_EXTRA_HEIGHT}
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
  );
}

export default Post;
