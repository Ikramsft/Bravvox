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

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  const deleteConversation = async (channelId: string) => {
    try {
      const url = `${config.MESSENGER_API_URL}api/conversation/delete/${channelId}`;
      const response: IResponseData = await client.delete(url);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const deleteConversationMutation = useMutation(deleteConversation, {
    onSuccess: async (_data, variables) => {
      const cacheKey = [QueryKeys.channelList];
      const response = await queryClient.getQueryData<IChannelPages>(cacheKey);
      if (response) {
        const {pages} = response;
        const updPages = pages.map(p => {
          const {data: channels, ...rest} = p;
          const updatedChannelList = channels.filter(c => c.channelId !== variables);
          return {...rest, data: updatedChannelList};
        });
        const updResponse = {...response, pages: updPages};
        queryClient.setQueryData<IChannelPages>(cacheKey, updResponse);
      }

      const detailCacheKey = [QueryKeys.oneToOneHistory, variables];
      queryClient.removeQueries(detailCacheKey);

      const message = 'Conversation deleted successfully';
      showSnackbar({message, type: 'success'});
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'danger'});
    },
  });

  const tryDeleteConversation = (channelId: string) => deleteConversationMutation.mutate(channelId);

  return {...deleteConversationMutation, tryDeleteConversation};
};
