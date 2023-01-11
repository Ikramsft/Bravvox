import React, {useCallback, useMemo, useState, useEffect} from 'react';
import {StyleSheet, ListRenderItem, View, Keyboard} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import {Spinner, Text} from 'native-base';
import {FollowerUserData, useFollowers} from './Queries/useFollowers';
import {theme} from '../../theme';
import {ProfileScreenProps} from './index';
import FollowerListItem from '../../components/FollowerListItem';
import {IArrayData, INavItem} from '../../components/NavigationList';
import SearchInput from '../../components/SearchInput';
import ProfileDropDown from '../BusinessProfile/Tabs/ProfileDropdown';
import {FollowType, FromType} from '../../utils/types';
import {useProfileOperations} from './Queries/useProfileOperations';
import FollowerEllipseOptions from './followerEllipseOptions';

interface IFollowerProps extends ProfileScreenProps {
  userId: string;
  ownProfile: boolean;
}
function filterByUserStatus(status: string, data: IArrayData[]) {
  return data.map(d => {
    const newObj = {...d};
    newObj.data = newObj.data.filter(s => s.title === status);
    return newObj;
  });
}
function Followers(props: IFollowerProps) {
  const [mainData, setMainData] = React.useState<IArrayData[]>([
    {
      title: 'Followers',
      isActive: true,
      data: [
        {title: 'All', id: 'followed', from: 'followed'},
        {title: 'Following', id: 'following', from: 'followed'},
        {title: 'Not Following', id: 'not_following', from: 'followed'},
        {title: 'Approve Followers', id: 'approve_followers', from: 'followed'},
        {title: 'Blocked', id: 'blocked', from: 'followed'},
      ],
    },
    {
      title: 'Following',
      isActive: false,
      data: [
        {title: 'All', id: 'all', from: 'following'},
        {title: 'Following me', id: 'following_me', from: 'following'},
        {title: 'Not following me', id: 'not_following_me', from: 'following'},
        {title: 'Requested', id: 'requested', from: 'following'},
      ],
    },
  ]);

  const {userId, ownProfile} = props;
  const [navId, setNavId] = useState<FollowType>('followed');
  const [fromIdType, setFromIdType] = useState<FromType>('followed');
  const [follower, setFollower] = useState<FollowerUserData | undefined>(undefined);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const {
    onOpen,
    isOpen,
    onClose,
    handleApprove,
    handleFollowBackUser,
    handleFollow,
    handleUnBlock,
    handleUnfollow,
  } = useProfileOperations();

  const {
    followerList = [],
    isLoading,
    refetch,
    isFetchingNextPage,
    onEndReached,
  } = useFollowers(userId, navId, fromIdType);

  const onOptionPress = useCallback(
    (item: FollowerUserData) => {
      Keyboard.dismiss();
      setFollower(item);
      onOpen();
    },
    [onOpen],
  );

  const renderItem: ListRenderItem<FollowerUserData> = ({item}: {item: FollowerUserData}) => {
    return (
      <FollowerListItem
        handleApprove={handleApprove}
        handleFollow={handleFollow}
        handleFollowBackUser={handleFollowBackUser}
        handleUnBlock={handleUnBlock}
        handleUnfollow={handleUnfollow}
        item={item}
        ownProfile={ownProfile}
        profileId={userId}
        onOptionPress={onOptionPress}
      />
    );
  };

  const keyExtractor = useCallback(
    (item: FollowerUserData, index: number) => `key-${index}-${item.documentId}-`,
    [],
  );

  useEffect(() => {
    refetch();
    if (!ownProfile) {
      const filterOptions = filterByUserStatus('All', mainData);
      setMainData(filterOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navId, refetch]);

  const selectedId = useMemo(
    () => navId && mainData[currentIndex].data?.filter(i => i.id === navId)?.[0]?.id,
    [currentIndex, mainData, navId],
  );

  const onNavChange = (item: INavItem) => {
    setNavId(item.id as FollowType);
    setFromIdType(item.from as FromType);
    if (item.from === 'following') {
      setCurrentIndex(1);
    } else {
      setCurrentIndex(0);
    }
  };
  const onPressOption = (item: IArrayData, index: number) => {
    if (!item.isActive) {
      mainData[index].isActive = true;
      if (index === 1) {
        mainData[0].isActive = false;
      } else {
        mainData[1].isActive = false;
      }
      setMainData([...mainData]);
    }
  };

  const EmptyComponent = (
    <View style={styles.emptyComponent}>
      {navId === 'followed' || navId === 'not_following' ? <Text>No Followers yet.</Text> : null}
      {navId === 'following' && <Text>Not Following anyone yet.</Text>}
      {navId === 'approve_followers' && <Text>Approvals are up to date.</Text>}
      {navId === 'blocked' && <Text>No one is Blocked.</Text>}
      {fromIdType === 'following' && navId !== 'requested' && <Text>No followings yet.</Text>}
      {navId === 'requested' && <Text>All Requests are approved.</Text>}
    </View>
  );

  if (isLoading) {
    return <Spinner mb={20} mt={20} />;
  }

  return (
    <>
      <Tabs.FlatList
        contentContainerStyle={styles.content}
        data={followerList}
        keyboardShouldPersistTaps="handled"
        keyExtractor={keyExtractor}
        ListEmptyComponent={EmptyComponent}
        ListFooterComponent={isFetchingNextPage ? <Spinner mb={20} mt={20} /> : null}
        ListHeaderComponent={
          <>
            <SearchInput
              containerStyle={styles.searchHeight}
              InputRightElement={
                <ProfileDropDown
                  contentContainerStyle={styles.navContainer}
                  currentIndex={currentIndex}
                  data={mainData}
                  selectedId={selectedId}
                  onPress={onPressOption}
                  onSelect={onNavChange}
                />
              }
              placeholder="Search"
            />
            {isLoading ? <Spinner mb={20} mt={20} /> : null}
          </>
        }
        refreshing={isLoading}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        onRefresh={refetch}
      />
      <FollowerEllipseOptions
        follower={follower}
        isOpen={isOpen}
        profileId={!ownProfile ? userId : ''}
        onClose={onClose}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
    paddingBottom: 50,
  },
  emptyComponent: {
    minHeight: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navContainer: {
    marginHorizontal: 10,
    alignSelf: 'center',
    overflow: 'hidden',
    borderWidth: 0,
  },
  searchHeight: {
    height: 60,
  },
});

export default Followers;
