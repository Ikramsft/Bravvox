/**
 * @format
 */
import React from 'react';
import {View, Text, useTheme, HStack} from 'native-base';
import {GestureResponderEvent, StyleSheet} from 'react-native';
import {IFollowings} from '../Home/types/NewsFeedInterface';
import {Title} from '../../components/Typography';
import SafeTouchable from '../../components/SafeTouchable';
import UserAvatar from '../../components/UserAvatar';
import {getClassNameByRelationship, truncateUsername} from '../../utils';

interface IFollowingsProps {
  userInfo: IFollowings;
  openProfile: ((event: GestureResponderEvent) => void) | undefined;
}

export default function FollowingListItem(props: IFollowingsProps) {
  const {userInfo, openProfile} = props;
  const {userName, relationship, profilePicThumb, influencerStatus} = userInfo;
  const textStyle = getClassNameByRelationship(relationship);

  const theme = useTheme();

  return (
    <HStack
      borderBottomColor={theme.colors.gray[100]}
      borderBottomWidth={0.5}
      flexDirection="row"
      justifyContent="space-between"
      style={styles.container}>
      <SafeTouchable onPress={openProfile}>
        <HStack alignItems="center">
          <UserAvatar influencerStatus={influencerStatus} profilePic={profilePicThumb} />
          <View ml="3">
            <Title>{truncateUsername(userName)}</Title>
          </View>
        </HStack>
      </SafeTouchable>
      <View justifyContent="center">
        <Text color="#818488" fontSize={12} textAlign="right" {...textStyle}>
          {relationship}
        </Text>
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
});
