import {useNavigation} from '@react-navigation/native';
import {HStack, View, Text, IInputProps} from 'native-base';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {RootNavigationType} from '../screens/Home';
import {FromApprove} from '../screens/Home/NewsFeed/useFollowActions';
import {FollowerUserData} from '../screens/Profile/Queries/useFollowers';
import {theme} from '../theme';
import {getClassNameByRelationship} from '../utils';
import {OptionIcon} from './Common';
import SafeTouchable from './SafeTouchable';
import {SubTitle, Title} from './Typography';
import UserAvatar from './UserAvatar';

interface IFollowerItem {
  item: FollowerUserData;
  ownProfile: boolean;
  profileId?: string;
  onOptionPress?: (item: FollowerUserData) => void;
  handleApprove: (userId: string, userName: string, from: FromApprove, profileId?: string) => void;
  handleFollowBackUser: (userId: string, userName: string) => void;
  handleFollow: (userId: string, userName: string) => void;
  handleUnfollow: (userId: string, userName: string, profileId: string) => void;
  handleUnBlock: (userId: string, userName: string, profileId: string) => void;
}
interface IRelationElement {
  item: FollowerUserData;
  relationStatus: string;
  textStyle: IInputProps;
  ownProfile: boolean;
  profileId: string;
  handleFollow: (userId: string, userName: string, profileId: string) => void;
  handleUnfollow: (userId: string, userName: string, profileId: string) => void;
}

function RelationElement(props: IRelationElement) {
  const {item, relationStatus, textStyle, ownProfile, profileId, handleFollow} = props;
  const {userName, userId} = item;

  return ownProfile || relationStatus.toLowerCase() === 'requested' ? (
    <View style={styles.relationshipView}>
      {relationStatus !== 'Blocked' && <Text {...textStyle}>{relationStatus}</Text>}
    </View>
  ) : relationStatus.toLowerCase() === 'follow back' ||
    relationStatus.toLowerCase() === 'follow' ? (
    <TouchableOpacity
      style={styles.relationshipView}
      onPress={() => {
        handleFollow(userId || '', userName, profileId);
      }}>
      <View style={styles.relationshipView}>
        <Text style={styles.followBackText}>{relationStatus}</Text>
      </View>
    </TouchableOpacity>
  ) : (
    <View style={styles.relationshipView}>
      <Text style={styles.relationshipView}>{relationStatus}</Text>
    </View>
  );
}
function RelationShipButton(props: IFollowerItem) {
  const {
    item,
    ownProfile,
    profileId,
    handleFollowBackUser,
    handleUnfollow,
    handleUnBlock,
    handleApprove,
    handleFollow,
  } = props;

  const FOLLOW_BACK = 'followback';
  const {userName, documentId, relationship, userId} = item;
  const isFollowBack = relationship?.trim().toLowerCase().replace(' ', '') === FOLLOW_BACK;
  const textStyle = getClassNameByRelationship(relationship);
  const relationStatus = relationship;
  return (
    <View>
      <View style={styles.rightView}>
        {/* {relationship?.toLowerCase() === 'unfollow' && 
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.relationshipView}
            onPress={() =>  handleUnfollow(userId || '', userName)}>
            <Text style={styles.followBackText}>{relationStatus}</Text>
          </TouchableOpacity>} */}

        {isFollowBack && ownProfile ? (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.relationshipView}
            onPress={() => handleFollowBackUser(userId || '', userName)}>
            <Text style={styles.followBackText}>{relationStatus}</Text>
          </TouchableOpacity>
        ) : relationship?.toLowerCase() === 'approve follower' ||
          relationship?.toLowerCase() === 'unfollow' ? (
          <TouchableOpacity
            style={styles.relationshipView}
            onPress={() => {
              if (relationship?.toLowerCase() === 'unfollow') {
                handleUnfollow(userId || '', userName, profileId || '');
              } else {
                handleApprove(userId, userName, ownProfile ? 'profile' : 'list', profileId);
              }
            }}>
            <Text {...textStyle}>{relationStatus}</Text>
          </TouchableOpacity>
        ) : relationship?.toLowerCase() === 'unblock' ? (
          <TouchableOpacity
            style={styles.relationshipView}
            onPress={() => {
              handleUnBlock(userId || '', userName, profileId || '');
            }}>
            <Text style={styles.followBackText}>{relationStatus}</Text>
          </TouchableOpacity>
        ) : (
          <RelationElement
            handleFollow={handleFollow}
            handleUnfollow={handleUnfollow}
            item={item}
            ownProfile={ownProfile}
            profileId={profileId || ''}
            relationStatus={relationStatus}
            textStyle={textStyle}
          />
        )}
      </View>
    </View>
  );
}

function FollowerListItem(props: IFollowerItem) {
  const navigation = useNavigation<RootNavigationType>();
  const {
    item,
    profileId,
    ownProfile,
    onOptionPress,
    handleApprove,
    handleFollowBackUser,
    handleFollow,
    handleUnfollow,
    handleUnBlock,
  } = props;

  const handleOpen = () => {
    if (typeof onOptionPress === 'function') {
      onOptionPress(item);
    }
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
        <SafeTouchable
          onPress={() => {
            const {userName, userId} = item;
            navigation.push('Profile', {userName, userId: userId || ''});
          }}>
          <View alignItems="center" flexDirection="row">
            <UserAvatar
              influencerStatus={item.influencerStatus}
              mr={2}
              profilePic={item.profilePicURL}
            />
            <View>
              <Title flexShrink={1} numberOfLines={1} textTransform="capitalize">
                {item.name}
              </Title>
              <SubTitle>@{item.userName}</SubTitle>
            </View>
          </View>
        </SafeTouchable>
      </View>
      <View justifyContent="center" width="35%">
        <View alignItems="flex-end">
          {item.relationship?.toLowerCase() !== '' &&
            item.relationship?.toLowerCase() !== 'unblock' && (
              <OptionIcon size={15} onOpen={handleOpen} />
            )}
          <RelationShipButton
            handleApprove={handleApprove}
            handleFollow={handleFollow}
            handleFollowBackUser={handleFollowBackUser}
            handleUnBlock={handleUnBlock}
            handleUnfollow={handleUnfollow}
            item={item}
            ownProfile={ownProfile}
            profileId={profileId}
          />
        </View>
      </View>
    </HStack>
  );
}

const styles = StyleSheet.create({
  rightView: {
    justifyContent: 'center',
  },
  relationshipView: {
    padding: 0,
    marginTop: 5,
    fontSize: 12,
  },
  followBackText: {
    fontSize: 12,
    color: theme.colors.blue[500],
    textTransform: 'capitalize',
  },
});
FollowerListItem.defaultProps = {
  profileId: '',
  onOptionPress: () => {
    //
  },
};
RelationShipButton.defaultProps = {
  profileId: '',
  onOptionPress: () => {
    //
  },
};
export default FollowerListItem;
