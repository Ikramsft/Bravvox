/**
 * @format
 */
import {useQuery} from 'react-query';
import { isString } from 'lodash';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';

export interface IResponseData {
  data: {
    accountContainer: {
      accounts: any[];
      total: number;
      [Key: string]: any;
    };
    eventContainer: {
      events: any[];
      total: number;
      [Key: string]: any;
    };
    followerContainer: {
      follower: any[];
      total: number;
      [Key: string]: any;
    };
    followingContainer: {
      following: any[];
      total: number;
      [Key: string]: any;
    };
    groupContainer: {
      groups: any[];
      total: number;
      [Key: string]: any;
    };
    inviteContainer: {
      invite: any[];
      total: number;
      [Key: string]: any;
    };
    postContainer: {
      posts: any[];
      total: number;
      [Key: string]: any;
    };
    [Key: string]: {
      [Key: string]: any;
      total: number;
    };
  };
  error: boolean;
  message: string;
  status: number;
  code: number;
  [Key: string]: any;
}

export interface ISearchPage {
  data: IResponseData;
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

const PER_PAGE = 100;

const defaultResponse: IResponseData = {
  data: {
    accountContainer: {
      accounts: [],
      total: 0,
    },
    eventContainer: {
      events: [],
      total: 0,
    },
    followerContainer: {
      follower: [],
      total: 0,
    },
    followingContainer: {
      following: [],
      total: 0,
    },
    groupContainer: {
      groups: [],
      total: 0,
    },
    inviteContainer: {
      invite: [],
      total: 0,
    },
    postContainer: {
      posts: [],
      total: 0,
    },
  },
  error: false,
  message: "",
  status: 200,
  code: 200,
};

// eslint-disable-next-line consistent-return
async function fetchSearchResults(searchParams: ISearchParams): Promise<IResponseData> {
  try {
    // const offset = (pageNo - 1) * PER_PAGE;
    const url = `${config.SEARCH_API_URL}search`;
    const params = {
      ...searchParams,
      offset: 0,
      limit: PER_PAGE,
    };
    if (searchParams && isString(searchParams?.keyword) && searchParams?.keyword?.length < 3) {
      return defaultResponse;
    }
    
    const response: IResponseData = await client.get(url, {
      params,
    });
    return response;
  } catch (error: any) {
    return Promise.reject(error);
  }
}

const useSearchAll = (searchParams: ISearchParams, enabled: boolean) => {
  const cacheKey = [QueryKeys.searchAll, searchParams];
  return useQuery(cacheKey, () => fetchSearchResults(searchParams), {
    enabled,
  });
};

export {useSearchAll};
