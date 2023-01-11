import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Spinner} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {ListRenderItem, StyleSheet} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import Empty from '../../components/EmptyComponent';
import {INavItem} from '../../components/NavigationList';
import SearchInput from '../../components/SearchInput';
import useUserInfo from '../../hooks/useUserInfo';
import {RootStackParamList} from '../../navigation';
import {theme} from '../../theme';
import DropDown from '../BusinessProfile/Tabs/dropdown';
import {EventMemberFilterStatus, EventRoles, INewEventData} from '../Events/types/EventInterfaces';
import EventAttendeeListItem from './EventAttendeeListItem';
import EventAttendeeEllipseOptions from './eventAttendeeOptions';
import {EventProfileScreenProps} from './index';
import {useAttendeeOperations} from './Queries/useAttendeeOperations';
import {EventAttendeeUserData, useAttendees} from './Queries/useAttendees';

interface IAttendeesProps extends EventProfileScreenProps {
  data: INewEventData | undefined;
  navigation: NativeStackNavigationProp<RootStackParamList, 'EventProfile'>;
  role: string;
  isMember: boolean;
  isPrivate: boolean;
  loading: boolean;
}
const {OWNER, ADMIN} = EventRoles;

const allNavItems: INavItem[] = [
  {title: 'All', id: 'all', from: ''},
  {title: 'Attendees', id: 'accepted', from: ''},
  {title: 'Not Attending', id: 'not attending', from: ''},
  {title: 'Maybe', id: 'maybe', from: ''},
  {title: 'Did Not Respond', id: 'did not respond', from: ''},
  {title: 'Approve Attendees', id: 'pending', from: ''},
  {title: 'Blocked', id: 'blocked', from: ''},
];

function Attendees(props: IAttendeesProps) {
  const {data, navigation, role, isMember, isPrivate, loading} = props;
  const {user} = useUserInfo();
  const {documentId} = user;
  const [navId, setNavId] = useState<EventMemberFilterStatus>('');
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

  const {attendeeList, isLoading, isFetchingNextPage, onEndReached, refetch} = useAttendees(
    data?.id || '',
    {status: navId || ''},
    (!isPrivate || canFetchMembers) && navId !== '',
  );
  const [attendee, setAttendee] = useState<EventAttendeeUserData | undefined>(undefined);
  const {onOpen, onClose, isOpen, handleApprove} = useAttendeeOperations({status: navId || ''});

  const openProfile = useCallback(
    (item: EventAttendeeUserData) => {
      const {user_id, userName} = item;
      navigation.push('Profile', {userName, userId: user_id});
    },
    [navigation],
  );

  const onOptionPress = useCallback(
    (item: EventAttendeeUserData) => {
      setAttendee(item);
      onOpen();
    },
    [onOpen],
  );

  const keyExtractor = useCallback(
    (item: EventAttendeeUserData, index: number) => `event-attendee-${index}-${item.id}`,
    [],
  );

  const onNavChange = (item: INavItem) => setNavId(item.id as EventMemberFilterStatus);

  const selectedId = React.useMemo(
    () => navId && (isOwner || isAdmin ? allNavItems.filter(i => i.id === navId)?.[0]?.id : 'all'),
    [isOwner, isAdmin, navId],
  );

  const navItems: INavItem[] =
    isAdmin || isOwner ? allNavItems : allNavItems.filter(i => i.id === 'all');

  const onClickMemberApprove = (member: EventAttendeeUserData) => {
    onClose();
    handleApprove(member?.user_id, member.userName, data?.id || '');
  };

  const renderItem: ListRenderItem<EventAttendeeUserData> = ({item}) => {
    return (
      <EventAttendeeListItem
        openProfile={openProfile}
        showMenu={data?.owner?.user_id === documentId}
        userId={documentId}
        userInfo={item}
        onClickMemberApprove={onClickMemberApprove}
        onOptionPress={onOptionPress}
      />
    );
  };

  return (
    <>
      <Tabs.FlatList
        contentContainerStyle={styles.content}
        data={attendeeList}
        keyboardShouldPersistTaps="handled"
        keyExtractor={keyExtractor}
        ListEmptyComponent={isLoading ? null : <Empty title="No Attendees yet.." />}
        ListFooterComponent={isFetchingNextPage ? <Spinner mb={20} mt={20} /> : null}
        // ListHeaderComponent={isLoading ? <Spinner mb={20} mt={20} /> : null}
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
              placeholder="Search Attendee"
            />
            {/* {loading || isLoading ? <Spinner mb={20} mt={20} /> : null} */}
          </>
        }
        refreshing={false}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        onRefresh={refetch}
      />

      <EventAttendeeEllipseOptions
        eventId={data?.id || ''}
        filter={{status: navId || ''}}
        // documentId={documentId}
        isOpen={isOpen}
        member={attendee}
        onClose={onClose}
      />
    </>
  );
}

export default Attendees;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    minHeight: 1000,
  },
  navContainer: {
    marginHorizontal: 10,
    alignSelf: 'center',
    overflow: 'hidden',
  },
});
