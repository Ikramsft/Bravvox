/**
 * @format
 */
import React from 'react';
import {View, Text, HStack} from 'native-base';
import {SubTitle, Title} from '../../components/Typography';
import SafeTouchable from '../../components/SafeTouchable';
import UserAvatar from '../../components/UserAvatar';
import {IMembersData} from '../Groups/types/GroupInterfaces';
import {theme} from '../../theme';
import {OptionIcon} from '../../components/Common';
import {getClassNameByRelationship, truncateUsername} from '../../utils';

interface GroupMemberItemProps {
  memberInfo: IMembersData;
  userId: string;
  openProfile: (item: IMembersData) => void;
  onOptionPress: (item: IMembersData) => void;
  onClickMemberApprove: (item: IMembersData) => void;
  showMenu: boolean;
  member: IMembersData;
  role: string;
  id?: string; // This can be groupId, businessId, eventId in future
}

function getGroupStatus(status: string) {
  switch (status) {
    case 'pending':
      return 'Approve Member';

    default:
      return status;
  }
}

export default function GroupMemberListItem(props: GroupMemberItemProps) {
  const {memberInfo, showMenu, openProfile, userId, onClickMemberApprove, onOptionPress} = props;
  const {user_id, name, userName, status, profilePicThumb,influencerStatus} = memberInfo;
  const onUserPress = () => openProfile(memberInfo);
  const hasOptions = showMenu && user_id !== userId;
  const textStyle = getClassNameByRelationship(status);

  const handleOpen = () => onOptionPress(memberInfo);
  const handlePending = () => {
    onClickMemberApprove(memberInfo);
  };

  return (
    <HStack
      borderBottomColor={theme.colors.gray[100]}
      borderBottomWidth={0.5}
      flexDirection="row"
      justifyContent="space-between"
      pr="5"
      py="3.5">
      <View ml="3" width="65%">
        <SafeTouchable onPress={onUserPress}>
          <View alignItems="center" flexDirection="row">
            <UserAvatar influencerStatus={influencerStatus} mr={2}  profilePic={profilePicThumb}/>
            <View>
              <Title flexShrink={1} numberOfLines={1} textTransform="capitalize">
                {name}
              </Title>
              <SubTitle flexShrink={1} numberOfLines={1}>
                @{truncateUsername(userName)}
              </SubTitle>
            </View>
          </View>
        </SafeTouchable>
      </View>
      <View justifyContent="center" width="35%">
        <View alignItems="flex-end">
          {hasOptions && <OptionIcon size={15} onOpen={handleOpen} />}
          {status === 'pending' ? (
            <SafeTouchable onPress={handlePending}>
              <Text {...textStyle}>{getGroupStatus(status)}</Text>
            </SafeTouchable>
          ) : (
            <Text {...textStyle}>{getGroupStatus(status)}</Text>
          )}
        </View>
      </View>
    </HStack>
  );
}
GroupMemberListItem.defaultProps = {
  id: '',
};
