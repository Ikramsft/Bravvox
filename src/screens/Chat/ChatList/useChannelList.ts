/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';
import {config} from '../../../config';
import client from '../../../utils/ApiClient';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IChannelListData, IChannelListResponseData} from '../types/ChatInterfaces';

export interface IChannelListPage {
  data: IChannelListData[];
  pageNo: number;
  hasNext: boolean;
}

export interface IChannelPages {
  pages: IChannelListPage[];
  pageParams?: number[];
}

const CHANNEL_PER_PAGE = 10;

async function fetchChannels(pageNumber: number): Promise<IChannelListPage | undefined> {
  try {
    const url = `${config.MESSENGER_API_URL}api/directory?page=${pageNumber}&size=${CHANNEL_PER_PAGE}`;
    const response: IChannelListResponseData = await client.get(url);
    if (response.data.length > 0 && !response.error) {
      return {
        data: response.data,
        pageNo: pageNumber,
        hasNext: response.data.length === CHANNEL_PER_PAGE,
      };
    }
    return {data: [], pageNo: pageNumber, hasNext: false};
  } catch (error) {
    return {data: [], pageNo: pageNumber, hasNext: false};
  }
}

export const useChannelList = () => {
  const listQuery = useInfiniteQuery(
    QueryKeys.channelList,
    ({pageParam = 1}) => fetchChannels(pageParam),
    {
      getNextPageParam: lastPage => {
        return lastPage?.hasNext ? lastPage.pageNo + 1 : null;
      },
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const channelList: IChannelListData[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        channelList.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    channelList,
    onEndReached,
  };
};
