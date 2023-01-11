import React from 'react';
import {View, Text, Icon, useTheme} from 'native-base';
import {StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import SafeTouchable from '../../../components/SafeTouchable';
import UserAvatar from '../../../components/UserAvatar';
import {Title} from '../../../components/Typography';
import {RootNavigationType} from '../../Home';
import {theme} from '../../../theme';
import {FollowerTypes} from '../../Profile/profileEllipseOptions';
import {useProfileOperations} from '../../Profile/Queries/useProfileOperations';

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
  followBackText: {
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'capitalize',
  },
  relationshipView: {
    padding: 0,
    marginTop: 5,
  },
});

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
    handleFollowBackUser(userId, userName, 'connectionAll');
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

function GroupCard(props: any) {
  const {colors} = useTheme();
  const item = {
    groupId: 'abc123456',
    name: 'Magic Manatee Hockey Club',
    avatarReadURL: '',
    is_private: true,
    members_count: '150k',
  };
  const navigation = useNavigation<RootNavigationType>();

  const navigateToGroupProfile = async () => {
    navigation.push('GroupProfile', {groupId: item?.groupId});
  };

  return (
    <View
      alignItems="center"
      flexDirection="row"
      style={[styles.container, {backgroundColor: colors.white}]}>
      <SafeTouchable onPress={navigateToGroupProfile}>
        <UserAvatar profilePic={item.avatarReadURL} size={54} />
      </SafeTouchable>
      <View flex={1} pl={4}>
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
        <View flexDirection="row">
          <View alignItems="center" flexDirection="row">
            <Icon
              as={<SimpleLineIcons name="lock" />}
              color={colors.black[1000]}
              mr={1}
              size={11}
            />
            <Text color={colors.black[1000]} fontSize={12} lineHeight={16}>
              Private
            </Text>
          </View>
          <View style={styles.dot} />
          <View alignItems="center" flexDirection="row">
            <Icon
              as={<SimpleLineIcons name="user" />}
              color={colors.black[1000]}
              mr={1}
              size={11}
            />
            <Text
              color={colors.black[1000]}
              fontSize={12}
              lineHeight={16}>{`${item.members_count} Members`}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default GroupCard;
