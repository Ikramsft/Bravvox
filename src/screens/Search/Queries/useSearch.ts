/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';
import { isString } from 'lodash';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';

export interface IResponseData {
  data: {
    accountContainer: {
      accounts: any[];
      total: number;
    };
    eventContainer: {
      events: any[];
      total: number;
    };
    followerContainer: {
      follower: any[];
      total: number;
    };
    followingContainer: {
      following: any[];
      total: number;
    };
    groupContainer: {
      groups: any[];
      total: number;
    };
    inviteContainer: {
      invite: any[];
      total: number;
    };
    postContainer: {
      posts: any[];
      total: number;
    };
  };
  error: boolean;
  message: string;
  status: number;
  code: number;
}

export interface ISearchPage {
  data: any[];
  totalCount: number;
  pageNo: number;
}

export interface ISearchPages {
  pages: ISearchPage[];
}

export interface ISearchParams {
  keyword?: string;
  type?: string;
  listType?: string;
}

const PER_PAGE = 20;

async function fetchSearchResults(
  searchParams: ISearchParams,
  pageNo: number,
): Promise<ISearchPage | undefined> {
  try {
    const offset = (pageNo - 1) * PER_PAGE;

    let url = ``;
    const type = searchParams && searchParams.type;
    switch (type) {
      case 'all':
        url = `${config.SEARCH_API_URL}active-search`;
        break;
      case 'accounts':
        url = `${config.SEARCH_API_URL}search`;
        break;
      case 'groups':
        url = `${config.SEARCH_API_URL}search`;
        break;
      case 'events':
        url = `${config.SEARCH_API_URL}search`;
        break;
      default:
        break;
    }
    const params = {
      ...searchParams,
      offset,
      limit: PER_PAGE,
    };
    console.log('searchParams', searchParams);
    if (searchParams && isString(searchParams?.keyword) && searchParams?.keyword?.length < 3) {
      return {
        data: [],
        totalCount: 0,
        pageNo,
      };
    }
    const response: IResponseData = await client.get(url, {
      params,
    });
    if (type === 'accounts') {
      return {
        data: response.data.accountContainer.accounts,
        totalCount: response.data.accountContainer.total,
        pageNo,
      };
    }

    if (type === 'groups') {
      return {
        data: response.data.groupContainer.groups,
        totalCount: response.data.groupContainer.total,
        pageNo,
      };
    }

    if (type === 'events') {
      return {
        data: response.data.eventContainer.events,
        totalCount: response.data.eventContainer.total,
        pageNo,
      };
    }

    return {
      data: response.data.accountContainer.accounts,
      totalCount: response.data.accountContainer.total,
      pageNo,
    };
    
  } catch (error: any) {
    return Promise.reject(error);
  }
}
async function fetchSearchResultsAll(
  searchParams: ISearchParams,
  pageNo: number,
): Promise<ISearchPage | undefined> {
  try {
    const offset = (pageNo - 1) * PER_PAGE;
    const url = `${config.SEARCH_API_URL}search`;
    const params = {
      ...searchParams,
      offset,
      limit: PER_PAGE,
    };
    if (searchParams && searchParams?.keyword && searchParams?.keyword?.length < 3) {
      return {
        data: [],
        totalCount: 0,
        pageNo,
      };
    }
    const response: IResponseData = await client.get(url, {
      params,
    });
    const finalData = [
      ...response.data.accountContainer.accounts.map(account => {
        return {...account, type: 'user'};
      }),
      ...response.data.eventContainer.events.map(events => {
        return {...events, type: 'event'};
      }),
      ...response.data.groupContainer.groups.map(group => {
        return {...group, type: 'group'};
      }),
      ...response.data.postContainer.posts.map(post => {
        return {...post, type: 'post'};
      }),
    ];
    const finalTotal =
      response.data.accountContainer.total +
      response.data.eventContainer.total +
      response.data.groupContainer.total +
      response.data.postContainer.total;
    return {
      data: finalData,
      totalCount: finalTotal,
      pageNo,
    };
  } catch (error: any) {
    return Promise.reject(error);
  }
}

const useSearch = (searchParams: ISearchParams, enabled: boolean) => {
  const cacheKey = [QueryKeys.searchApi, searchParams];
  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) =>
      searchParams?.type === 'all'
        ? fetchSearchResultsAll(searchParams, pageParam)
        : fetchSearchResults(searchParams, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const totalRecords = allPages[0]?.totalCount ?? 0;
        const hasRecords = allPages.reduce((sum, e) => sum + (e?.data.length ?? 0), 0);
        const pageNo = hasRecords < totalRecords ? (lastPage?.pageNo ?? 0) + 1 : null;
        return pageNo;
      },
      enabled,
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const searchResult: any[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        searchResult.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    searchResult,
    onEndReached,
  };
};

export {useSearch};
