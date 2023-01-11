import React from 'react';
import {View, Text, Icon, useTheme} from 'native-base';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import SafeTouchable from '../../../components/SafeTouchable';
import UserAvatar from '../../../components/UserAvatar';
import {RootNavigationType} from '..';
import {Title} from '../../../components/Typography';
import {useGroupMember} from '../../GroupProfile/Queries/useGroupMember';
import {useGroupMemberCheck} from '../../GroupProfile/Queries/useGroupMemberCheck';
import {useGroupProfile} from '../../GroupProfile/Queries/useGroupDetail';
import {GroupMemberStatus, GroupRoles} from '../../Groups/types/GroupInterfaces';

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
  joinText: {
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'capitalize',
  },
  relationshipView: {
    padding: 0,
    marginTop: 5,
  },
});

const {DEFAULT} = GroupRoles;
const {PENDING} = GroupMemberStatus;

function GroupCard(props: any) {
  const {colors} = useTheme();
  const {item} = props;
  const navigation = useNavigation<RootNavigationType>();

  const {isLoading, data: profile} = useGroupProfile(item.documentID);
  const isPrivate = !isLoading && profile?.error && profile.status === 403;
  const checkMember = !isLoading && !isPrivate;
  const {data: dataMember} = useGroupMemberCheck(item.documentID, checkMember);
  const {handleJoinGroupActivity, handleCancelRequestActivity} = useGroupMember();

  // const isMember =
  //   dataMember?.data?.status === ACCEPTED &&
  //   [OWNER, ADMIN, DEFAULT].includes(dataMember?.data?.role as GroupRoles);

  // const isInviteeOfPrivateGroup = isPrivate && dataMember?.data?.status === INVITED;

  const isPending: boolean =
    dataMember?.data?.role === DEFAULT && dataMember?.data?.status === PENDING;

  const navigateToGroupProfile = async () => {
    navigation.push('GroupProfile', {groupId: item?.documentID});
  };

  const onFollow = () => handleJoinGroupActivity(item.documentID);
  const onCancel = () => handleCancelRequestActivity(item.documentID, dataMember?.data?.id);

  return (
    <View
      alignItems="center"
      flexDirection="row"
      style={[styles.container, {backgroundColor: colors.white}]}>
      <SafeTouchable onPress={navigateToGroupProfile}>
        <UserAvatar profilePic={item.avatar} size={54} />
      </SafeTouchable>
      <View flex={1} pl={4}>
        <TouchableOpacity onPress={navigateToGroupProfile}>
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
        <View flexDirection="row">
          <View alignItems="center" flexDirection="row">
            <Icon
              as={<SimpleLineIcons name="lock" />}
              color={colors.black[1000]}
              mr={1}
              size={11}
            />
            <Text color={colors.black[1000]} fontSize={12} lineHeight={16}>
              {item.status}
            </Text>
          </View>
          <View style={styles.dot} />
          {item.memberCount > 0 ? (
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
                lineHeight={16}>{`${item.memberCount} Members`}</Text>
            </View>
          ) : (
            <View alignItems="center" flexDirection="row" />
          )}
        </View>
      </View>
      <View alignItems="center">
        {item.userRelationship !== 'none' ? (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.relationshipView}
            onPress={isPending ? onCancel : () => null}>
            <Text>{item.userRelationship}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity activeOpacity={0.8} style={styles.relationshipView} onPress={onFollow}>
            <Text color="blue.500" style={styles.joinText}>
              Join
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default GroupCard;
