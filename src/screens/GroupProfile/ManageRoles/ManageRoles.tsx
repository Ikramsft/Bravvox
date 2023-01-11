/**
 * @format
 */
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useQueryClient} from 'react-query';
import {useMemberList} from '../../Groups/Queries/useMembersList';
import {GroupRoles} from '../../Groups/types/GroupInterfaces';
import {RootStackParamList} from '../../../navigation';
import useUserInfo from '../../../hooks/useUserInfo';
import {useGroupProfile} from '../Queries/useGroupDetail';
import {useBusinessProfile} from '../../BusinessProfile/Queries/useBusinessDetail';
import {useBusinessMemberList} from '../../BusinessProfile/Queries/useBusinessMemberList';
import MemberList from './memberList';
import HeaderLeft from '../../../components/HeaderLeft';
import HeaderTitle from '../../../components/HeaderTitle';
import {useEventProfile} from '../../EventProfile/Queries/useEventProfile';
import {useAttendees} from '../../EventProfile/Queries/useAttendees';
import {EventRoles} from '../../Events/types/EventInterfaces';

export type ManageRolesScreenProps = NativeStackScreenProps<RootStackParamList, 'ManageRoles'>;

const {OWNER, ADMIN} = GroupRoles;
const {OWNER: EOWNER, ADMIN: EADMIN} = EventRoles;

function ManageRoles(props: ManageRolesScreenProps) {
  const {route, navigation} = props;
  const {id, from} = route.params || '';
  const {user} = useUserInfo();
  const queryClient = useQueryClient();
  const {documentId: userId} = user;

  const {data: profile} = useGroupProfile(id, from === 'group');
  const {data: bProfile} = useBusinessProfile(id, from === 'business');
  const {data: eProfile} = useEventProfile(id, from === 'event');

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const title = from === 'group' ? profile?.data?.name : bProfile?.data?.name;
    const headerTitle = () => (
      <HeaderTitle title={title ?? ''} titleTextProps={{textTransform: 'none'}} />
    );

    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: 'center',
      headerBackVisible: false,
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [id, navigation, profile, bProfile, eProfile, queryClient, from]);

  const {
    isLoading,
    memberList = [],
    refetch,
    onEndReached,
    isFetchingNextPage,
  } = useMemberList(id, {role: [OWNER, ADMIN]}, from === 'group');

  const {
    isLoading: FollowerLoading,
    followerList = [],
    refetch: bRefetch,
    onEndReached: bOnEndReached,
    isFetchingNextPage: bIsFetchingNextPage,
  } = useBusinessMemberList(id, {role: [OWNER, ADMIN]}, from === 'business');

  const {
    isLoading: attendeesLoading,
    attendeeList,
    refetch: eRefetch,
    onEndReached: eOnEndReached,
    isFetchingNextPage: eIsFetchingNextPage,
  } = useAttendees(id, {role: [EOWNER, EADMIN], status: 'accepted'}, from === 'event', true);

  return from === 'group' ? (
    <MemberList
      from={from}
      id={id}
      isFetchingNextPage={isFetchingNextPage}
      isLoading={isLoading}
      list={memberList}
      navigation={navigation}
      refetch={refetch}
      userId={userId}
      onEndReached={onEndReached}
    />
  ) : from === 'event' ? (
    <MemberList
      from={from}
      id={id}
      isFetchingNextPage={eIsFetchingNextPage}
      isLoading={attendeesLoading}
      list={attendeeList}
      navigation={navigation}
      refetch={eRefetch}
      userId={userId}
      onEndReached={eOnEndReached}
    />
  ) : (
    <MemberList
      from={from}
      id={id}
      isFetchingNextPage={bIsFetchingNextPage}
      isLoading={FollowerLoading}
      list={followerList}
      navigation={navigation}
      refetch={bRefetch}
      userId={userId}
      onEndReached={bOnEndReached}
    />
  );
}

ManageRoles.defaultProps = {
  role: OWNER,
};

export default ManageRoles;
