/**
 * @format
 */
import React from 'react';
import {View, Text, useTheme, HStack} from 'native-base';
import {StyleSheet} from 'react-native';
import {SubTitle, Title} from '../../components/Typography';
import SafeTouchable from '../../components/SafeTouchable';
import UserAvatar from '../../components/UserAvatar';
import {INotificationData} from './Types/NoticiationInterface';
import {timeDiffCalc} from '../../utils';

interface INotificationProps {
  notification: INotificationData;
  openProfile: ((userName: string, userId: string) => void) | undefined;
  onPressMsg: (selected: INotificationData) => void;
}

interface ICommonMessage {
  notification: INotificationData;
  msg: string;
  openProfile: (() => void) | undefined;
  onPressMsg: (selected: INotificationData) => void;
}
const trimString = (string: string) => {
  const maxLength =  16;
  return string?.length > maxLength ? `${string.substring(0, maxLength)}...` : string;
};

function CommonMessage(params: ICommonMessage) {
  const {notification, openProfile, onPressMsg, msg} = params;
  const {username} = notification;
  const handlePressMsg = () => {
    onPressMsg?.(notification);
  };
  return (
    <SafeTouchable onPress={handlePressMsg}>
      <View flexDirection="row">
        <SafeTouchable onPress={openProfile}>
          <Title>{trimString(username)}</Title>
        </SafeTouchable>
        <SubTitle>{msg}</SubTitle>
      </View>
    </SafeTouchable>
  );
}

