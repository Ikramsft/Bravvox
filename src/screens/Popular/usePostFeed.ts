/**
 * @format
 */
import {useInfiniteQuery} from 'react-query';
import {useCallback} from 'react';
import client from '../../utils/ApiClient';
import {config} from '../../config';
import {QueryKeys} from '../../utils/QueryKeys';
import {IGroupMemberPage} from '../Groups/Queries/useMembersList';
import {INewsFeedData} from '../Home/types/NewsFeedInterface';

export interface IPostFeedResponseData {
  data: Array<INewsFeedData>;
  error?: boolean;
  isFromCache?: boolean;
  message?: string;
  startNo?: number;
  endNo?: number;
  status?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Key: string]: any;
}

export interface IFeedPage {
  data: Array<INewsFeedData>;
  startNo: number;
  hasNext: boolean;
}

export interface IFeedPages {
  pages: IFeedPage[];
  pageParams?: number[];
}

export interface IGroupMemberPages {
  pages: IGroupMemberPage[];
}

async function fetchFeeds(start: number): Promise<IFeedPage | undefined> {
  try {
    const url = `${config.POST_API_URL}top=10&skip=${start}`;
    const response: IPostFeedResponseData = await client.get(url);
    if (response) {
      return {data: response.data, startNo: start, hasNext: true};
    }

    return {data: [], startNo: start, hasNext: false};
  } catch (error) {
    return {data: [], startNo: start, hasNext: false};
  }
}

const usePostFeed = () => {
  const listQuery = useInfiniteQuery(
    QueryKeys.postFeed,
    ({pageParam = 0}) => fetchFeeds(pageParam),
    {
      getNextPageParam: lastPage => {
        return lastPage?.hasNext ? lastPage.startNo + 10 : null;
      },
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const postList: Array<INewsFeedData> = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        postList.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    postList,
    onEndReached,
  };
};

export {usePostFeed};
