/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';
import {uniqBy} from 'lodash';

import {config} from '../../../config';
import client from '../../../utils/ApiClient';
import {QueryKeys} from '../../../utils/QueryKeys';
import {RelationShip} from '../../../redux/reducers/user/UserInterface';

export interface ISearchUser {
  avatar: string;
  documentID: string;
  name: string;
  relationship: RelationShip;
  relationshipID: string;
  username: string;
}

interface ISearchUserData {
  accountContainer: {accounts: ISearchUser[]; total: number};
  eventContainer: {events: ISearchUser[]; total: number};
  followerContainer: {follower: ISearchUser[]; total: number};
  followingContainer: {following: ISearchUser[]; total: number};
  groupContainer: {groups: ISearchUser[]; total: number};
  inviteContainer: {invite: ISearchUser[]; total: number};
  postContainer: {posts: ISearchUser[]; total: number};
}

export interface IFollowerListResponseData {
  data: ISearchUserData;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

export interface ISearchUserDataPage {
  data: ISearchUser[];
  totalCount: number;
  pageNo: number;
}

const PER_PAGE = 12;

async function fetchUsers(pageNo: number, query: string): Promise<ISearchUserDataPage | undefined> {
  try {
    const offset = (pageNo - 1) * PER_PAGE;
    const url = `${config.SEARCH_API_URL}search?keyword=${query}&limit=${PER_PAGE}&offset=${offset}&type=invite`;
    const response: IFollowerListResponseData = await client.get(url);
    return {
      data: response.data.inviteContainer.invite,
      totalCount: response.data.inviteContainer.total,
      pageNo,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}

export const useSearchUser = (profileID: string, search: string) => {
  const enabled = profileID !== '' && search.length >= 3;

  const cacheKey = [QueryKeys.searchUser, profileID, search];
  const listQuery = useInfiniteQuery(cacheKey, ({pageParam = 1}) => fetchUsers(pageParam, search), {
    getNextPageParam: (lastPage, allPages) => {
      const totalRecords = allPages[0]?.totalCount ?? 0;
      const hasRecords = allPages.reduce((sum, e) => sum + (e?.data.length ?? 0), 0);
      const pageNo = hasRecords < totalRecords ? (lastPage?.pageNo ?? 0) + 1 : null;
      return pageNo;
    },
    enabled,
  });

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const userList: ISearchUser[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        userList.push(...page.data);
      }
    });
  }

  const uniqueList = uniqBy(userList, 'documentID');

  return {
    ...listQuery,
    userList: uniqueList,
    onEndReached,
  };
};
