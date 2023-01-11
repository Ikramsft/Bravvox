/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';

export interface FollowerUserData {
  documentId: string | null;
  name: string;
  profilePicThumb: string;
  relationship: string;
  userId: string;
  userName: string;
}
export interface IResponseData {
  data: followers;
  error: boolean;
  message: string;
  status: number;
}

export interface followers {
  followers: FollowerUserData[];
  totalCount: number;
}

export interface IFeedPage {
  data: FollowerUserData[];
  totalCount: number;
  pageNo: number;
}
export interface IFeedPages {
  pages: IFeedPage[];
  pageParams?: number[];
}

const PER_PAGE = 25;

async function fetchBusinessFollowers(
  businessId: string,
  pageNo = 1,
): Promise<IFeedPage | undefined> {
  try {
    const offset = (pageNo - 1) * PER_PAGE;
    const response: IResponseData = await client.get(
      `${config.BUSINESS_PAGE_API_URL}businessPage/${businessId}/followers?offset=${offset}&limit=${PER_PAGE}`,
    );
    return {data: response.data.followers, totalCount: response.data.totalCount, pageNo};
  } catch (error) {
    return Promise.reject(error);
  }
}

const useBusinessFollowers = (businessId = '') => {
  const listQuery = useInfiniteQuery(
    QueryKeys.useFollowers,
    ({pageParam = 1}) => fetchBusinessFollowers(businessId, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const totalRecords = allPages[0]?.totalCount ?? 0;
        const hasRecords = allPages.reduce((sum, e) => sum + (e?.data.length ?? 0), 0);
        const pageNo = hasRecords < totalRecords ? (lastPage?.pageNo ?? 0) + 1 : null;
        return pageNo;
      },
      enabled: businessId !== '',
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const followerList: FollowerUserData[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        followerList.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    followerList,
    onEndReached,
  };
};

export {useBusinessFollowers};
