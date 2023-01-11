/**
 * @format
 */
import {useInfiniteQuery} from 'react-query';
import {useCallback} from 'react';
import {config} from '../../../config';
import client from '../../../utils/ApiClient';
import {IComments} from '../types/CommentsInterface';
import {QueryKeys} from '../../../utils/QueryKeys';

export interface ICommentResponse {
  data: IComments[];
  error: boolean;
  message: string;
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Key: string]: any;
}
export interface ICommentGroupResponse {
  data: {comments: IComments[]};
  error: boolean;
  message: string;
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Key: string]: any;
}

export interface ICommentBusinessResponse {
  data: {comments: IComments[]};
  error: boolean;
  message: string;
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Key: string]: any;
}
export interface ICommentsPage {
  data: IComments[];
  pageNo: number;
  hasNext: boolean;
}
export interface ICommentsPages {
  pages: ICommentsPage[];
  pageParams?: number[];
}

async function fetchComments(
  pageParam: string,
  documentId: string,
  from: string,
  id: string | undefined,
): Promise<ICommentsPage | undefined> {
  try {
    let url = '';
    switch (from) {
      case 'home':
        url = `${config.CONTENT_API_URL}getcomments/${documentId}`;
        break;
      case 'profile':
        url = `${config.CONTENT_API_URL}getcomments/${documentId}`;
        break;
      case 'group':
        url = `${config.GROUP_API_URL}group/${id}/post/${documentId}/comments?offset=0&limit=100`;
        break;
      case 'event':
        url = `${config.EVENTS_API_URL}event/${id}/post/${documentId}/comments?offset=0&limit=100`;
        break;
      case 'business':
        url = `${config.BUSINESS_PAGE_API_URL}businessPage/${id}/post/${documentId}/comments?offset=0&limit=100`;
        break;
     
      default:
        break;
    }
    const response: ICommentGroupResponse = await client.get(url);
    switch (from) {
      case 'home':
      case 'profile':
        if (response.data.comments.length > 0 && !response.error) {
          return {data: response.data.comments, pageNo: 1, hasNext: true};
        }
        break;
      default:
        if (response.data.comments.length > 0 && !response.error) {
          return {data: response.data.comments, pageNo: 1, hasNext: true};
        }
        break;
    }
    return {data: [], pageNo: 1, hasNext: false};
  } catch (error) {
    return {data: [], pageNo: 1, hasNext: false};
  }
}

const useComments = (documentId = '', from = '', id = '') => {
  const cacheKey = [QueryKeys.comments, documentId, from, id];

  const listQuery = useInfiniteQuery(
    cacheKey,
    ({pageParam = 1}) => fetchComments(pageParam, documentId, from, id),
    {
      getNextPageParam: lastPage => {
        return lastPage?.hasNext ? lastPage.pageNo + 1 : null;
      },
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const comments: IComments[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        comments.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    comments,
    onEndReached,
  };
};
export {useComments};
