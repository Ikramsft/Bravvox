/**
 * @format
 */
import React from 'react';
import {View, HStack} from 'native-base';

import {INewsFeedData} from '../types/NewsFeedInterface';
import {timeDiffCalc, truncateUsername} from '../../../utils';
import {Title, SubTitle} from '../../../components/Typography';

import SafeTouchable from '../../../components/SafeTouchable';
import UserAvatar from '../../../components/UserAvatar';

import {GroupsFillIcon, EventsFillIcon} from '../../../assets/svg/index';
import {NavigateItemType} from './NewsFeedLayout';
import {theme} from '../../../theme';

export interface IGroupHeaderProps {
  newsFeed: INewsFeedData;
  navigateToItem: (type: NavigateItemType) => () => void;
}

function GroupHeader(props: IGroupHeaderProps) {
  const {newsFeed, navigateToItem} = props;
  const {createdAt, userInfo, groupInfo} = newsFeed;
  const {name, profilePic, influencerStatus} = userInfo;

  return (
    <View width="80%">
      <HStack alignItems="center">
        <View width="65px">
          <SafeTouchable onPress={navigateToItem('group')}>
            <UserAvatar influencerStatus={influencerStatus} profilePic={groupInfo?.avatarReadUrl} />
          </SafeTouchable>
          <View position="absolute" right="0" zIndex={99}>
            <SafeTouchable onPress={navigateToItem('profile')}>
              <UserAvatar influencerStatus={influencerStatus} profilePic={profilePic} />
            </SafeTouchable>
          </View>
        </View>
        <View ml="3">
          <SafeTouchable onPress={navigateToItem('group')}>
            <View alignItems="center" flexDirection="row">
              <GroupsFillIcon />
              <Title ml="1" numberOfLines={1}>
                {groupInfo?.name}
              </Title>
            </View>
          </SafeTouchable>
          <SafeTouchable onPress={navigateToItem('profile')}>
            <View flexDirection="row">
              <Title numberOfLines={1}>{truncateUsername(name)}</Title>
              <SubTitle ml="2">{timeDiffCalc(createdAt)}</SubTitle>
            </View>
          </SafeTouchable>
        </View>
      </HStack>
    </View>
  );
}

export interface IEventHeaderProps {
  newsFeed: INewsFeedData;
  navigateToItem: (type: NavigateItemType) => () => void;
}

function EventHeader(props: IEventHeaderProps) {
  const {newsFeed, navigateToItem} = props;
  const {createdAt, userInfo, eventInfo} = newsFeed;
  const {name, profilePic, influencerStatus} = userInfo;

  return (
    <View width="80%">
      <HStack alignItems="center">
        <View width="65px">
          <SafeTouchable onPress={navigateToItem('event')}>
            <UserAvatar influencerStatus={influencerStatus} profilePic={eventInfo?.avatarReadUrl} />
          </SafeTouchable>
          <View position="absolute" right="0" zIndex={99}>
            <SafeTouchable onPress={navigateToItem('profile')}>
              <UserAvatar influencerStatus={influencerStatus} profilePic={profilePic} />
            </SafeTouchable>
          </View>
        </View>
        <View ml="3">
          <SafeTouchable onPress={navigateToItem('event')}>
            <View alignItems="center" flexDirection="row">
              <EventsFillIcon />
              <Title ml="1" numberOfLines={1}>
                {eventInfo?.name}
              </Title>
            </View>
          </SafeTouchable>
          <SafeTouchable onPress={navigateToItem('profile')}>
            <View flexDirection="row">
              <Title numberOfLines={1}>{truncateUsername(name)}</Title>
              <SubTitle ml="2">{timeDiffCalc(createdAt)}</SubTitle>
            </View>
          </SafeTouchable>
        </View>
      </HStack>
    </View>
  );
}

export interface IProfileHeaderProps {
  newsFeed: INewsFeedData;
  navigateToItem: (type: NavigateItemType) => () => void;
}

function ProfileHeader(props: IProfileHeaderProps) {
  const {newsFeed, navigateToItem} = props;
  const {userInfo, createdAt} = newsFeed;
  const {name, profilePic, influencerStatus} = userInfo;

  return (
    <View width="70%">
      <SafeTouchable onPress={navigateToItem('profile')}>
        <HStack alignItems="center">
          <UserAvatar influencerStatus={influencerStatus} profilePic={profilePic} size={44} />
          <View ml="2">
            <Title numberOfLines={1}>{truncateUsername(name)}</Title>
            <SubTitle color={theme.colors.black[100]} fontSize="xs" mt="-1">
              {timeDiffCalc(createdAt)}
            </SubTitle>
          </View>
        </HStack>
      </SafeTouchable>
    </View>
  );
}

export {GroupHeader, EventHeader, ProfileHeader};
