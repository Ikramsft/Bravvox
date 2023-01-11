/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';
import client from '../../utils/ApiClient';
import {config} from '../../config';
import {QueryKeys} from '../../utils/QueryKeys';
import {IGroupMemberPage} from '../Groups/Queries/useMembersList';
import {IComments} from '../Home/types/NewsFeedInterface';

export interface ICommentsResponseData {
  data: IComments[];
  error: boolean;
  message: string;
  status: number;
}

export interface ICommentsResponse {
  data: {comments: IComments[]};
  error: boolean;
  message: string;
  status: number;
}

export interface IFeedPage {
  data: IComments[];
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
const PER_PAGE = 10;
async function fetchComments(
  pageNumber: number,
  perPage: number,
  contentId: string,
  from: string,
  id: string,
): Promise<IFeedPage | undefined> {
  try {
    let url = '';
    const offset = (pageNumber - 1) * PER_PAGE;
    switch (from) {
      case 'home':
        url = `${config.COMMENT_API_URL}getpostcomments?perPage=${perPage}&pageNo=${pageNumber}&contentId=${contentId}`;
        break;
      case 'profile':
        url = `${config.CONTENT_API_URL}getpostcomments?perPage=${perPage}&pageNo=${pageNumber}&contentId=${contentId}`;
        break;
      case 'group':
        url = `${config.GROUP_API_URL}group/${id}/post/${contentId}/comments?offset=${offset}&limit=${perPage}`;
        break;
      case 'event':
        url = `${config.EVENTS_API_URL}event/${id}/post/${contentId}/comments?offset=${offset}&limit=${perPage}`;
        break;
      case 'business':
        url = `${config.BUSINESS_PAGE_API_URL}businessPage/${id}/post/${contentId}/comments?offset=0&limit=100`;
        break;

      default:
        break;
    }
    if (from === 'group' || from === 'event') {
      const response: ICommentsResponse = await client.get(url);
      if (response.data.comments.length > 0 && !response.error) {
        return {data: response.data.comments, pageNo: pageNumber, hasNext: true};
      }
      return {data: [], pageNo: pageNumber, hasNext: false};
    }
    const response: ICommentsResponseData = await client.get(url);
    if (response.data.length > 0 && !response.error) {
      return {data: response.data, pageNo: pageNumber, hasNext: true};
    }
    return {data: [], pageNo: pageNumber, hasNext: false};
  } catch (error) {
    return {data: [], pageNo: pageNumber, hasNext: false};
  }
}

const usePostComments = (documentId: string, from = 'home', id = '', enabled = true) => {
  const cacheKey = [QueryKeys.postComments, documentId];
  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchComments(pageParam, 10, documentId, from, id),
    {
      getNextPageParam: lastPage => {
        return lastPage?.hasNext ? lastPage.pageNo + 1 : null;
      },
      enabled: documentId !== undefined && enabled,
    },
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isFetched,
    isRefetching,
  } = listQuery;

  const commentsList: IComments[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        commentsList.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    commentsList,
    onEndReached,
    isFetching,
    isFetched,
    isRefetching,
  };
};

export {usePostComments};
