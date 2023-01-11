/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';

import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {GroupRoles, IMembersData} from '../../Groups/types/GroupInterfaces';
import {MemberShipStatus} from '../../../utils/types';

export interface IResponseData {
  code: number;
  data: {
    followers: IMembersData[];
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
  businessId: string,
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
    // ?limit=${PER_PAGE}&offset=${offset}&status=${status}
    const url = `${config.BUSINESS_PAGE_API_URL}businessPage/${businessId}/followers`;
    const response: IResponseData = await client.get(url, {params});

    return {data: response.data.followers, totalCount: response.data.totalCount, pageNo};
  } catch (error) {
    return Promise.reject(error);
  }
}

type MemberFilter = {
  status?: MemberShipStatus;
  role?: GroupRoles[];
};

const useBusinessMemberList = (
  businessId: string,
  filter: MemberFilter | undefined,
  enabled: boolean,
) => {
  const cacheKey = [QueryKeys.businessPageMembers, businessId];
  let queryEnabled = businessId !== '' && enabled;
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
    ({pageParam = 1}) => fetchMembers(businessId, pageParam, filter),
    {
      getNextPageParam: (lastPage, allPages) => {
        const totalRecords = allPages[0]?.totalCount ?? 0;
        const hasRecords = allPages.reduce((sum, e) => sum + (e?.data?.length ?? 0), 0);
        const pageNo = hasRecords < totalRecords ? (lastPage?.pageNo ?? 0) + 1 : null;
        return pageNo;
      },
      enabled: queryEnabled,
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;
  const followerList: IMembersData[] = [];

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

export {useBusinessMemberList};
