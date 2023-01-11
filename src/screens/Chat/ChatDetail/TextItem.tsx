/**
 * @format
 */
import React from 'react';
import {StyleSheet} from 'react-native';
import {IInputProps, ITextProps, Text, View, useTheme} from 'native-base';
import {Day, MessageProps} from 'react-native-gifted-chat';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';
import moment from 'moment';

import {Title, SubTitle} from '../../../components/Typography';
import {IChannelMessage} from '../types/ChatInterfaces';
import UserAvatar from '../../../components/UserAvatar';
import {timeDiffCalc} from '../../../utils/index';
import {OptionIcon} from '../../../components/Common';

interface ChatItemProps extends MessageProps<IChannelMessage> {
  onOptionPress: (msg: IChannelMessage) => void;
  selected: boolean;
}

function TextItem(props: ChatItemProps) {
  const {currentMessage, nextMessage, previousMessage, onOptionPress, selected} = props;

  const theme = useTheme();

  if (currentMessage) {
    const {text, user, _id, createdAt, isDeleted} = currentMessage;
    const sent = false; // Changed to false instead of real value as per 21069 point 3
    const direction = sent ? 'row-reverse' : 'row';

    const msgContainer: IViewProps = {flex: 1, justifyContent: 'space-between', ml: 3};
    if (sent) {
      msgContainer.flexDirection = 'row-reverse';
    } else {
      msgContainer.flexDirection = 'row';
    }

    const msgTxtStyle: ITextProps = {textAlign: sent ? 'right' : 'left'};

    const timeTextStyle: IInputProps = {};
    if (sent) {
      timeTextStyle.mr = 3;
    } else {
      timeTextStyle.ml = 3;
    }

    const onOpen = () => onOptionPress(currentMessage);

    const Content = isDeleted ? (
      <Text
        italic
        alignSelf={sent ? 'flex-end' : 'flex-start'}
        fontSize="sm"
        textAlign={sent ? 'right' : 'left'}
        width="80%">
        This message has been deleted and no longer available.
      </Text>
    ) : (
      <View flexDirection={direction} key={`txt-${_id}`} my={3}>
        <UserAvatar profilePic={user.avatar as string} style={styles.avatar} />
        <View {...msgContainer}>
          <View flex={1}>
            <View flexDirection={direction}>
              <Title flex={1} numberOfLines={1}>
                {user.name}
              </Title>
              <SubTitle {...timeTextStyle}>{moment(createdAt).format('h:mm A')}</SubTitle>
            </View>
            <Text {...msgTxtStyle}>{text}</Text>
          </View>
          <OptionIcon size={15} onOpen={onOpen} />
        </View>
      </View>
    );

    return (
      <View backgroundColor={selected ? theme.colors.gray[100] : theme.colors.white} px={5}>
        <Day
          containerStyle={styles.dayContainerStyle}
          currentMessage={currentMessage}
          dateFormat="dddd, MMM D"
          nextMessage={nextMessage}
          previousMessage={previousMessage}
          textStyle={[styles.dayStyle, {color: theme.colors.gray[200]}]}
        />
        {Content}
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    flex: 0.1,
  },
  dayStyle: {
    fontFamily: 'DM Sans Medium',
    fontSize: 11,
  },
  dayContainerStyle: {
    paddingTop: 12,
  },
});
export {TextItem};
