/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';

import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {GroupRoles, IMembersData} from '../types/GroupInterfaces';
import {MemberShipStatus} from '../../../utils/types';

export interface IResponseData {
  code: number;
  data: {
    members: IMembersData[];
    totalCount: number;
  };
  error: boolean;
  message: string;
  status: number;
}

export interface IGroupMemberPage {
  data: IMembersData[];
  totalCount: number;
  pageNo: number;
}

const PER_PAGE = 20;

type GroupMemberParams = {
  limit: number;
  offset: number;
  status?: string;
  role?: string;
};

async function fetchMembers(
  groupId: string,
  pageNo: number,
  data: MemberFilter | undefined,
): Promise<IGroupMemberPage | undefined> {
  try {
    const offset = (pageNo - 1) * PER_PAGE;
    const params: GroupMemberParams = {
      limit: PER_PAGE,
      offset,
    };

    if (data) {
      if (data.status) {
        params.status = data.status;
      }
      if (data.role) {
        params.role = data.role.toString();
      }
    }
    const url = `${config.GROUP_API_URL}group/${groupId}/members`;
    const response: IResponseData = await client.get(url, {params});

    return {data: response.data.members, totalCount: response.data.totalCount, pageNo};
  } catch (error) {
    return Promise.reject(error);
  }
}

type MemberFilter = {
  status?: MemberShipStatus;
  role?: GroupRoles[];
};

const useMemberList = (groupId: string, filter: MemberFilter | undefined, enabled: boolean) => {
  const cacheKey = [QueryKeys.groupMembers, groupId];
  let queryEnabled = groupId !== '' && enabled;
  if (filter) {
    const {status, role} = filter;
    if (status) {
      cacheKey.push(status);
      queryEnabled = queryEnabled && status.length > 0;
    }

    if (role) {
      cacheKey.push(role.toString());
      queryEnabled = queryEnabled && role.length > 0;
    }
  }

  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchMembers(groupId, pageParam, filter),
    {
      getNextPageParam: (lastPage, allPages) => {
        const totalRecords = allPages[0]?.totalCount ?? 0;
        const hasRecords = allPages.reduce((sum, e) => sum + (e?.data.length ?? 0), 0);
        const pageNo = hasRecords < totalRecords ? (lastPage?.pageNo ?? 0) + 1 : null;
        return pageNo;
      },
      enabled: queryEnabled,
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const memberList: IMembersData[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        memberList.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    memberList,
    onEndReached,
  };
};

export {useMemberList};