function NotificationElement(props: INotificationProps) {
  const {notification: notificationProp, openProfile, onPressMsg} = props;
  const theme = useTheme();
  const {
    senderPicThumb,
    groupPicThumb,
    posterProfilePicThumb,
    eventThumbPic,
    userPicThumb,
    notificationAt,
    type,
  } = notificationProp;
  const handleOnpressProfile = () => {
    const userName =
      notificationProp?.username ||
      notificationProp?.posterName ||
      notificationProp?.inviterUsername;
    const userId =
      notificationProp?.senderId || notificationProp?.posterId || notificationProp?.inviterId;

    if (type === 27) {
      onPressMsg?.(notificationProp);
      return;
    }

    if (type === 20 || type === 13) {
      openProfile?.(userId, userName);
      return;
    }
    if (userId && userName) {
      openProfile?.(userName, userId);
    }
  };

  const getNotificationText = (notification: INotificationData) => {
    switch (notification.type) {
      case 1:
        return (
          <CommonMessage
            msg=" has requested to follow you"
            notification={notification}
            openProfile={handleOnpressProfile}
            onPressMsg={onPressMsg}
          />
        );
      case 2:
        return (
          <CommonMessage
            msg=" is following you"
            notification={notification}
            openProfile={handleOnpressProfile}
            onPressMsg={onPressMsg}
          />
        );
      case 3:
        return (
          <CommonMessage
            msg=" sent you a message"
            notification={notification}
            openProfile={handleOnpressProfile}
            onPressMsg={onPressMsg}
          />
        );
      case 4:
        return (
          <CommonMessage
            msg=" has created a new post"
            notification={notification}
            openProfile={handleOnpressProfile}
            onPressMsg={onPressMsg}
          />
        );
      case 5:
        return (
          <CommonMessage
            msg=" comments on your post"
            notification={notification}
            openProfile={handleOnpressProfile}
            onPressMsg={onPressMsg}
          />
        );
      case 6:
      case 7:
        return (
          <CommonMessage
            msg=" reacted to your post"
            notification={notification}
            openProfile={handleOnpressProfile}
            onPressMsg={onPressMsg}
          />
        );
      case 8:
        return (
          <CommonMessage
            msg=" revoxed your post"
            notification={notification}
            openProfile={handleOnpressProfile}
            onPressMsg={onPressMsg}
          />
        );
      case 9:
        return (
          <Text>
            <SubTitle>Post has reached </SubTitle>
            <Title>{notification.milestoneAmount} </Title>
            <SubTitle>comments</SubTitle>
          </Text>
        );
      case 10:
        return (
          <Text>
            <SubTitle>Post has reached </SubTitle>
            <Title>{notification.milestoneAmount} </Title>
            <SubTitle>Reactions</SubTitle>
          </Text>
        );
      case 11:
        return (
          <Text>
            <SubTitle>Post has reached</SubTitle>
            <Title>{notification.milestoneAmount} </Title>
            <SubTitle>Revoxes</SubTitle>
          </Text>
        );
      case 12:
        return (
          <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
            <Text>
              <Title>{trimString(notification.groupName)} </Title>
              <SubTitle>created a new post.</SubTitle>
            </Text>
          </SafeTouchable>
        );
      case 13:
        return (
          <View flexDirection="row" flexWrap="wrap">
            <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
              <Title>Group {trimString(notification.groupName)} </Title>
              <SubTitle>has a new post from </SubTitle>
            </SafeTouchable>
            <SafeTouchable onPress={handleOnpressProfile}>
              <Title>{trimString(notification.posterName)}</Title>
            </SafeTouchable>
          </View>
        );
      case 14:
        return (
          <View flexDirection="row" flexWrap="wrap">
            <SafeTouchable style={styles.row} onPress={handleOnpressProfile}>
              <Title>{trimString(notification.inviterName)} </Title>
            </SafeTouchable>
            <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
              <SubTitle>has invited you to join </SubTitle>
              <Title>{trimString(notification.groupName)}</Title>
            </SafeTouchable>
          </View>
        );
      case 15:
        return (
          <Text>
            <SubTitle>Congratulations to </SubTitle>
            <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
              <Title>{trimString(notification.groupName)} </Title>
            </SafeTouchable>
            <SubTitle> ! A group post </SubTitle>
            <Title>{notification.milestoneAmount}</Title>
            <SubTitle> comments</SubTitle>
          </Text>
        );
      case 16:
        return (
          <Text>
            <SubTitle>Congratulations to </SubTitle>
            <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
              <Title>{trimString(notification.groupName)} </Title>
            </SafeTouchable>
            <SubTitle> ! A group post </SubTitle>
            <Title>{notification.milestoneAmount}</Title>
            <SubTitle> members</SubTitle>
          </Text>
        );
      case 17:
        return (
          <Text>
            <SubTitle>Congratulations to </SubTitle>
            <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
              <Title>{trimString(notification.groupName)} </Title>
            </SafeTouchable>
            <SubTitle>! A group post </SubTitle>
            <Title>{notification.milestoneAmount}</Title>
            <SubTitle> reactions</SubTitle>
          </Text>
        );
      case 18:
        return (
          <Text>
            <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
              <Title>{trimString(notification.groupName)}</Title>
            </SafeTouchable>
            <SubTitle> has a post that has been revoxed </SubTitle>
            <Title>{notification.milestoneAmount}</Title>
            <SubTitle> times!</SubTitle>
          </Text>
        );
      case 19:
        return (
          <Text>
            <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
              <Title>Group {trimString(notification.groupName)}</Title>
            </SafeTouchable>
            <SubTitle> has added a new</SubTitle>
            <SubTitle> Event </SubTitle>
            <Title>{trimString(notification.eventTitle)}</Title>
          </Text>
        );
      case 20:
        return (
          <View flexDirection="row" flexWrap="wrap" >
            <SafeTouchable style={styles.row} onPress={handleOnpressProfile}>
              <Title>{trimString(notification.inviterUsername)} </Title>
            </SafeTouchable>
            <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
              <SubTitle> has invited you to join</SubTitle>
            </SafeTouchable>
            <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
              <Title> {trimString(notification.eventTitle)}</Title>
            </SafeTouchable>
          </View>
        );
      case 21:
        return (
          <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
            <Text>
              <Title>{trimString(notification.eventTitle)} </Title>
              <SubTitle> has posted new content.</SubTitle>
            </Text>
          </SafeTouchable>
        );
      case 22:
        return (
          <View flexDirection="row">
            <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
              <Title>{trimString(notification.eventTitle)} </Title>
            </SafeTouchable>
            <SubTitle> has a new post by </SubTitle>
            <SafeTouchable style={styles.row} onPress={handleOnpressProfile}>
              <Title>{trimString(notification.posterName)}</Title>
            </SafeTouchable>
          </View>
        );
      case 23:
        return (
          <CommonMessage
            msg=" reacted to your post."
            notification={notification}
            openProfile={handleOnpressProfile}
            onPressMsg={onPressMsg}
          />
        );
      case 24:
        return (
          <Text>
            <SafeTouchable style={styles.row} onPress={handleOnpressProfile}>
              <Title>{trimString(notification.posterName)} </Title>
            </SafeTouchable>
            <SubTitle> commented on your post</SubTitle>
            <SubTitle> in the event </SubTitle>
            <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
              <Title>{trimString(notification.eventTitle)}</Title>
            </SafeTouchable>
          </Text>
        );
      case 25:
        return (
          <View flexDirection="row">
            <SafeTouchable style={styles.row} onPress={handleOnpressProfile}>
              <Title>{trimString(notification.username)}</Title>
            </SafeTouchable>
            <SubTitle> revoxed the event</SubTitle>
            <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
              <Title> {trimString(notification.eventTitle)}</Title>
            </SafeTouchable>
          </View>
        );
      case 26:
        return (
          <View flexDirection="row" style={styles.row}>
            <SafeTouchable style={styles.row} onPress={handleOnpressProfile}>
              <Title>{trimString(notification.username)}</Title>
            </SafeTouchable>
            <SubTitle> revoxed post</SubTitle>
            <SafeTouchable style={styles.row} onPress={handleOnpressProfile}>
              <Title>{trimString(notification.postName)}</Title>
            </SafeTouchable>
            <SubTitle> in event</SubTitle>
            <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
              <Title>{trimString(notification.eventTitle)}</Title>
            </SafeTouchable>
          </View>
        );

      case 27:
        return (
          <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
            <SubTitle>Date/Time of the event</SubTitle>
            <SafeTouchable onPress={() => onPressMsg(notification)}>
              <Title> {trimString(notification.eventTitle)} </Title>
            </SafeTouchable>
            <SubTitle>has been changed</SubTitle>
          </SafeTouchable>
        );
      case 28:
        return (
          <Text>
            Location of the event
            <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
              <Title> {trimString(notification.eventTitle)}</Title>
            </SafeTouchable>
            has been changed
          </Text>
        );
      case 29:
        return (
          <Text>
            <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
              <Title>{trimString(notification.username)}</Title>
            </SafeTouchable>
            tagged you in a <Title>post</Title>
          </Text>
        );
      case 30:
        return (
          <>
            <SubTitle>Your content has been suspended for violating our </SubTitle>
            <Text>'Terms & Conditions'</Text>
          </>
        );
      case 31:
        return (
          <Text>
            <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
              <Title>{trimString(notification.eventTitle)}</Title>
            </SafeTouchable>
            has been canceled.
          </Text>
        );
      case 32:
        return (
          <Text>
            <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
              <Title>{trimString(notification.username)} </Title>
            </SafeTouchable>
            accepted your event invitation.
          </Text>
        );
      case 33:
        return (
          <Text>
            <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
              <Title>{trimString(notification.username)} </Title>
            </SafeTouchable>
            declined your event invitatio.
          </Text>
        );
      case 34:
        return (
          <Text>
            <SafeTouchable style={styles.row} onPress={() => onPressMsg(notification)}>
              <Title>{trimString(notification.username)}</Title>
            </SafeTouchable>
            maybe attend your event invitation.
          </Text>
        );
      case 35:
        return (
          <Text>
            <SafeTouchable style={styles.row} onPress={handleOnpressProfile}>
              <Title>{trimString(notification.inviteeUsername)}</Title>
            </SafeTouchable>{' '}
            has invited you to follow
            <Title> {trimString(notification.businessPageTitle)}</Title>
          </Text>
        );
      case 36:
        return (
          <Text>
            <Title>{trimString(notification.businessPageTitle)}</Title> created a new post.
          </Text>
        );
      case 37:
        return (
          <Text>
            <Title>{trimString(notification.businessPageTitle)}</Title> has added a new Event
          </Text>
        );
      case 38:
        return (
          <Text>
            <Title>{trimString(notification?.username)}</Title> has reacted to your
            <Title>{trimString(notification.businessPageTitle)}</Title> Post
          </Text>
        );
      case 39:
        return (
          <Text>
            <Title>{trimString(notification.username)}</Title> commented on your
            <Title> {trimString(notification.businessPageTitle)}</Title> Post
          </Text>
        );
      case 40:
        return (
          <Text>
            <Title>{trimString(notification?.username)} </Title>
            revoxed your
            <Title> {trimString(notification.businessPageTitle)}</Title> Post
          </Text>
        );

      default:
        return null;
    }
  };
  return (
    <SafeTouchable onPress={() => onPressMsg(notificationProp)}>
      <HStack
        backgroundColor={theme.colors.appWhite[600]}
        borderBottomColor={theme.colors.gray[100]}
        borderBottomWidth={2}
        flexDirection="row"
        justifyContent="space-between"
        style={styles.container}>
        <HStack alignItems="center">
          <SafeTouchable onPress={handleOnpressProfile}>
            <UserAvatar
              profilePic={
                senderPicThumb ||
                groupPicThumb ||
                posterProfilePicThumb ||
                eventThumbPic ||
                userPicThumb
              }
            />
          </SafeTouchable>

          <View ml="3" mr={5} pr={10}>
            {getNotificationText(notificationProp)}
            <SubTitle>{timeDiffCalc(notificationAt)}</SubTitle>
          </View>
        </HStack>
      </HStack>
    </SafeTouchable>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingVertical: 14,
  },
  row: {flexDirection: 'row', flexWrap: 'wrap'},
});
export default NotificationElement;
