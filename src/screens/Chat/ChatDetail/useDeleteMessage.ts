/**
 * @format
 */
import {useMutation, useQueryClient} from 'react-query';

import {config} from '../../../config';
import client from '../../../utils/ApiClient';
import {showSnackbar} from '../../../utils/SnackBar';
import {IResponseData} from '../../../constants/types';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IChannelMessage} from '../types/ChatInterfaces';

export interface IDeleteMessage {
  messageId: string;
  channelId: string;
  choice: string;
  onSuccess?: () => void;
}

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  const deleteConversation = async (info: IDeleteMessage) => {
    const {messageId} = info;
    try {
      const url = `${config.MESSENGER_API_URL}api/messages/delete/${messageId}`;
      const response: IResponseData = await client.delete(url);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const deleteConversationMutation = useMutation(deleteConversation, {
    onSuccess: async (_data, variables) => {
      const {channelId, messageId, onSuccess} = variables;
      const key = [QueryKeys.oneToOneHistory, channelId];
      const response = await queryClient.getQueryData<IChannelMessage[]>(key);
      if (response) {
        const updResponse = response.map(r => ({...r, isDeleted: r.id === messageId}));
        queryClient.setQueryData<IChannelMessage[]>(key, updResponse);
      }
      const message = 'Message deleted successfully';
      const detailCacheKey = [QueryKeys.oneToOneHistory, variables];
      queryClient.removeQueries(detailCacheKey);
      showSnackbar({message, type: 'success'});
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'danger'});
    },
  });

  const tryDeleteMessage = (info: IDeleteMessage) => deleteConversationMutation.mutate(info);

  return {...deleteConversationMutation, tryDeleteMessage};
};
