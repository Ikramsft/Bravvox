/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {INewsFeedData} from '../../Home/types/NewsFeedInterface';
import {QueryKeys} from '../../../utils/QueryKeys';

export interface IResponseData {
  data: INewsFeedData[];
  error: boolean;
  message: string;
  status: number;
  total: number;
}
export interface IFeedPage {
  data: INewsFeedData[];
  totalCount: number;
  pageNo: number;
}
export interface IFeedEventPages {
  pages: IFeedPage[];
  pageParams?: number[];
}

const PER_PAGE = 25;

async function fetchEventFeeds(eventId: string, pageNo: number): Promise<IFeedPage | undefined> {
  try {
    const offset = (pageNo - 1) * PER_PAGE;
    const url = `${config.EVENTS_API_URL}event/${eventId}/posts?offset=${offset}&limit=${PER_PAGE}`;
    const response: IResponseData = await client.get(url);
    return {data: response.data, totalCount: response.total, pageNo};
  } catch (error) {
    return Promise.reject(error);
  }
}

const useEventNewsFeed = (eventId = '', enabled = true) => {
  const cacheKey = [QueryKeys.eventFeed, eventId];
  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchEventFeeds(eventId, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const totalRecords = allPages[0]?.totalCount ?? 0;
        const hasRecords = allPages.reduce((sum, e) => sum + (e?.data.length ?? 0), 0);
        const pageNo = hasRecords < totalRecords ? (lastPage?.pageNo ?? 0) + 1 : null;
        return pageNo;
      },
      enabled: eventId !== '' && enabled,
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const feedList: INewsFeedData[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        feedList.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    feedList,
    onEndReached,
  };
};

export {useEventNewsFeed};
