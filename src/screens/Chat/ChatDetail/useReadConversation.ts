/**
 * @format
 */
import {useMutation, useQueryClient} from 'react-query';
import {config} from '../../../config';
import client from '../../../utils/ApiClient';
import {showSnackbar} from '../../../utils/SnackBar';
import {IResponseData} from '../../../constants/types';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IChannelPages} from '../ChatList/useChannelList';

export const useReadConversation = () => {
  const queryClient = useQueryClient();

  const readConversation = async (channelId: string) => {
    try {
      const url = `${config.MESSENGER_API_URL}api/conversation/readed/${channelId}`;
      const response: IResponseData = await client.get(url);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const readConversationMutation = useMutation(readConversation, {
    onSuccess: async (_data, channelId) => {
      const cacheKey = [QueryKeys.channelList];
      const response = await queryClient.getQueryData<IChannelPages>(cacheKey);
      if (response) {
        const {pages} = response;
        const updPages = pages.map(p => {
          const {data: channels, ...rest} = p;
          const updatedChannelList = channels.map(c => {
            if (c.channelId === channelId) {
              const lstMsg = {...c, unReadedCount: 0};
              return lstMsg;
            }
            return c;
          });
          return {...rest, data: updatedChannelList};
        });
        const updResponse = {...response, pages: updPages};
        queryClient.setQueryData<IChannelPages>(cacheKey, updResponse);
      }
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'danger'});
    },
  });

  const tryReadConversation = (channelId: string) => readConversationMutation.mutate(channelId);
  return {...readConversationMutation, tryReadConversation};
};
