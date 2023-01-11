/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {IFollowings} from '../../Home/types/NewsFeedInterface';
import {QueryKeys} from '../../../utils/QueryKeys';

export interface IResponseFollowing {
  data: IFollowings[];
  error?: boolean;
  message?: string;
  status?: number;
  pageNo?: number;
}

async function fetchProfileFollowings(
  userId: string,
  pageNo: number,
): Promise<IResponseFollowing | undefined> {
  try {
    const response: IResponseFollowing = await client.get(
      `${config.RELATIONSHIP_API_URL}relationships/following?relationship=all&pageNo=${pageNo}`,
    );
    return {data: response.data, pageNo};
  } catch (error) {
    return Promise.reject(error);
  }
}

const useProfileFollowings = (userId = '') => {
  const cacheKey = [QueryKeys.userFollowing, userId];
  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchProfileFollowings(userId, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const totalRecords = allPages[0]?.error ?? 0;
        const hasRecords = allPages.reduce((sum, e) => sum + (e?.data.length ?? 0), 0);
        const pageNo = hasRecords < totalRecords ? (lastPage?.pageNo ?? 0) + 1 : null;
        return pageNo;
      },
      enabled: userId !== '',
    },
  );
  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const followings: IFollowings[] = [];
  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        followings.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    followings,
    onEndReached,
  };
};

export {useProfileFollowings};
