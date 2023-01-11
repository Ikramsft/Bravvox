/**
 * @format
 */
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, useTheme} from 'native-base';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import {Title, SubTitle} from '../../../components/Typography';
import UserAvatar from '../../../components/UserAvatar';
import {IChannelListData} from '../types/ChatInterfaces';
import {IUserData} from '../../../redux/reducers/user/UserInterface';
import {timeDiffCalcForMessenger} from '../../../constants/common';
import SafeTouchable from '../../../components/SafeTouchable';

type Props = {
  item: IChannelListData;
  userInfo: IUserData;
  onOptionPress: (item: IChannelListData) => void;
  selected: boolean;
  onSelect: (item: IChannelListData) => void;
};

function ChatListItem(props: Props) {
  const {item, selected, userInfo, onOptionPress, onSelect} = props;

  const theme = useTheme();

  const {memebers, unReadedCount, lastMessage, messageDate} = item;
  const userDetails = memebers?.find((val: any) => val.userId !== userInfo.documentId);

  const navigateToGroupProfile = () => onSelect(item);

  const unread = unReadedCount > 0;

  const onOpen = () => onOptionPress(item);

  return (
    <TouchableOpacity onPress={navigateToGroupProfile}>
      <View
        style={[
          styles.cardContainer,
          {
            backgroundColor: selected ? theme.colors.gray[100] : theme.colors.white,
            borderBottomColor: theme.colors.gray[500],
          },
        ]}>
        <UserAvatar
          influencerStatus={userDetails?.influencerStatus}
          profilePic={userDetails?.profilePic}
        />
        {userDetails?.isOnline && (
          <View
            backgroundColor={theme.colors.green[500]}
            borderColor={theme.colors.white}
            borderRadius={6}
            borderWidth="1"
            left="18px"
            position="absolute"
            size={3}
            top="18px"
          />
        )}
        <View flex={1} mx="3">
          <View alignItems="center" flexDirection="row">
            <Title fontSize="13" fontWeight={unread ? 'bold' : 'normal'} numberOfLines={1}>
              {userDetails?.name}
            </Title>
            {unread && (
              <View backgroundColor={theme.colors.primary[1000]} borderRadius={4} ml={1} size={2} />
            )}
          </View>
          <SubTitle
            color={unread ? theme.colors.black[900] : theme.colors.gray[200]}
            fontSize="12"
            fontWeight={unread ? 'bold' : 'normal'}
            numberOfLines={1}>
            {lastMessage}
          </SubTitle>
        </View>
        <View alignItems="flex-end">
          <View alignItems="flex-end" height={25} justifyContent="center" width={25}>
            <SafeTouchable onPress={onOpen}>
              <SimpleLineIcons color="#818488" name="options" size={15} />
            </SafeTouchable>
          </View>
          <SubTitle
            color={unread ? theme.colors.black[900] : theme.colors.black[500]}
            fontSize="12"
            fontWeight={unread ? 'bold' : 'normal'}
            numberOfLines={1}>
            {timeDiffCalcForMessenger(messageDate)}
          </SubTitle>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 0.5,
  },
});

export default ChatListItem;
