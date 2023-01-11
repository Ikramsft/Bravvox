import React from 'react';
import {View, Text, Icon, useTheme} from 'native-base';
import {StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import SafeTouchable from '../../../components/SafeTouchable';
import UserAvatar from '../../../components/UserAvatar';
import {SubTitle, Title} from '../../../components/Typography';
import {useProfileOperations} from '../../Profile/Queries/useProfileOperations';
import {FollowerTypes} from '../../Profile/profileEllipseOptions';
import {RootNavigationType} from '../../Home';
import {theme} from '../../../theme';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomColor: theme.colors.gray[500],
    borderBottomWidth: 0.6,
  },
  dot: {
    height: 2,
    width: 2,
    borderRadius: 1,
    paddingHorizontal: 5,
  },
  relationshipView: {
    padding: 0,
    marginTop: 5,
  },
  followBackText: {
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'capitalize',
  },
});

interface RelationShipButton {
  item?: any;
}

const {FOLLOW, UNFOLLOW, CANCEL_REQUEST, FOLLOW_BACK, APPROVE_FOLLOWER} = FollowerTypes;

function RelationShipButton(props: any) {
  const {item, searchParams, from} = props;
  const {handleApprove, handleFollowBackUser, handleFollow, handleUnfollow, handleCancel} =
    useProfileOperations(searchParams);

  const userId = item?.userId;
  const userName = item?.userName;
  const sortId = item?.sortId;
  const processingId = item?.processingId;

  const cancelRequest = () => {
    Keyboard.dismiss();
    handleCancel(userId, userName);
  };

  const followUser = () => {
    Keyboard.dismiss();
    handleFollow(userId, userName, '', from, sortId, processingId);
  };

  const unFollowUser = () => {
    Keyboard.dismiss();
    handleUnfollow(userId, userName, '', from, sortId, processingId);
  };

  const ApproveUser = () => {
    Keyboard.dismiss();
    handleApprove(userId, userName, '', from, sortId, processingId);
  };

  const FollowBack = () => {
    Keyboard.dismiss();
    handleFollowBackUser(userId, userName, from, sortId, processingId);
  };

  switch (item?.type?.toLowerCase()) {
    case 'requested':
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.relationshipView}
          onPress={cancelRequest}>
          <Text color="gray.300" style={styles.followBackText}>
            {CANCEL_REQUEST}
          </Text>
        </TouchableOpacity>
      );
    case 'none':
    case 'follow':
    case 'commonfollower':
      return (
        <TouchableOpacity activeOpacity={0.8} style={styles.relationshipView} onPress={followUser}>
          <Text color="blue.500" style={styles.followBackText}>
            {FOLLOW}
          </Text>
        </TouchableOpacity>
      );
    case 'unfollow':
    case 'following':
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.relationshipView}
          onPress={unFollowUser}>
          <Text color="red.900" style={styles.followBackText}>
            {UNFOLLOW}
          </Text>
        </TouchableOpacity>
      );
    case 'follower':
    case 'followingme':
    case 'followback':
      return (
        <TouchableOpacity activeOpacity={0.8} style={styles.relationshipView} onPress={FollowBack}>
          <Text color="blue.500" style={styles.followBackText}>
            {FOLLOW_BACK}
          </Text>
        </TouchableOpacity>
      );
    case 'approvefollower':
      return (
        <TouchableOpacity activeOpacity={0.8} style={styles.relationshipView} onPress={ApproveUser}>
          <Text color="red.900" style={styles.followBackText}>
            {APPROVE_FOLLOWER}
          </Text>
        </TouchableOpacity>
      );
    default:
      return null;
  }
}

function UserCard(props: any) {
  const {item, searchParams, from} = props;
  const {colors} = useTheme();
  const navigation = useNavigation<RootNavigationType>();

  const navigateToProfile = async () => {
    Keyboard.dismiss();
    navigation.navigate('Profile', {userName: item?.userName, userId: item?.userId});
  };

  const dismissKeyboard = () => Keyboard.dismiss();

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View
        alignItems="center"
        flexDirection="row"
        style={[styles.container, {backgroundColor: colors.white}]}>
        <SafeTouchable onPress={navigateToProfile}>
          <UserAvatar profilePic={item.profilePic} size={54} />
        </SafeTouchable>
        <View flex={1} mr={4} pl={4}>
          <TouchableOpacity onPress={navigateToProfile}>
            <Title
              color={colors.black[1000]}
              flexShrink={1}
              fontSize={14}
              lineHeight={16}
              marginBottom={1}
              numberOfLines={1}
              textTransform="capitalize">
              {item.name}
            </Title>
          </TouchableOpacity>

          <View flex={1} flexDirection="row">
            {item.userName ? (
              <View flex={0.2}>
                <SubTitle
                  color={colors.black[1000]}
                  fontSize={12}
                  numberOfLines={1}>{`@${`${item.userName}`}`}</SubTitle>
              </View>
            ) : null}

            {item.count > 0 && <View style={styles.dot} />}

            <View flex={0.8} flexDirection="row">
              <Icon
                as={<SimpleLineIcons name="user" />}
                color={colors.black[1000]}
                mr={1}
                size={14}
              />
              <Text color={colors.black[1000]} fontSize={13} numberOfLines={1}>{`${
                item.count
              } Follower${item.count > 1 ? 's' : ''} in Common`}</Text>
            </View>
          </View>
        </View>
        <View alignItems="center">
          <RelationShipButton from={from} item={item} searchParams={searchParams} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default UserCard;
