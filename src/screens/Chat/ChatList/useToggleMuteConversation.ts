/**
 * @format
 */
import {useMutation, useQueryClient} from 'react-query';
import {config} from '../../../config';
import client from '../../../utils/ApiClient';
import {showSnackbar} from '../../../utils/SnackBar';
import {IResponseData} from '../../../constants/types';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IChannelListData} from '../types/ChatInterfaces';
import {IChannelPages} from './useChannelList';

type RequestType = 'mute' | 'unmute';

export interface IConversationOperation {
  reqType: RequestType;
  channelId: string;
}

export const useToggleMuteConversation = () => {
  const queryClient = useQueryClient();

  const toggleMuteConversation = async (data: IConversationOperation) => {
    try {
      const {reqType, channelId} = data;
      const url = `${config.MESSENGER_API_URL}api/conversation/${reqType}/${channelId}`;
      const response: IResponseData = await client.get(url);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const toggleMuteConversationMutation = useMutation(toggleMuteConversation, {
    onSuccess: async (_data, variables) => {
      const {reqType} = variables;
      const isMuted = reqType === 'mute';

      const cacheKey = [QueryKeys.channelList];
      const response = await queryClient.getQueryData<IChannelPages>(cacheKey);
      if (response) {
        const {pages} = response;
        const updPages = pages.map(p => {
          const {data: channels, ...rest} = p;
          const updatedChannelList = channels.map(c => {
            const lstMsg = {...c, isMuted};
            return lstMsg;
          });
          return {...rest, data: updatedChannelList};
        });
        const updResponse = {...response, pages: updPages};
        queryClient.setQueryData<IChannelPages>(cacheKey, updResponse);
      }

      const message = isMuted
        ? 'Conversation muted successfully'
        : 'Conversation unmuted successfully';
      showSnackbar({message, type: 'success'});
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'danger'});
    },
  });

  const tryToggleMuteConversation = (data: IConversationOperation) =>
    toggleMuteConversationMutation.mutate(data);

  return {...toggleMuteConversationMutation, tryToggleMuteConversation};
};
