import React, { useEffect, useMemo, useState} from 'react';
import { ListRenderItem, StyleSheet} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {GroupProfileScreenProps} from '.';
import {GroupRoles} from '../Groups/types/GroupInterfaces';
import {RootStackParamList} from '../../navigation';
import {theme} from '../../theme';
import {INavItem} from '../../components/NavigationList';
import SearchInput from '../../components/SearchInput';
import DropDown from '../BusinessProfile/Tabs/dropdown';
import {MemberShipStatus} from '../../utils/types';
import EventMemberListItem from './EventMemberItem';

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

function Events(props: IMembersProps) {
  const {groupId, navigation, loading, role, isMember, isPrivate} = props;
  const [navId, setNavId] = useState<MemberShipStatus>('');

  const isOwner: boolean = role === OWNER;
  const isAdmin: boolean = role === ADMIN;

  useEffect(() => {
    if (isAdmin || isOwner) {
      setNavId('all');
    } else {
      setNavId('accepted');
    }
  }, [isOwner, isAdmin]);

  const renderItem: ListRenderItem<number> = () => <EventMemberListItem />;

  const onNavChange = (item: INavItem) => setNavId(item.id as MemberShipStatus);

  const navItems: INavItem[] =
    isAdmin || isOwner ? allNavItems : allNavItems.filter(i => i.id === 'all');

  const selectedId = useMemo(
    () => navId && (isOwner || isAdmin ? allNavItems.filter(i => i.id === navId)?.[0]?.id : 'all'),
    [isOwner, isAdmin, navId],
  );

  return (
    <Tabs.FlatList
      data={[1, 2, 3, 4, 5]}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <SearchInput
          InputRightElement={
            <DropDown
              contentContainerStyle={styles.navContainer}
              data={navItems}
              selectedId={selectedId}
              onSelect={onNavChange}
            />
          }
          placeholder="Search Events"
        />
      }
      refreshing={false}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      style={styles.listContainer}
      onEndReachedThreshold={0.5}
    />
  );
}
Events.defaultProps = {
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
export default Events;
