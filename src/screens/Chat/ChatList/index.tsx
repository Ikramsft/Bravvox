/**
 * @format
 */
import React, {useCallback, useState, useMemo} from 'react';
import {FlatList, ListRenderItem} from 'react-native';
import {Spinner, View, Text, useTheme} from 'native-base';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

import {RootStackParamList} from '../../../navigation';
import ChatListItem from './ChatListItem';
import {IChannelListData} from '../types/ChatInterfaces';
import SearchInput from '../../../components/SearchInput';
import HeaderLeft from '../../../components/HeaderLeft';
import HeaderTitle from '../../../components/HeaderTitle';
import {useChannelList} from './useChannelList';
import useUserInfo from '../../../hooks/useUserInfo';
import FloatingButton from '../../../components/FloatingButton';
import {BravvoxBIcon} from '../../../assets/svg/index';
import MessageListOptions, {MsgListOptionHandle} from './MessageListOptions';
import {IConversationOperation, useToggleMuteConversation} from './useToggleMuteConversation';
import {useConfirmModal} from '../../../components/CofirmationModel';
import {Title} from '../../../components/Typography';
import {useDeleteConversation} from './useDeleteConversation';
import {OptionIcon} from '../../../components/Common';
import Empty from '../../../components/EmptyComponent';
import {ProfileStatusOptions} from './ProfileStatusOptions';
import {updateOnlineIndicator} from '../../../redux/reducers/user/UserActions';
import {useUpdateViewed} from './useUpdateViewed';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatDetail'>;

function ChatList(props: Props) {
  const {navigation} = props;
  const dispatch = useDispatch();

  const theme = useTheme();

  const {user, documentId} = useUserInfo();

  const confirm = useConfirmModal();

  const msgOptions = React.useRef<MsgListOptionHandle>(null);

  const [showOption, setShowOption] = React.useState(false);

  React.useLayoutEffect(() => {
    const toggleShowOption = () => setShowOption(s => !s);

    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Messenger" />;
    const headerRight = () => <OptionIcon size={15} onOpen={toggleShowOption} />;

    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: 'center',
      headerBackVisible: false,
      headerTitle,
      headerLeft,
      headerRight,
    });
  }, [navigation]);

  const {tryUpdateViewed} = useUpdateViewed();

  React.useEffect(() => {
    tryUpdateViewed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(updateOnlineIndicator(false));
    }, [dispatch]),
  );

  const {channelList = [], isLoading, refetch, isFetchingNextPage, onEndReached} = useChannelList();

  const [chatItem, setChatItem] = useState<IChannelListData>();
  const [text, setText] = useState('');

  const {tryToggleMuteConversation} = useToggleMuteConversation();
  const {tryDeleteConversation} = useDeleteConversation();

  const onOptionPress = (item: IChannelListData) => {
    setChatItem(item);
    msgOptions.current?.showOptions();
  };

  const onSelect = (item: IChannelListData) => {
    setText('');
    navigation.push('ChatDetail', {chatMessage: item});
  };

  const renderItem: ListRenderItem<IChannelListData> = ({item}) => {
    const selected = chatItem?.channelId === item.channelId;
    return (
      <ChatListItem
        item={item}
        key={item.channelId}
        selected={selected}
        userInfo={user}
        onOptionPress={onOptionPress}
        onSelect={onSelect}
      />
    );
  };

  const keyExtractor = useCallback(
    (item: IChannelListData, index: number) => `key-${index}-${item.channelId}`,
    [],
  );

  const onNewMsgPress = () => navigation.push('NewMessage');

  const onSelectBlock = () => setChatItem(undefined);

  const onSelectDelete = () => {
    if (chatItem) {
      const onConfirm = () => {
        tryDeleteConversation(chatItem?.channelId);
        setChatItem(undefined);
      };
      const onCancel = () => setChatItem(undefined);
      confirm?.show?.({
        title: <Title fontSize={18}>Delete Conversation</Title>,
        message: <Text>Once you delete your copy of this conversation, it cannot be undone.</Text>,
        onConfirm,
        onCancel,
        submitLabel: 'Delete',
        cancelLabel: 'Cancel',
      });
    }
  };

  const onToggleMute = () => {
    if (chatItem) {
      const info: IConversationOperation = {
        reqType: chatItem.isMuted ? 'unmute' : 'mute',
        channelId: chatItem.channelId,
      };
      tryToggleMuteConversation(info);
      setChatItem(undefined);
    }
  };

  const onCloseOptions = () => setChatItem(undefined);

  const filterData = useMemo(() => {
    return text.length < 3
      ? channelList
      : channelList.filter(channel =>
          text.length < 3
            ? true
            : channel.memebers.findIndex(
                m => m.userId !== documentId && m.name.toLowerCase().includes(text.toLowerCase()),
              ) !== -1,
        );
  }, [text, channelList, documentId]);

  return (
    <>
      <FlatList
        data={filterData}
        keyboardShouldPersistTaps="handled"
        keyExtractor={keyExtractor}
        ListEmptyComponent={!isLoading && text.length >= 3 ? <Empty title="No Data Found" /> : null}
        ListFooterComponent={isFetchingNextPage ? <Spinner mb={4} mt={4} /> : null}
        ListHeaderComponent={
          <View>
            <ProfileStatusOptions showOption={showOption} />
            <SearchInput
              placeholder="Search In Messages"
              placeholderTextColor={theme.colors.black[300]}
              returnKeyType="search"
              value={text}
              onChangeText={setText}
            />
            {isLoading && <Spinner mt={2} />}
          </View>
        }
        refreshing={false}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: theme.colors.white}}
        onEndReached={onEndReached}
        onEndReachedThreshold={2}
        onRefresh={refetch}
      />
      <FloatingButton
        bgColor={theme.colors.red[900]}
        icon={<BravvoxBIcon height={20} width={20} />}
        onPress={onNewMsgPress}
      />
      <MessageListOptions
        isMuted={chatItem?.isMuted}
        ref={msgOptions}
        onCloseOptions={onCloseOptions}
        onSelectBlock={onSelectBlock}
        onSelectDelete={onSelectDelete}
        onToggleMute={onToggleMute}
      />
    </>
  );
}

export default ChatList;
