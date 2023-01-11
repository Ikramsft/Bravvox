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

interface IMediaPage {
  data: INewsFeedData[];
  totalCount: number;
  pageNo: number;
}

const PER_PAGE = 25;

async function fetchGroupMedia(groupId: string, pageNo: number): Promise<IMediaPage | undefined> {
  try {
    const offset = (pageNo - 1) * PER_PAGE;
    const response: IResponseData = await client.get(
      `${config.GROUP_API_URL}group/${groupId}/media?offset=${offset}&limit=${PER_PAGE}`,
    );
    return {data: response.data, totalCount: response.total, pageNo};
  } catch (error) {
    return Promise.reject(error);
  }
}

const useGroupMedia = (groupId = '', memberFlag = true) => {
  const cacheKey = [QueryKeys.groupMedia, groupId];
  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchGroupMedia(groupId, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const totalRecords = allPages[0]?.totalCount ?? 0;
        const hasRecords = allPages.reduce((sum, e) => sum + (e?.data.length ?? 0), 0);
        const pageNo = hasRecords < totalRecords ? (lastPage?.pageNo ?? 0) + 1 : null;
        return pageNo;
      },
      enabled: groupId !== '' && memberFlag,
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

export {useGroupMedia};
