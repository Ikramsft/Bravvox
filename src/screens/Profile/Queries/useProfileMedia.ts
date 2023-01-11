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
}

interface IMediaPage {
  data: INewsFeedData[];
  totalCount: number;
  pageNo: number;
}

const PER_PAGE = 10;

async function fetchProfileMedia(userId: string, pageNo: number): Promise<IMediaPage | undefined> {
  try {
    const response: IResponseData = await client.get(
      `${config.CONTENT_API_URL}user/media?userId=${userId}&perPage=${PER_PAGE}&pageNo=${pageNo}`,
    );
    return {data: response.data, totalCount: response.totalCount, pageNo};
  } catch (error) {
    return Promise.reject(error);
  }
}

const useProfileMedia = (userId = '') => {
  const cacheKey = [QueryKeys.userMedia, userId];
  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchProfileMedia(userId, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const totalRecords = allPages[0]?.totalCount ?? 0;
        const hasRecords = allPages.reduce((sum, e) => sum + (e?.data.length ?? 0), 0);
        const pageNo = hasRecords < totalRecords ? (lastPage?.pageNo ?? 0) + 1 : null;
        return pageNo;
      },
      enabled: userId !== '',
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

export {useProfileMedia};
