import React from 'react';
import {useDisclose, Text} from 'native-base';
import {useQueryClient} from 'react-query';
import {useConfirmModal} from '../../../components/CofirmationModel';
import {Title} from '../../../components/Typography';
import {showSnackbar} from '../../../utils/SnackBar';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {AttendeeFilter, IEventAttendeePages} from './useAttendees';
import {IResponseData as IEventProfile} from './useEventProfile';
import {IEventData} from '../../Events/Queries/useEventList';
import {truncateUsername} from '../../../utils';

export interface IResponseData {
  data?: null;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

export interface IResponseDataList {
  data: IEventData[];
  error: boolean;
  message: string;
  status: number;
  total: number;
}
export interface IEventPage {
  data: IEventData[];
  totalCount: number;
  pageNo: number;
}
export interface IEventPages {
  pages: IEventPage[];
  pageParams?: number[];
}

export enum EventAttendeeStatus {
  ACCEPTED = 'accepted',
  INVITED = 'invited',
  PENDING = 'pending',
  REJECTED = 'rejected',
  BLOCKED = 'blocked',
}

const useAttendeeOperations = (filter: AttendeeFilter) => {
  const queryClient = useQueryClient();
  const sheetActions = useDisclose();
  const confirm = useConfirmModal();

  const addEventAttendeeToCache = async (key: string[], attendeeId: string, status: string) => {
    const response = await queryClient.getQueryData<IEventAttendeePages>(key);
    if (response) {
      const {pages} = response;
      const updatedPages = pages.map(c => {
        const {data: attendees, ...rest} = c;
        let updatedPosts = [];
        if (status === 'rejected') {
          updatedPosts = attendees.filter(x => x.user_id !== attendeeId);
        } else {
          updatedPosts = attendees.map(attendee => {
            if (attendee.user_id === attendeeId || attendee.id === attendeeId) {
              return {...attendee, status};
            }
            return attendee;
          });
        }
        return {...rest, data: updatedPosts};
      });
      const updateFeed = {...response, pages: updatedPages};
      queryClient.setQueryData<IEventAttendeePages>(key, updateFeed);
    }
  };

  const addEventListToCache = async (key: string[], eventId: string) => {
    const response = await queryClient.getQueryData<IEventPages>(key);
    if (response) {
      const {pages} = response;
      const updatedPages = pages.map(c => {
        const {data: events, ...rest} = c;
        const updated = events.map((event: IEventData) => {
          if (event.id === eventId) {
            return {...event, totalAttendees: (Number(event.totalAttendees) + 1).toString()};
          }
          return event;
        });
        return {...rest, data: updated};
      });
      const updateFeed = {...response, pages: updatedPages};
      queryClient.setQueryData<IEventPages>(key, updateFeed);
    }
  };

  const updateEventProfileInCache = async (key: string[]) => {
    const response = await queryClient.getQueryData<IEventProfile>(key);
    if (response) {
      const totalAttendees = response?.data?.totalAttendees;
      const updatedCount = Number(totalAttendees) + 1;
      const data = {...response.data, totalAttendees: updatedCount.toString()};
      const updatedProfile = {...response, data};
      queryClient.setQueryData<IEventProfile>(key, updatedProfile);
    }
  };

  const fetchAprooveAttendee = async (userId: string, eventId: string) => {
    try {
      const url = `${config.EVENTS_API_URL}event/${eventId}/user/${userId}/approve`;
      const response: IResponseData = await client.post(url);
      if (response.status === 200) {
        const cacheKey = [QueryKeys.useEventAttendees, eventId];
        if (filter) {
          const {status, role} = filter;
          if (status) {
            cacheKey.push(status);
          }

          if (role) {
            cacheKey.push(role.toString());
          }
        }
        const cacheKeyProfile = [QueryKeys.eventProfileDetails, eventId];
        const cacheKeyList = [QueryKeys.eventList, 'myEvents'];

        updateEventProfileInCache(cacheKeyProfile);
        addEventAttendeeToCache(cacheKey, userId, 'accepted');
        addEventListToCache(cacheKeyList, eventId);

        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  const fetchRejectAttendee = async (userId: string, eventId: string) => {
    try {
      const url = `${config.EVENTS_API_URL}event/${eventId}/user/${userId}/reject`;
      const response: IResponseData = await client.post(url);
      if (response.status === 200) {
        const cacheKey = [QueryKeys.useEventAttendees, eventId];
        if (filter) {
          const {status, role} = filter;
          if (status) {
            cacheKey.push(status);
          }

          if (role) {
            cacheKey.push(role.toString());
          }
        }
        addEventAttendeeToCache(cacheKey, userId, 'rejected');
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  const fetchBlockAttendee = async (userId: string, eventId: string) => {
    try {
      const url = `${config.EVENTS_API_URL}event/${eventId}/attendee/${userId}/block`;
      const response: IResponseData = await client.post(url);
      if (response.status === 200) {
        const cacheKey = [QueryKeys.useEventAttendees, eventId];
        if (filter) {
          const {status, role} = filter;
          if (status) {
            cacheKey.push(status);
          }

          if (role) {
            cacheKey.push(role.toString());
          }
        }
        addEventAttendeeToCache(cacheKey, userId, 'blocked');
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  const fetchUnblockAttendee = async (userId: string, eventId: string) => {
    try {
      const url = `${config.EVENTS_API_URL}event/${eventId}/attendee/${userId}/unblock`;
      const response: IResponseData = await client.post(url);
      if (response.status === 200) {
        const cacheKey = [QueryKeys.useEventAttendees, eventId];
        if (filter) {
          const {status, role} = filter;
          if (status) {
            cacheKey.push(status);
          }

          if (role) {
            cacheKey.push(role.toString());
          }
        }
        addEventAttendeeToCache(cacheKey, userId, 'accepted');
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  const handleApprove = (userId: string, userName: string, eventId: string) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Approve User</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to approve </Text>
          <Title>@{truncateUsername(userName)}</Title>
          <Text> ?</Text>
        </Text>
      ),
      onConfirm: () => {
        fetchAprooveAttendee(userId, eventId);
      },
      onCancel: () => {
        setTimeout(() => {
          handleReject(userId, userName, eventId);
        }, 500);
      },
      submitLabel: 'Approve',
      cancelLabel: 'Reject',
    });
  };

  const handleReject = (userId: string, userName: string, eventId: string) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Reject User</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to reject </Text>
          <Title>@{truncateUsername(userName)}</Title>
          <Text> ?</Text>
        </Text>
      ),
      onConfirm: () => {
        fetchRejectAttendee(userId, eventId);
      },
      submitLabel: 'Confirm',
      cancelLabel: 'Cancel',
    });
  };

  const handleBlock = (userId: string, userName: string, eventId: string) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Block User</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to block </Text>
          <Title>@{truncateUsername(userName)}</Title>
          <Text> ?</Text>
        </Text>
      ),
      onConfirm: () => {
        fetchBlockAttendee(userId, eventId);
      },
      submitLabel: 'Confirm',
      cancelLabel: 'Cancel',
    });
  };

  const handleUnblock = (userId: string, userName: string, eventId: string) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Unblock User</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to unblock </Text>
          <Title>@{truncateUsername(userName)}</Title>
          <Text> ?</Text>
        </Text>
      ),
      onConfirm: () => {
        fetchUnblockAttendee(userId, eventId);
      },
      submitLabel: 'Confirm',
      cancelLabel: 'Cancel',
    });
  };

  return {
    ...sheetActions,
    handleApprove,
    handleReject,
    handleBlock,
    handleUnblock,
  };
};

export {useAttendeeOperations};
