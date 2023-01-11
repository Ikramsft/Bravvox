import React, {useCallback, useState, useEffect, useMemo} from 'react';
import {StyleSheet, ListRenderItem, Keyboard} from 'react-native';
import {Spinner} from 'native-base';
import {Tabs} from 'react-native-collapsible-tab-view';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {GroupProfileScreenProps} from '.';
import {useMemberList} from '../Groups/Queries/useMembersList';
import {GroupRoles, IMembersData} from '../Groups/types/GroupInterfaces';
import GroupMemberListItem from './GroupMemberListItem';
import {RootStackParamList} from '../../navigation';
import {theme} from '../../theme';
import Empty from '../../components/EmptyComponent';
import {INavItem} from '../../components/NavigationList';
import useUserInfo from '../../hooks/useUserInfo';
import {useMemberOperations} from './Queries/useMemberOperations';
import MemberEllipseOptions from './memberEllipseOptions';
import SearchInput from '../../components/SearchInput';
import DropDown from '../BusinessProfile/Tabs/dropdown';
import {MemberShipStatus} from '../../utils/types';

interface IMembersProps extends GroupProfileScreenProps {
  groupId: string;
  navigation: NativeStackNavigationProp<RootStackParamList, 'GroupProfile'>;
  loading: boolean;
  role?: string;
  isMember: boolean;
  isPrivate: boolean;
}

const {OWNER, ADMIN} = GroupRoles;
const allNavItems: INavItem[] = [
  {title: 'All', id: 'all'},
  {title: 'Approved', id: 'accepted'},
  {title: 'Approve', id: 'pending'},
  {title: 'Blocked', id: 'blocked'},
];

function Members(props: IMembersProps) {
  const {groupId, navigation, loading, role, isMember, isPrivate} = props;
  const {user} = useUserInfo();
  const {documentId} = user;
  const [navId, setNavId] = useState<MemberShipStatus>('');
  const [member, setMember] = useState<IMembersData | undefined>(undefined);
  const {onOpen, isOpen, onClose, handleApprove} = useMemberOperations();

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
    memberList = [],
    refetch,
    onEndReached,
    isFetchingNextPage,
  } = useMemberList(groupId, {status: navId}, (!isPrivate || canFetchMembers) && navId !== '');

  const openProfile = useCallback(
    (item: IMembersData) => {
      const {user_id, userName} = item;
      navigation.push('Profile', {userName, userId: user_id});
    },
    [navigation],
  );

  const onOptionPress = useCallback(
    (item: IMembersData) => {
      Keyboard.dismiss();
      setMember(item);
      onOpen();
    },
    [onOpen],
  );

  const onClickMemberApprove = (data: IMembersData) => {
    onClose();
    handleApprove(groupId, data?.id, data?.user_id, data?.userName, navId, 'group');
  };

  const renderItem: ListRenderItem<IMembersData> = ({item}) => (
    <GroupMemberListItem
      id={groupId}
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
    (item: IMembersData, index: number) => `group-member-${index}-${item.id}`,
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
        data={memberList}
        keyboardShouldPersistTaps="handled"
        keyExtractor={keyExtractor}
        ListEmptyComponent={isLoading ? null : <Empty title="No Members yet.." />}
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
        from="group"
        id={groupId}
        isOpen={isOpen}
        member={member}
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
