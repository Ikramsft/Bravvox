/**
 * @format
 */
import React, {useRef, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Spinner} from 'native-base';
import {GiftedChat, MessageProps, InputToolbar} from 'react-native-gifted-chat';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {RootStackParamList} from '../../../navigation';
import useUserInfo from '../../../hooks/useUserInfo';
import {IUserData} from '../../../redux/reducers/user/UserInterface';
import {TextItem} from './TextItem';
import {theme} from '../../../theme';
import HeaderTitle from '../../../components/HeaderTitle';
import HeaderLeft from '../../../components/HeaderLeft';
import {useReadConversation} from './useReadConversation';
import {IConversionInfo, useConversationList} from './useConversationList';
import {IChannelMessage} from '../types/ChatInterfaces';
import MessageOptions, {MsgOptionHandle} from './MessageOptions';
import {useSocket} from '../../../socket/useSocket';
import DeleteMsgDialog from './DeleteMsgDialog';
import {IDeleteMessage, useDeleteMessage} from './useDeleteMessage';
import ReportAbuseDialog from '../../Home/NewsFeed/ReportAbuseDialog';
import {CustomInputToolbar, RenderAccessory} from '../InputBar';

export interface IChatUser extends IUserData {
  _id: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'ChatDetail'>;

function ChatDetail(props: Props) {
  const {navigation, route} = props;

  const {user} = useUserInfo();

  const msgOptions = React.useRef<MsgOptionHandle>(null);

  const [message, setMessage] = useState<IChannelMessage>();
  const [text, setText] = useState('');
  const [sending, setSending] = useState<boolean>();
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [isReportOpen, setReportOpen] = useState<boolean>(false);

  const {chatMessage} = route.params;
  const {channelId, memebers} = chatMessage;

  const memberDetails = memebers?.find((val: any) => val.userId !== user.documentId);

  const {tryReadConversation} = useReadConversation();

  const info: IConversionInfo = {channelId, member: memberDetails, loggedInUser: user};
  const {data: messages, isLoading} = useConversationList(info);

  const {isLoading: isDeleting, tryDeleteMessage} = useDeleteMessage();

  const chatRef = useRef<GiftedChat<IChannelMessage>>(null);

  const {sendMessage} = useSocket();

  React.useLayoutEffect(() => {
    const maxLength = 30;
    const title =
      memberDetails?.name && memberDetails?.name.length >= maxLength
        ? `${memberDetails?.name.slice(0, maxLength)}...`
        : memberDetails?.name;

    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle textTransform="none" title={title} />;

    navigation.setOptions({
      headerShown: true,
      headerTitle,
      headerLeft,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerRight: () => null,
    });
  }, [memberDetails?.name, navigation]);

  useEffect(() => {
    // Added this patch for CON-21233 to make conversation read on received/sent msg
    if (messages?.length) {
      tryReadConversation(channelId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages?.length]);

  const onOptionPress = (msg: IChannelMessage) => {
    setMessage(msg);
    msgOptions.current?.showOptions(!msg.self);
  };

  const renderMessage = (msg: MessageProps<IChannelMessage>) => {
    const selected = msg.currentMessage?.id === message?.id;
    return <TextItem {...msg} selected={selected} onOptionPress={onOptionPress} />;
  };

  const onSendPress = async () => {
    try {
      setSending(true);
      console.log('text-->', text);
      await sendMessage(channelId, text);
      const tm = setTimeout(() => {
        setText('');
        chatRef.current?.resetInputToolbar();
        setSending(false);
        clearTimeout(tm);
      }, 500);
    } catch (error) {
      setSending(false);
    }
  };

  const chatUser: IChatUser = {...user, _id: user.documentId};

  const renderAccessory = () => {
    const disabled = text.trim().length === 0;
    return (
      <RenderAccessory
        disabled={disabled}
        loading={sending}
        profilePic={user.profilePic}
        onSend={onSendPress}
      />
    );
  };

  const customInputToolbar = (iProps: InputToolbar['props']) => {
    return <CustomInputToolbar {...iProps} disabled={sending} />;
  };

  const onSelectAbuse = (reason: string) => {
    onCloseOptions();
    console.log('onSelectAbuse->', reason);
  };

  const onSelectDelete = () => {
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = (choice: string) => {
    if (message) {
      const onDeleteSuccess = () => {
        setDeleteOpen(false);
        onCloseOptions();
      };
      const deleteInfo: IDeleteMessage = {
        messageId: message.id,
        channelId: message.channel,
        choice,
        onSuccess: onDeleteSuccess,
      };
      tryDeleteMessage(deleteInfo);
    }
  };

  const handleDeleteClose = () => {
    onCloseOptions();
    setDeleteOpen(false);
  };

  const handleReportClose = () => {
    onCloseOptions();
    setReportOpen(false);
  };

  const handleReportAbuse = () => {
    onCloseOptions();
    setReportOpen(false);
  };

  const onCloseOptions = () => setMessage(undefined);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.white}]}>
      {isLoading ? <Spinner mt={2} /> : null}
      <GiftedChat<IChannelMessage>
        inverted={false}
        keyboardShouldPersistTaps="always"
        messages={messages}
        ref={chatRef}
        renderAccessory={renderAccessory}
        renderInputToolbar={customInputToolbar}
        renderMessage={renderMessage}
        renderSend={() => null}
        text={text}
        user={chatUser}
        onInputTextChanged={setText}
      />
      <MessageOptions
        ref={msgOptions}
        onCloseOptions={onCloseOptions}
        onSelectAbuse={onSelectAbuse}
        onSelectDelete={onSelectDelete}
      />
      <DeleteMsgDialog
        handleClose={handleDeleteClose}
        handleSubmit={handleDeleteConfirm}
        isLoading={isDeleting}
        open={isDeleteOpen}
      />
      <ReportAbuseDialog
        handleClose={handleReportClose}
        handleSubmit={handleReportAbuse}
        open={isReportOpen}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatDetail;
