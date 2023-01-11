/**
 * @format
 */
import {useCallback} from 'react';
import {useQueryClient} from 'react-query';
import {useDispatch} from 'react-redux';
import moment from 'moment';

import {IChannelMessage} from '../screens/Chat/types/ChatInterfaces';
import {QueryKeys} from '../utils/QueryKeys';
import useUserInfo from '../hooks/useUserInfo';
import {navigationRef, currentRoute} from '../navigation/navigationRef';
import {updateOnlineIndicator} from '../redux/reducers/user/UserActions';
import {IChannelPages} from '../screens/Chat/ChatList/useChannelList';

type IMessageType = 'profile_pic' | 'display_name' | 'content' | 'online' | 'offline';

interface IMessage {
  nodeId: string;
  clientId: string;
  id: string;
  type: IMessageType;
  channel: string;
  content: string;
  senderID: string;
  senderUserId: string;
  senderName: string;
  senderProfilePic: string;
  createAt: string;
  updateAt: string;
  self: boolean;
  contentDataType: string;
  userStatus: {
    haveNewMessages: boolean;
    onLineIndicator: boolean;
  };
}

const ChatScreens = ['ChatList', 'ChatDetail'];

const useHandleMessage = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const {documentId} = useUserInfo();

  const onMessage = useCallback(
    (data: string) => {
      const route = currentRoute();
      const updateOnChannelList = async (msg: IMessage) => {
        const cacheKey = [QueryKeys.channelList];
        const response = await queryClient.getQueryData<IChannelPages>(cacheKey);
        if (response) {
          const {pages} = response;
          const updPages = pages.map(p => {
            const {data: channels, ...rest} = p;
            const updatedChannelList = channels.map(c => {
              if (c.channelId === msg.channel) {
                const ownMsg = msg.senderID === documentId;
                const lstMsg = {
                  ...c,
                  lastMessage: msg.content,
                  lastMessageByUser: msg.senderID,
                  messageDate: msg.updateAt,
                  unReadedCount: ownMsg ? 0 : c.unReadedCount + 1,
                };
                return lstMsg;
              }
              return c;
            });
            return {...rest, data: updatedChannelList};
          });
          const updResponse = {...response, pages: updPages};
          queryClient.setQueryData<IChannelPages>(cacheKey, updResponse);
        } else {
          queryClient.invalidateQueries(cacheKey);
        }
      };

      const updateOneToOneConversation = async (msg: IMessage) => {
        const cacheKey = [QueryKeys.oneToOneHistory, msg.channel];
        const response = await queryClient.getQueryData<IChannelMessage[]>(cacheKey);
        if (response && response.length > 0) {
          const msgIndex = response.findIndex(r => r.id === msg.id && r.senderID === msg.senderID);
          if (msgIndex === -1) {
            const userIndex = response.findIndex(r => r.senderID === msg.senderID);
            const newMsg: IChannelMessage = {
              channel: msg.channel,
              content: msg.content,
              id: msg.id,
              self: msg.self,
              senderID: msg.senderID,
              type: 'text',
              createAt: msg.createAt,
              updateAt: msg.updateAt,
              text: msg.content,
              _id: msg.id,
              createdAt: moment(msg.createAt).toDate(),
              user:
                userIndex > -1
                  ? response[userIndex].user
                  : {
                      _id: msg.senderID,
                      name: msg.senderName,
                      avatar: '',
                    },
            };
            const updResponse = response.concat(newMsg);
            queryClient.setQueryData<IChannelMessage[]>(cacheKey, updResponse);
          }
        }
      };

      const updateProfileInChannelList = async (msg: IMessage) => {
        const cacheKey = [QueryKeys.channelList];
        const response = await queryClient.getQueryData<IChannelPages>(cacheKey);
        if (response) {
          const {pages} = response;
          const updPages = pages.map(p => {
            const {data: channels, ...rest} = p;
            const updatedChannelList = channels.map(r => {
              if (r.channelId === msg.channel) {
                const updR = {...r};
                updR.memebers = updR.memebers.map(m => {
                  const updM = {...m};
                  if (m.userId === msg.senderUserId) {
                    if (msg.type === 'display_name') {
                      updM.name = msg.senderName;
                    }
                    if (msg.type === 'profile_pic') {
                      updM.profilePic = msg.senderProfilePic;
                    }
                    if (msg.type === 'online' || msg.type === 'offline') {
                      updM.isOnline = msg.userStatus.onLineIndicator;
                    }
                    return updM;
                  }
                  return m;
                });
                if (route === 'ChatDetail' && navigationRef.current) {
                  navigationRef.current.setParams({chatMessage: updR});
                }
                return updR;
              }
              return r;
            });
            return {...rest, data: updatedChannelList};
          });
          const updResponse: IChannelPages = {...response, pages: updPages};
          queryClient.setQueryData<IChannelPages>(cacheKey, updResponse);
        } else {
          queryClient.invalidateQueries(cacheKey);
        }
      };

      const updateProfileInOneToOneConversation = async (msg: IMessage) => {
        const cacheKey = [QueryKeys.oneToOneHistory, msg.channel];
        const response = await queryClient.getQueryData<IChannelMessage[]>(cacheKey);
        if (response && response.length > 0) {
          const msgIndex = response.findIndex(r => r.id === msg.id && r.senderID === msg.senderID);
          if (msgIndex === -1) {
            const updResponse = response.map(r => {
              // eslint-disable-next-line no-underscore-dangle
              if (r.user._id === msg.senderUserId) {
                const updUserInfo = {...r.user};
                if (msg.type === 'display_name') {
                  updUserInfo.name = msg.senderName;
                }
                if (msg.type === 'profile_pic') {
                  updUserInfo.avatar = msg.senderProfilePic;
                }
                return {...r, user: updUserInfo};
              }
              return r;
            });
            queryClient.setQueryData<IChannelMessage[]>(cacheKey, updResponse);
          }
        }
      };

      const message = JSON.parse(data) as IMessage;
      console.log('message-->', JSON.stringify(message, null, 2));

      switch (message.type) {
        case 'content':
          if (route) {
            const ownMsg = message.senderID === documentId;
            if (!ownMsg && !ChatScreens.includes(route)) {
              dispatch(updateOnlineIndicator(message.userStatus.onLineIndicator));
            }
          }
          updateOneToOneConversation(message);
          updateOnChannelList(message);
          break;
        case 'profile_pic':
        case 'display_name':
        case 'online':
        case 'offline':
          updateProfileInChannelList(message);
          updateProfileInOneToOneConversation(message);
          break;
        default:
          break;
      }
    },
    [dispatch, documentId, queryClient],
  );

  return {
    onMessage,
  };
};

export {useHandleMessage};
