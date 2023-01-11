/**
 * @format
 */
import {useMutation, useQueryClient} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

import {config} from '../../../config';
import client from '../../../utils/ApiClient';
import {showSnackbar} from '../../../utils/SnackBar';
import {IResponseData} from '../../../constants/types';
import {IChannelListData, IMemberData} from '../types/ChatInterfaces';
import {QueryKeys} from '../../../utils/QueryKeys';
import {useSocket} from '../../../socket/useSocket';
import {ISearchUser} from './useSearchUser';
import {IUserData} from '../../../redux/reducers/user/UserInterface';
import {RootNavigationType} from '../../Home';
import {IChannelPages} from '../ChatList/useChannelList';

export interface IDetails {
  user: ISearchUser;
  loginUser: IUserData;
  text: string;
}

const createChannel = async (details: IDetails) => {
  const {user} = details;
  try {
    const url = `${config.MESSENGER_API_URL}api/conversation/new/${user.documentID}`;
    const response: IResponseData = await client.get(url);
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const useNewMessage = () => {
  const queryClient = useQueryClient();

  const {sendMessage} = useSocket();

  const navigation = useNavigation<RootNavigationType>();

  const createChannelMutation = useMutation(createChannel, {
    onSuccess: async (data, variables) => {
      if (data?.ChannelId) {
        const {user, text, loginUser} = variables;
        const cacheKey = [QueryKeys.channelList];

        const member: IMemberData = {
          userId: user.documentID,
          name: user.name,
          profilePic: user.avatar,
          isOwner: false,
          isOnline: false,
          influencerStatus: false,
        };

        const sender: IMemberData = {
          userId: loginUser.documentId,
          name: loginUser.name,
          profilePic: loginUser.profilePicThumb,
          isOwner: false,
          isOnline: true,
          influencerStatus: false,
        };

        const newChannel: IChannelListData = {
          channelId: data.ChannelId,
          lastMessage: text,
          lastMessageByUser: '',
          memebers: [member, sender],
          messageDate: moment().toISOString(),
          unReadedCount: 0,
          isMuted: false,
        };

        const response = await queryClient.getQueryData<IChannelPages>(cacheKey);
        if (response) {
          const updPages = response.pages.map((p, i) => {
            if (i === 0) {
              return {...p, data: [newChannel, ...p.data]};
            }
            return p;
          });
          const updatedResponse: IChannelPages = {...response, pages: updPages};
          await queryClient.setQueryData<IChannelPages>(cacheKey, updatedResponse);
        }

        try {
          const tm = setTimeout(() => {
            sendMessage(data.ChannelId, text);
            navigation.replace('ChatDetail', {chatMessage: newChannel});
            clearTimeout(tm);
          }, 1000);
        } catch (error) {
          console.log('error sending-->', error);
        }
      }
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'danger'});
    },
  });

  const tryCreateChannelAndSendMessage = (details: IDetails) =>
    createChannelMutation.mutate(details);

  return {...createChannelMutation, tryCreateChannelAndSendMessage};
};
