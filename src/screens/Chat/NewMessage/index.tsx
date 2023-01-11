/**
 * @format
 */
import React, {useCallback, useState} from 'react';
import {FlatList, ListRenderItem, StyleSheet, SafeAreaView} from 'react-native';
import {Spinner, Text, useTheme, View} from 'native-base';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {GiftedChat, InputToolbar} from 'react-native-gifted-chat';

import {RootStackParamList} from '../../../navigation';
import HeaderLeft from '../../../components/HeaderLeft';
import HeaderTitle from '../../../components/HeaderTitle';
import useUserInfo from '../../../hooks/useUserInfo';
import NewMessageItem from './NewMessageItem';
import {ISearchUser, useSearchUser} from './useSearchUser';
import SearchInput from '../../../components/SearchInput';
import {useExistingChannelList} from './useExistingChannelList';
import SafeTouchable from '../../../components/SafeTouchable';
import {Title} from '../../../components/Typography';
import useDebounce from '../../../hooks/useDebounce';
import {IDetails, useNewMessage} from './useNewMessage';
import {CustomInputToolbar, RenderAccessory} from '../InputBar';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatDetail'>;

function NewMessage(props: Props) {
  const {navigation} = props;

  const theme = useTheme();

  const {user} = useUserInfo();

  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [chatUser, setChatUser] = useState<ISearchUser>();

  React.useLayoutEffect(() => {
    const resetChatUser = () => {
      setChatUser(undefined);
      setMessage('');
    };

    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="New Message" />;
    const headerRight = () =>
      chatUser ? (
        <SafeTouchable activeOpacity={0.9} onPress={resetChatUser}>
          <Text color={theme.colors.red[900]}>Cancel</Text>
        </SafeTouchable>
      ) : null;

    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: 'center',
      headerBackVisible: false,
      headerTitle,
      headerLeft,
      headerRight,
    });
  }, [chatUser, navigation, theme.colors.red]);

  const currentChannels = useExistingChannelList();
  const debounceSearch = useDebounce(text, 500);
  const {userList = [], isLoading} = useSearchUser(user.documentId, debounceSearch);

  const {isLoading: creatingChannel, tryCreateChannelAndSendMessage} = useNewMessage();

  const onSelect = (sUser: ISearchUser) => {
    const fromChannelId = `${user.documentId}-${sUser.documentID}`;
    const toChannelId = `${sUser.documentID}-${user.documentId}`;

    const channelIndex = currentChannels.findIndex(
      c => c.channelId === fromChannelId || c.channelId === toChannelId,
    );

    if (channelIndex !== -1) {
      const item = currentChannels[channelIndex];
      navigation.replace('ChatDetail', {chatMessage: item});
    } else {
      setChatUser(sUser);
      setText('');
    }
  };

  const renderItem: ListRenderItem<ISearchUser> = ({item}) => {
    return <NewMessageItem item={item} key={item.documentID} onSelect={onSelect} />;
  };

  const keyExtractor = useCallback(
    (item: ISearchUser, index: number) => `key-${index}-${item.documentID}`,
    [],
  );

  if (chatUser) {
    const onSendPress = () => {
      // Create channel and send message
      const details: IDetails = {
        user: chatUser,
        loginUser: user,
        text: message,
      };
      tryCreateChannelAndSendMessage(details);
    };

    const renderAccessory = () => {
      const disabled = message.trim().length === 0 || creatingChannel;
      return (
        <RenderAccessory
          disabled={disabled}
          loading={creatingChannel}
          profilePic={user.profilePic}
          onSend={onSendPress}
        />
      );
    };

    const customInputToolbar = (iProps: InputToolbar['props']) => {
      return <CustomInputToolbar {...iProps} disabled={creatingChannel} />;
    };

    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.white}]}>
        <View
          borderBottomColor={theme.colors.black[300]}
          borderBottomWidth={0.5}
          flexDirection="row"
          px={2}
          py={3}>
          <Title color={theme.colors.black[300]} ml={3}>
            To:
          </Title>
          <Title ml={3} textTransform="capitalize">
            {chatUser.name}
          </Title>
        </View>
        <GiftedChat
          inverted={false}
          keyboardShouldPersistTaps="handled"
          messages={[]}
          renderAccessory={renderAccessory}
          renderInputToolbar={customInputToolbar}
          renderMessage={() => null}
          renderSend={() => null}
          text={message}
          user={{...chatUser, _id: chatUser.documentID}}
          onInputTextChanged={setMessage}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.white}]}>
      <FlatList
        data={userList}
        keyboardShouldPersistTaps="handled"
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <>
            <SearchInput
              placeholder="Search for Followers and Following"
              value={text}
              onChangeText={setText}
            />
            {isLoading && <Spinner mt={2} />}
          </>
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: theme.colors.white}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default NewMessage;
