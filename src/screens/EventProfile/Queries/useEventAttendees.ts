/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';

import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {EventRoles, EventStatus, IAttendeesData} from '../../Events/types/EventInterfaces';

export interface IResponseData {
  code: number;
  data: {
    attendees: IAttendeesData[];
    totalCount: number;
  };
  error: boolean;
  message: string;
  status: number;
}

export interface IEventAttendeesPage {
  data: IAttendeesData[];
  totalCount: number;
  pageNo: number;
}

const PER_PAGE = 20;

type EventParams = {
  limit: number;
  offset: number;
  status?: string;
  role?: string;
};

async function fetchAttedees(
  eventId: string,
  pageNo: number,
  data: AttendeesFilter | undefined,
): Promise<IEventAttendeesPage | undefined> {
  try {
    const offset = (pageNo - 1) * PER_PAGE;
    const params: EventParams = {
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
    const url = `${config.EVENTS_API_URL}event/${eventId}/attendees?limit=${PER_PAGE}&offset=${offset}&roles=admin,owner`;
    const response: IResponseData = await client.get(url);

    return {data: response.data.attendees, totalCount: response.data.totalCount, pageNo};
  } catch (error) {
    return Promise.reject(error);
  }
}

type AttendeesFilter = {
  status?: EventStatus;
  role?: EventRoles[];
};

const useEventAttendees = (
  eventId: string,
  filter: AttendeesFilter | undefined,
  enabled: boolean,
) => {
  const cacheKey = [QueryKeys.eventAttendees, eventId];
  let queryEnabled = eventId !== '' && enabled;
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
    ({pageParam = 1}) => fetchAttedees(eventId, pageParam, filter),
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
  const attendeesList: IAttendeesData[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        attendeesList.push(...page.data);
      }
    });
  }

  return {
    ...listQuery,
    attendeesList,
    onEndReached,
  };
};

export {useEventAttendees};
