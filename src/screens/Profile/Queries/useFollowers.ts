/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {FollowType, FromType} from '../../../utils/types';
import {RelationShip} from '../../../redux/reducers/user/UserInterface';

export interface FollowerUserData {
  documentId: string | null;
  name: string;
  profilePicURL: string;
  relationship: RelationShip;
  userId: string;
  userName: string;
  influencerStatus: boolean;
}
export interface IResponseData {
  data: FollowerUserData[];
  error: boolean;
  message: string;
  status: number;
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

async function fetchFollowers(
  userId: string,
  followType: FollowType,
  fromType: FromType,
  pageNo = 1,
): Promise<IFeedPage | undefined> {
  try {
    const url = `${config.RELATIONSHIP_API_URL}relationships/${fromType}?relationship=${followType}&page=${pageNo}&profileId=${userId}`;
    const response: IResponseData = await client.get(url);
    return {data: response.data, totalCount: response.totalCount, pageNo};
  } catch (error) {
    return Promise.reject(error);
  }
}

const useFollowers = (userId = '', followType: FollowType, fromType: FromType) => {
  const listQuery = useInfiniteQuery(
    [QueryKeys.useFollowers, userId],
    ({pageParam = 1}) => fetchFollowers(userId, followType, fromType, pageParam),
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

export {useFollowers};
