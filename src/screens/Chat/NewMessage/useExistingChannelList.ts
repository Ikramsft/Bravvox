/**
 * @format
 */
import React from 'react';
import {useQueryClient} from 'react-query';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IChannelPages} from '../ChatList/useChannelList';
import {IChannelListData} from '../types/ChatInterfaces';

export const useExistingChannelList = () => {
  const queryClient = useQueryClient();

  const result = React.useRef<IChannelListData[]>([]);

  React.useEffect(() => {
    const getList = async () => {
      const cacheKey = [QueryKeys.channelList];
      const list = queryClient.getQueryData<IChannelPages>(cacheKey);
      if (list) {
        const {pages} = list;
        const allPages: IChannelListData[] = [];
        pages.forEach(p => allPages.push(...p.data));
        result.current = allPages;
      }
    };

    getList();
  }, [queryClient]);

  return result.current;
};
