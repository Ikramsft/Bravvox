import React from 'react';
import {View, Text, Icon, useTheme} from 'native-base';
import {StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import SafeTouchable from '../../../components/SafeTouchable';
import UserAvatar from '../../../components/UserAvatar';
import {RootNavigationType} from '..';
import {SubTitle, Title} from '../../../components/Typography';
import {useProfileOperations} from '../../Profile/Queries/useProfileOperations';
import {FollowerTypes} from '../../Profile/profileEllipseOptions';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  const {item, searchParams} = props;
  const {handleApprove, handleFollowBackUser, handleFollow, handleUnfollow, handleCancel} =
    useProfileOperations(searchParams);

  const userId = item?.documentID;
  const userName = item?.username;

  const cancelRequest = () => {
    Keyboard.dismiss();
    handleCancel(userId, userName);
  };

  const followUser = () => {
    Keyboard.dismiss();
    handleFollow(userId, userName);
  };

  const unFollowUser = () => {
    Keyboard.dismiss();
    handleUnfollow(userId, userName);
  };

  const ApproveUser = () => {
    Keyboard.dismiss();
    handleApprove(userId, userName, 'profile');
  };

  const FollowBack = () => {
    Keyboard.dismiss();
    handleFollowBackUser(userId, userName);
  };
  // const textStyle = getClassNameByRelationship(item?.relationship);

  switch (item?.relationship?.toLowerCase()) {
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
      return (
        <TouchableOpacity activeOpacity={0.8} style={styles.relationshipView} onPress={followUser}>
          <Text color="blue.500" style={styles.followBackText}>
            {FOLLOW}
          </Text>
        </TouchableOpacity>
      );
    case 'unfollow':
    case 'following':
    case 'following me':
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
    case 'follow back':
      return (
        <TouchableOpacity activeOpacity={0.8} style={styles.relationshipView} onPress={FollowBack}>
          <Text color="blue.500" style={styles.followBackText}>
            {FOLLOW_BACK}
          </Text>
        </TouchableOpacity>
      );
    case 'approve follower':
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
  const {item, searchParams} = props;
  const {colors} = useTheme();
  const navigation = useNavigation<RootNavigationType>();

  const navigateToProfile = async () => {
    Keyboard.dismiss();
    navigation.navigate('Profile', {userName: item?.username, userId: item?.documentID});
  };

  const dismissKeyboard = () => Keyboard.dismiss();

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View
        alignItems="center"
        flexDirection="row"
        style={[styles.container, {backgroundColor: colors.white}]}>
        <SafeTouchable onPress={navigateToProfile}>
          <UserAvatar profilePic={item.avatar} size={54} />
        </SafeTouchable>
        <View flex={1} mr={4} pl={4}>
          <TouchableOpacity onPress={navigateToProfile}>
            <Title
              color={colors.black[1000]}
              flexShrink={1}
              fontSize={12}
              lineHeight={16}
              marginBottom={1}
              numberOfLines={1}
              textTransform="capitalize">
              {item.name}
            </Title>
          </TouchableOpacity>

          {item.username ? (
            <View flex={1} flexDirection="row" mb={1}>
              <SubTitle
                color={colors.black[1000]}
                fontSize={12}
                numberOfLines={1}>{`@${item.username}`}</SubTitle>
            </View>
          ) : null}
            <View flex={1} flexDirection="row">
              {item.location?.length > 0 ? (
                <View alignItems="center" flex={1} flexDirection="row" mr={4}>
                  <Icon
                    as={<SimpleLineIcons name="location-pin" />}
                    color={colors.black[1000]}
                    mr={1}
                    size={11}
                  />
                  <Text color={colors.black[1000]} fontSize={12} numberOfLines={1}>
                    {item?.location || ''}
                  </Text>
                </View>
              ) : null}
              {item.location?.length > 0 && <View style={styles.dot} />}
                <View alignItems="center" flex={1} flexDirection="row">
                  <Icon
                    as={<SimpleLineIcons name="user" />}
                    color={colors.black[1000]}
                    mr={1}
                    size={11}
                  />
                  <Text color={colors.black[1000]} fontSize={12} numberOfLines={1}>{`${
                    item.total_followers
                  } Follower${item.total_followers > 1 ? 's' : ''}`} in Common</Text>
                </View>
            </View>
        </View>
        <View alignItems="center">
          <RelationShipButton item={item} searchParams={searchParams} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default UserCard;
