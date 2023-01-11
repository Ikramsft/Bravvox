/**
 * @format
 */
import {useCallback} from 'react';
import {useInfiniteQuery} from 'react-query';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {EventMemberFilterStatus, EventRoles} from '../../Events/types/EventInterfaces';

export type AttendeeResponseStatus = 'attending' | 'not_attending' | '';

export enum AttenDeeResponseStatusTypes {
  ATTENDING = 'attending',
  NOT_ATTENDING = 'not_attending',
  MAYBE = 'maybe',
  DID_NOT_RESPOND = 'did_not_respond',
}

const NAV_ITEMS_RESPONSE_STATUS: any = {
  accepted: 'attending',
  'not attending': 'not_attending',
  maybe: 'maybe',
  'did not respond': 'did_not_respond',
};

const PER_PAGE = 20;

export interface EventAttendeeUserData {
  attendeeResponseStatus: string;
  coverPic: string;
  id: string;
  name: string;
  profilePic: string;
  profilePicThumb: string;
  role: EventRoles;
  status: string;
  userName: string;
  user_id: string;
  influencerStatus: boolean;
}
export type AttendeeFilter = {
  status?: EventMemberFilterStatus;
  role?: EventRoles[];
};
export interface IResponseData {
  data: {
    attendees: EventAttendeeUserData[];
    totalCount: number;
  };
  error: boolean;
  message: string;
  status: number;
}
export interface IEventAttendeePage {
  data: EventAttendeeUserData[];
  totalCount: number;
  pageNo: number;
}
export interface IEventAttendeePages {
  pages: IEventAttendeePage[];
  pageParams?: number[];
}
type EventParams = {
  limit: number;
  offset: number;
  status?: string;
  role?: string;
};

async function fetchAttendees(
  eventId: string,
  pageNo = 1,
  data: AttendeeFilter | undefined,
  attendeeResponseStatus: string,
  isManage = false,
): Promise<IEventAttendeePage | undefined> {
  try {
    if (
      data?.status === 'not attending' ||
      data?.status === 'maybe' ||
      data?.status === 'did not respond'
    ) {
      data.status = 'all';
    }
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
    const responding = attendeeResponseStatus ? `&response=${attendeeResponseStatus}` : '';

    let url = `${config.EVENTS_API_URL}event/${eventId}/attendees?limit=${PER_PAGE}&offset=${offset}&status=${params.status}${responding}`;
    if (isManage) {
      url = `${
        config.EVENTS_API_URL
      }event/${eventId}/attendees?limit=${PER_PAGE}&offset=${offset}&roles=${data?.role?.join(
        ',',
      )}`;
    }
    const response: IResponseData = await client.get(url);

    return {data: response.data.attendees, totalCount: response.data.totalCount, pageNo};
  } catch (error) {
    return Promise.reject(error);
  }
}

const useAttendees = (
  eventId: string,
  filter: AttendeeFilter,
  enabled: boolean,
  isManage = false,
) => {
  const attendeeResponseStatus = NAV_ITEMS_RESPONSE_STATUS[filter?.status || ''];

  const cacheKey = [QueryKeys.useEventAttendees, eventId];
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
    ({pageParam = 1}) =>
      fetchAttendees(eventId, pageParam, filter, attendeeResponseStatus, isManage),
    {
      getNextPageParam: (lastPage, allPages) => {
        const totalRecords = allPages[0]?.totalCount ?? 0;
        const hasRecords = allPages.reduce((sum, e) => sum + (e?.data.length ?? 0), 0);
        const pageNo = hasRecords < totalRecords ? (lastPage?.pageNo ?? 0) + 1 : null;
        return pageNo;
      },
      enabled: queryEnabled,
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const attendeeList: EventAttendeeUserData[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        attendeeList.push(...page.data);
      }
    });
    // console.log(data);
  }

  return {
    ...listQuery,
    attendeeList,
    onEndReached,
  };
};

export {useAttendees};
