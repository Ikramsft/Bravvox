/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';

import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IGroupCardInfo} from '../types/GroupInterfaces';

export interface IResponseData {
  data: {
    groups: IGroupCardInfo[];
    totalCount: number;
  };
  error: boolean;
  message: string;
  status: number;
  code: number;
}

export interface IGroupsPage {
  data: IGroupCardInfo[];
  totalCount: number;
  pageNo: number;
}

export interface IGroupsPages {
  pages: IGroupsPage[];
}

const PER_PAGE = 20;

async function fetchGroups(type: string, pageNo: number): Promise<IGroupsPage | undefined> {
  try {
    const offset = (pageNo - 1) * PER_PAGE;
    const url = `${config.GROUP_API_URL}groups?offset=${offset}&limit=${PER_PAGE}&type=${type}`;
    const response: IResponseData = await client.get(url);
    return {data: response.data.groups, totalCount: response.data.totalCount, pageNo};
  } catch (error) {
    return Promise.reject(error);
  }
}

export const GroupTypes = ['popular', 'myGroups', 'recent'] as const;

export type GroupType = typeof GroupTypes[number] | '';

const useGroupsList = (type: GroupType) => {
  const cacheKey = [QueryKeys.groupsList, type];
  const listQuery = useInfiniteQuery(cacheKey, ({pageParam = 1}) => fetchGroups(type, pageParam), {
    getNextPageParam: (lastPage, allPages) => {
      const totalRecords = allPages[0]?.totalCount ?? 0;
      const hasRecords = allPages.reduce((sum, e) => sum + (e?.data.length ?? 0), 0);
      const pageNo = hasRecords < totalRecords ? (lastPage?.pageNo ?? 0) + 1 : null;
      return pageNo;
    },
    enabled: type !== '',
  });

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const groupsList: IGroupCardInfo[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        groupsList.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    groupsList,
    onEndReached,
  };
};

export {useGroupsList};
