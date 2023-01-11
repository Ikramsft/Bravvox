/**
 * @format
 */
import React from 'react';
import {View, Text, HStack} from 'native-base';
import {StyleSheet} from 'react-native';
import {SubTitle, Title} from '../../../components/Typography';
import SafeTouchable from '../../../components/SafeTouchable';
import UserAvatar from '../../../components/UserAvatar';
import {IMembersData} from '../../Groups/types/GroupInterfaces';
import {theme} from '../../../theme';
import {OptionIcon} from '../../../components/Common';
import {truncateUsername} from '../../../utils';

const styles = StyleSheet.create({
  roleText: {
    color: theme.colors.black[1000],
    textAlign: 'right',
    fontSize: 12,
    textTransform: 'capitalize',
  },
});

interface GroupAdminItemProps {
  memberInfo: IMembersData;
  userId: string;
  openProfile: (item: IMembersData) => void;
  onOptionPress: (item: IMembersData) => void;
  showMenu: boolean;
}

export default function GroupAdminListItem(props: GroupAdminItemProps) {
  const {memberInfo, showMenu, openProfile, userId, onOptionPress} = props;
  const {user_id, name, userName, profilePic, role} = memberInfo;
  const onUserPress = () => openProfile(memberInfo);
  const hasOptions = showMenu && user_id !== userId;

  const handleOpen = () => onOptionPress(memberInfo);

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
            <UserAvatar mr={2} profilePic={profilePic} />
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
          <Text style={styles.roleText}>{role}</Text>
        </View>
      </View>
    </HStack>
  );
}
