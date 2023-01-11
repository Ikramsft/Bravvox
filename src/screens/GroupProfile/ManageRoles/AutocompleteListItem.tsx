/**
 * @format
 */
import React from 'react';
import {View, HStack} from 'native-base';
import {SubTitle, Title} from '../../../components/Typography';
import UserAvatar from '../../../components/UserAvatar';
import {IMembersData} from '../../Groups/types/GroupInterfaces';
import {theme} from '../../../theme';
import {truncateUsername} from '../../../utils';

interface AutocompleteListItemProps {
  info: IMembersData;
}

export default function AutocompleteListItem(props: AutocompleteListItemProps) {
  const {info} = props;
  const {name, userName, profilePic} = info;
  return (
    <HStack
      borderBottomColor={theme.colors.gray[100]}
      borderBottomWidth={0.5}
      flexDirection="row"
      justifyContent="space-between"
      pr="5"
      py="3.5">
      <View ml="3" width="100%">
        <View alignItems="center" flexDirection="row">
          <UserAvatar mr={2} profilePic={profilePic} />
          <View>
            <Title flexShrink={1} numberOfLines={1} textTransform="capitalize">
              {name}
            </Title>
            <SubTitle>@{truncateUsername(userName)}</SubTitle>
          </View>
        </View>
      </View>
    </HStack>
  );
}
