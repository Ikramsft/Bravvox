import React, {useCallback, useState, useEffect, useMemo} from 'react';
import {StyleSheet, ListRenderItem} from 'react-native';
import {Spinner} from 'native-base';
import {Tabs} from 'react-native-collapsible-tab-view';
import {MemberShipStatus} from '../../Groups/Queries/useMembersList';
import {BusinessPageRoles} from '../types/BusinessInterfaces';
import {theme} from '../../../theme';
import Empty from '../../../components/EmptyComponent';
import {INavItem} from '../../../components/NavigationList';
import useUserInfo from '../../../hooks/useUserInfo';
import SearchInput from '../../../components/SearchInput';
import DropDown from './dropdown';
import {useMemberOperations} from '../../GroupProfile/Queries/useMemberOperations';
import GroupMemberListItem from '../../GroupProfile/GroupMemberListItem';
import {useBusinessMemberList} from '../Queries/useBusinessMemberList';
import {BusinessProfileScreenProps} from '..';
import {IMembersData} from '../../Groups/types/GroupInterfaces';
import MemberEllipseOptions from '../../GroupProfile/memberEllipseOptions';

interface IMembersProps extends BusinessProfileScreenProps {
  businessId: string;
  isMember: boolean;
  role?: string;
  loading: boolean;
}

const {OWNER, ADMIN} = BusinessPageRoles;
const allNavItems: INavItem[] = [
  {title: 'All', id: 'all'},
  {title: 'Approved', id: 'accepted'},
  {title: 'Approve', id: 'pending'},
  {title: 'Blocked', id: 'blocked'},
];

function Members(props: IMembersProps) {
  const {businessId, navigation, loading, role, isMember} = props;
  const {user} = useUserInfo();
  const {documentId} = user;
  const [navId, setNavId] = useState<MemberShipStatus>('');
  const [follower, setFollower] = useState<IMembersData | undefined>(undefined);
  const {onOpen, isOpen, onClose} = useMemberOperations();
  const {handleApprove} = useMemberOperations();

  const isOwner: boolean = role === OWNER;
  const isAdmin: boolean = role === ADMIN;

  useEffect(() => {
    if (isAdmin || isOwner) {
      setNavId('all');
    } else {
      setNavId('accepted');
    }
  }, [isOwner, isAdmin]);

  const canFetchMembers = !loading && isMember;
  const {
    isLoading,
    followerList = [],
    refetch,
    onEndReached,
    isFetchingNextPage,
  } = useBusinessMemberList(businessId, {status: navId}, canFetchMembers);

  const openProfile = useCallback(
    (item: IMembersData) => {
      const {user_id, userName} = item;
      navigation.push('Profile', {userName, userId: user_id});
    },
    [navigation],
  );

  const onOptionPress = useCallback(
    (item: IMembersData) => {
      setFollower(item);
      onOpen();
    },
    [onOpen],
  );

  const onClickMemberApprove = (data: IMembersData) => {
    onClose();
    handleApprove(businessId, data?.id, data?.user_id, data?.userName, navId, 'business');
  };

  const renderItem: ListRenderItem<IMembersData> = ({item}) => (
    <GroupMemberListItem
      member={item}
      memberInfo={item}
      openProfile={openProfile}
      role={role || ''}
      showMenu={isOwner || isAdmin}
      userId={documentId}
      onClickMemberApprove={onClickMemberApprove}
      onOptionPress={onOptionPress}
    />
  );

  const keyExtractor = useCallback(
    (item: IMembersData, index: number) => `business-page-member-${index}-${item.id}`,
    [],
  );

  const onNavChange = (item: INavItem) => setNavId(item.id as MemberShipStatus);

  const navItems: INavItem[] =
    isAdmin || isOwner ? allNavItems : allNavItems.filter(i => i.id === 'all');

  const selectedId = useMemo(
    () => navId && (isOwner || isAdmin ? allNavItems.filter(i => i.id === navId)?.[0]?.id : 'all'),
    [isOwner, isAdmin, navId],
  );

  return (
    <>
      <Tabs.FlatList
        data={followerList}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          isLoading ? null : <Empty title="Invite Followers to your new business page" />
        }
        ListFooterComponent={isFetchingNextPage ? <Spinner mb={20} mt={20} /> : null}
        ListHeaderComponent={
          <>
            <SearchInput
              InputRightElement={
                <DropDown
                  contentContainerStyle={styles.navContainer}
                  data={navItems}
                  selectedId={selectedId}
                  onSelect={onNavChange}
                />
              }
              placeholder="Search Members"
            />
            {loading || isLoading ? <Spinner mb={20} mt={20} /> : null}
          </>
        }
        refreshing={false}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={styles.listContainer}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        onRefresh={refetch}
      />
      <MemberEllipseOptions
        documentId={documentId}
        from="business"
        id={businessId}
        isOpen={isOpen}
        member={follower}
        navId={navId}
        role={role}
        onClose={onClose}
      />
    </>
  );
}

Members.defaultProps = {
  role: '',
};

const styles = StyleSheet.create({
  listContainer: {
    marginLeft: 0,
    marginTop: 0,
    backgroundColor: theme.colors.white,
  },
  navContainer: {
    marginHorizontal: 10,
    alignSelf: 'center',
    overflow: 'hidden',
  },
});

export default Members;
