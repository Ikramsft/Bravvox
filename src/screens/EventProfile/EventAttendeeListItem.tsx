/**
 * @format
 */
import React from 'react';
import {View, Text, useTheme, HStack} from 'native-base';
import {StyleSheet} from 'react-native';
import {SubTitle, Title} from '../../components/Typography';
import SafeTouchable from '../../components/SafeTouchable';
import UserAvatar from '../../components/UserAvatar';
import {EventAttendeeUserData} from './Queries/useAttendees';
import {OptionIcon} from '../../components/Common';
import {getClassNameByRelationship, truncateUsername} from '../../utils';

interface IEventAttendeeProps {
  userInfo: EventAttendeeUserData;
  userId: string;
  openProfile: (item: EventAttendeeUserData) => void;
  onOptionPress: (item: EventAttendeeUserData) => void;
  onClickMemberApprove: (item: EventAttendeeUserData) => void;
  showMenu: boolean;
}

function getAttendeeStatus(status: string) {
  switch (status) {
    case 'pending':
      return 'Approve Attendee';
    case 'did_not_respond':
      return 'Did Not Respond';
    case 'not_attending':
      return 'Not Attending';

    default:
      return status;
  }
}

export default function EventAttendeeListItem(props: IEventAttendeeProps) {
  const {userInfo, openProfile, showMenu, userId, onClickMemberApprove, onOptionPress} = props;
  const {
    userName,
    name,
    profilePicThumb,
    influencerStatus,
    user_id,
    status,
    attendeeResponseStatus,
  } = userInfo;
  const hasOptions = showMenu && user_id !== userId;
  const theme = useTheme();
  const onUserPress = () => openProfile(userInfo);
  const textStyle = getClassNameByRelationship(status);
  const handleOpen = () => onOptionPress(userInfo);
  const handlePending = () => {
    onClickMemberApprove(userInfo);
  };

  return (
    <HStack
      borderBottomColor={theme.colors.gray[100]}
      borderBottomWidth={0.5}
      flexDirection="row"
      justifyContent="space-between"
      style={styles.container}>
      <View ml="3" width="65%">
        <SafeTouchable onPress={onUserPress}>
          <HStack alignItems="center">
            <UserAvatar influencerStatus={influencerStatus} profilePic={profilePicThumb} />
            <View ml="3">
              <Title flexShrink={1} numberOfLines={1} textTransform="capitalize">
                {name}
              </Title>
              <SubTitle flexShrink={1} numberOfLines={1}>
                @{truncateUsername(userName)}
              </SubTitle>
            </View>
          </HStack>
        </SafeTouchable>
      </View>

      <View justifyContent="center" width="35%">
        <View alignItems="flex-end" mr="3">
          {hasOptions && <OptionIcon size={15} onOpen={handleOpen} />}

          {status === 'pending' && (
            <SafeTouchable onPress={handlePending}>
              <Text {...textStyle}>{getAttendeeStatus(status)}</Text>
            </SafeTouchable>
          )}
          {status === 'blocked' ? (
            <Text {...textStyle}>{getAttendeeStatus(status)}</Text>
          ) : (
            <Text {...textStyle}>{getAttendeeStatus(attendeeResponseStatus)}</Text>
          )}
        </View>
      </View>
    </HStack>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 18,
    paddingVertical: 14,
  },
  // textStyle: {
  //   textTransform: 'capitalize',
  // },
});
