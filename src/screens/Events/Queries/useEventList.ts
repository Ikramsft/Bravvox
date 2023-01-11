/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';

import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';

export const EventTypes = ['popular', 'myEvents', 'recent'] as const;

export type EventTypes = typeof EventTypes[number] | '';
export interface IResponseData {
  data: {
    events: IEventData[];
    totalCount: number;
  };
  error: boolean;
  message: string;
  status: number;
  code: number;
}

export interface IEventDataPage {
  data: IEventData[];
  pageNo: number;
  hasNext: boolean;
}

export interface IEventData {
  avatarURL: string;
  croppedAvatarURL: string;
  id: string;
  eventEndTime: string;
  eventStartTime: string;
  title: string;
  pictureURL: string;
  totalAttendees: string;
  influencerStatus: boolean;
  location?: string;
  status?: string;
}

const PER_PAGE = 20;

async function fetchEvent(type: string, pageNo: number): Promise<IEventDataPage | undefined> {
  try {
    const offset = (pageNo - 1) * PER_PAGE;
    const url = `${config.EVENTS_API_URL}events?offset=${offset}&limit=${PER_PAGE}&type=${type}`;
    const response: IResponseData = await client.get(url);
    if (response.data.events.length > 0 && !response.error) {
      return {data: response.data.events, pageNo, hasNext: true};
    }
    return {data: [], pageNo, hasNext: false};
  } catch (error) {
    return Promise.reject(error);
  }
}

export type EventType = 'popular' | 'myEvents' | 'recent' | '';

const useEventList = (type: EventType) => {
  const cacheKey = [QueryKeys.eventList, type];
  const listQuery = useInfiniteQuery(cacheKey, ({pageParam = 1}) => fetchEvent(type, pageParam), {
    getNextPageParam: lastPage => {
      return lastPage?.hasNext ? lastPage.pageNo + 1 : null;
    },
    enabled: type !== '',
  });

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const eventList: IEventData[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        eventList.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    eventList,
    onEndReached,
  };
};

export {useEventList};
