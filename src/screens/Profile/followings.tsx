import React, {useCallback} from 'react';
import {ListRenderItem, StyleSheet} from 'react-native';
import {Spinner, View, Text} from 'native-base';
import {Tabs} from 'react-native-collapsible-tab-view';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {ProfileScreenProps} from '.';
import {useProfileFollowings} from './Queries/useProfileFollowing';
import {IFollowings} from '../Home/types/NewsFeedInterface';
import FollowingListItem from './FollowingListItem';
import {RootStackParamList} from '../../navigation';
import {theme} from '../../theme';

interface IPhotosProps extends ProfileScreenProps {
  userId: string;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
}

function Followings(props: IPhotosProps) {
  const {userId, navigation} = props;
  const {followings, isLoading, refetch, isFetchingNextPage, onEndReached} =
    useProfileFollowings(userId);

  const openProfile = useCallback(
    item => {
      const {name} = item;
      navigation.push('Profile', {userName: name, userId});
    },
    [userId, navigation],
  );

  const renderItem: ListRenderItem<IFollowings> = ({item}) => {
    return <FollowingListItem openProfile={() => openProfile(item)} userInfo={item} />;
  };

  const EmptyComponent = (
    <View style={styles.emptyComponent}>
      <Text>Not Following anyone yet.</Text>
    </View>
  );

  return (
    <Tabs.FlatList
      contentContainerStyle={styles.flatlistContainer}
      data={followings}
      keyboardShouldPersistTaps="handled"
      keyExtractor={item => item.userId.toString()}
      ListEmptyComponent={EmptyComponent}
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

const styles = StyleSheet.create({
  flatlistContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  emptyComponent: {
    minHeight: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Followings;
