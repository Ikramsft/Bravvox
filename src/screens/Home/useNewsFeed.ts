/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';
import {INewsFeedData} from './types/NewsFeedInterface';
import client from '../../utils/ApiClient';
import {config} from '../../config';
import {QueryKeys} from '../../utils/QueryKeys';
import {IGroupMemberPage} from '../Groups/Queries/useMembersList';

export interface INewsFeedResponseData {
  data: INewsFeedData[];
  error: boolean;
  isFromCache: boolean;
  message: string;
  pageNo: number;
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Key: string]: any;
}

export interface IFeedPage {
  data: INewsFeedData[];
  pageNo: number;
  hasNext: boolean;
}
export interface IFeedPages {
  pages: IFeedPage[];
  pageParams?: number[];
}

export interface IGroupMemberPages {
  pages: IGroupMemberPage[];
}
async function fetchFeeds(pageNumber: number): Promise<IFeedPage | undefined> {
  try {
    const url = `${config.NEWSFEED_API_URL}page/${pageNumber}`;
    const response: INewsFeedResponseData = await client.get(url);
    if (response.data.length > 0 && !response.error) {
      return {data: response.data, pageNo: pageNumber, hasNext: true};
    }
    return {data: [], pageNo: pageNumber, hasNext: false};
  } catch (error) {
    return {data: [], pageNo: pageNumber, hasNext: false};
  }
}

const useNewsFeed = (enabled = true) => {
  const listQuery = useInfiniteQuery(
    QueryKeys.homeFeed,
    ({pageParam = 1}) => fetchFeeds(pageParam),
    {
      getNextPageParam: lastPage => {
        return lastPage?.hasNext ? lastPage.pageNo + 1 : null;
      },
      enabled,
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const feedList: INewsFeedData[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        feedList.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    feedList,
    onEndReached,
  };
};

const useSingleNewsFeed = (documentId: string, enabled = true) => {
  const {feedList} = useNewsFeed(enabled);
  const newsFeed: INewsFeedData = feedList.find(
    item => item.documentId === documentId,
  ) as INewsFeedData;
  return {newsFeed};
};

export {useNewsFeed, useSingleNewsFeed};
