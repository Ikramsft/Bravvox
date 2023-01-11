/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';

import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';

export interface IResponseData {
  data: {
    businessPages: IBusinessData[];
    totalCount: number;
  };
  error: boolean;
  message: string;
  status: number;
  code: number;
}

export interface IBusinessDataPage {
  data: IBusinessData[];
  totalCount: number;
  pageNo: number;
}

export interface IBusinessData {
  avatarReadURL: string;
  id: string;
  name: string;
  pictureReadURL: string;
  totalFollowers: string;
}

const PER_PAGE = 20;

async function fetchBusiness(type: string, pageNo: number): Promise<IBusinessDataPage | undefined> {
  try {
    const offset = (pageNo - 1) * PER_PAGE;
    const url = `${config.BUSINESS_PAGE_API_URL}businessPages?offset=${offset}&limit=${PER_PAGE}&type=${type}`;
    const response: IResponseData = await client.get(url);
    return {data: response.data.businessPages, totalCount: response.data.totalCount, pageNo};
  } catch (error) {
    return Promise.reject(error);
  }
}

export const businessType = ['popular', 'myBusinessPages', 'recent'] as const;
export type BusinessType = typeof businessType[number] | '';

const useBusinessList = (type: BusinessType) => {
  const cacheKey = [QueryKeys.businessList, type];
  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchBusiness(type, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const totalRecords = allPages[0]?.totalCount ?? 0;
        const hasRecords = allPages.reduce((sum, e) => sum + (e?.data.length ?? 0), 0);
        const pageNo = hasRecords < totalRecords ? (lastPage?.pageNo ?? 0) + 1 : null;
        return pageNo;
      },
      enabled: type !== '',
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const businessList: IBusinessData[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        businessList.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    businessList,
    onEndReached,
  };
};

export {useBusinessList};
