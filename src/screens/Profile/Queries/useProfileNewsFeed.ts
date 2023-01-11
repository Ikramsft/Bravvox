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
  totalCount: number;
  isLastPage: boolean;
}
export interface IFeedPage {
  data: INewsFeedData[];
  totalCount: number;
  pageNo: number;
  isLastPage: boolean;
}

const PER_PAGE = 10;

async function fetchProfileFeeds(userId: string, pageNo: number): Promise<IFeedPage | undefined> {
  try {
    const url = `${config.CONTENT_API_URL}contents-by-user-id?userId=${userId}&perPage=${PER_PAGE}&pageNo=${pageNo}`;
    const response: IResponseData = await client.get(url);
    return {
      data: response.data,
      totalCount: response.totalCount,
      pageNo,
      isLastPage: response.isLastPage,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}

const useProfileNewsFeed = (userId = '', enabled = true) => {
  const cacheKey = [QueryKeys.userFeed, userId];
  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchProfileFeeds(userId, pageParam),
    {
      getNextPageParam: lastPage => {
        const pageNo = !lastPage?.isLastPage ? (lastPage?.pageNo ?? 0) + 1 : null;
        return pageNo;
      },
      enabled: userId !== '' && enabled,
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const feedList: INewsFeedData[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  let totalCount = 0;
  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        totalCount = page.totalCount;
        feedList.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    totalCount,
    feedList,
    onEndReached,
  };
};

export {useProfileNewsFeed};
