/* eslint-disable @typescript-eslint/no-explicit-any */
import {useQueryClient} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import {config} from '../../../config';
import client from '../../../utils/ApiClient';
import {QueryKeys} from '../../../utils/QueryKeys';
import {showSnackbar} from '../../../utils/SnackBar';
import {IResponseData as IEventProfile} from './useEventProfile';
import {IResponseData as IEventAttendee} from './useEventMemberCheck';
import {RootNavigationType} from '../../Home';

export interface IEventResponseData {
  data: any;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}
async function cancelEventRequest(eventId: string): Promise<IEventResponseData> {
  try {
    const url = `${config.EVENTS_API_URL}event/${eventId}/cancel`;
    const res: IEventResponseData = await client.post(url);
    return res;
  } catch (error: any) {
    return error;
  }
}

async function deActivateEventRequest(eventId: string): Promise<IEventResponseData> {
  try {
    const url = `${config.EVENTS_API_URL}event/${eventId}/deactivate`;
    const res: IEventResponseData = await client.post(url);
    return res;
  } catch (error: any) {
    return error;
  }
}

async function reActivateEventRequest(eventId: string): Promise<IEventResponseData> {
  try {
    const url = `${config.EVENTS_API_URL}event/${eventId}/reactivate`;
    const res: IEventResponseData = await client.post(url);
    return res;
  } catch (error: any) {
    return error;
  }
}

async function attendAction(
  eventId: string,
  isMember: boolean,
  status: string,
  from: string,
): Promise<IEventResponseData> {
  try {
    let payload = null;
    switch (status) {
      case 'attending':
        payload = {attendeeResponseStatus: 'attending'};
        break;
      case 'maybe':
        payload = {attendeeResponseStatus: 'maybe'};
        break;
      case 'not_attending':
        payload = {attendeeResponseStatus: 'not_attending'};
        break;
      default:
        break;
    }

    const url = `${config.EVENTS_API_URL}event/${eventId}/attend`;
    const res: IEventResponseData =
      isMember || from === 'notifications'
        ? await client.patch(url, payload)
        : await client.post(url, payload);
    return res;
  } catch (error: any) {
    return error;
  }
}

async function cancelAttendRequest(
  eventId: string,
  attendeeId: string,
): Promise<IEventResponseData> {
  try {
    const url = `${config.EVENTS_API_URL}event/${eventId}/attendee/${attendeeId}/cancel`;
    const res: IEventResponseData = await client.post(url);
    return res;
  } catch (error: any) {
    return error;
  }
}

const useEventOperations = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<RootNavigationType>();

  const handleCancelEventCache = async (eventId: string) => {
    const cacheKey = [QueryKeys.eventProfileDetails, eventId];
    const cacheKeyAttendee = [QueryKeys.eventMemberCheck, eventId];
    const response = await queryClient.getQueryData<IEventProfile>(cacheKey);
    const responseAttendee = await queryClient.getQueryData<IEventAttendee>(cacheKeyAttendee);
    let newResponse;
    let newResponseAttendee;
    if (response) {
      newResponse = {...response};
      newResponseAttendee = {...responseAttendee};
      newResponse.data.status = 'canceled';
      newResponseAttendee.data = null;
      queryClient.setQueryData<IEventProfile>(cacheKey, newResponse);
      queryClient.setQueryData<IEventAttendee>(cacheKeyAttendee, newResponseAttendee);
    }
  };

  const handleDeactivateEventCache = (eventId: string) => {
    const detailCacheKey = [QueryKeys.eventProfileDetails, eventId];
    queryClient.removeQueries(detailCacheKey);

    const cache = [QueryKeys.eventMemberCheck, eventId];
    queryClient.removeQueries(cache);

    const memberCacheKey = [QueryKeys.eventMembers, eventId];
    queryClient.removeQueries(memberCacheKey);

    navigation.goBack();
  };

  const reloadGroupProfileData = async (key: string[], status = '') => {
    const response = await queryClient.getQueryData<IEventProfile>(key);
    if (response) {
      const {data} = response;
      const updateFeed = {...response, data: {...data, status}};
      queryClient.setQueryData<IEventProfile>(key, updateFeed);
    }
  };

  const eventCancel = async (eventId = '') => {
    try {
      const response: IEventResponseData = await cancelEventRequest(eventId);
      if (response.status === 200) {
        handleCancelEventCache(eventId);
        showSnackbar({message: response.message, type: 'success'});
      }
      if (response.status === 400) {
        showSnackbar({
          message: 'You can not cancel Event after its start and end date/time.',
          type: 'danger',
        });
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  const eventDeactivate = async (eventId = '') => {
    try {
      const response: IEventResponseData = await deActivateEventRequest(eventId);
      if (response.status === 200) {
        handleDeactivateEventCache(eventId);
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  const eventReactivate = async (eventId = '') => {
    try {
      const response: IEventResponseData = await reActivateEventRequest(eventId);
      if (response.status === 200) {
        const cacheKey = [QueryKeys.eventProfileDetails, eventId];
        reloadGroupProfileData(cacheKey, 'active');

        const cache = [QueryKeys.eventMemberCheck, eventId];
        queryClient.invalidateQueries(cache);

        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  const sendAttendAction = async (
    eventId = '',
    isMember = false,
    status: string,
    from: string | undefined,
  ) => {
    try {
      const response: IEventResponseData = await attendAction(
        eventId,
        isMember,
        status,
        from || '',
      );
      if (response.status === 200) {
        const cache = [QueryKeys.eventMemberCheck, eventId];
        queryClient.invalidateQueries(cache);

        const secondCache = [QueryKeys.eventProfileDetails, eventId];
        queryClient.invalidateQueries(secondCache);

        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  const eventCancelAttendRequest = async (eventId = '', attendeeId = '') => {
    try {
      const response: IEventResponseData = await cancelAttendRequest(eventId, attendeeId);
      if (response.status === 200) {
        const cache = [QueryKeys.eventMemberCheck, eventId];
        queryClient.invalidateQueries(cache);

        const cache2 = [QueryKeys.eventProfileDetails, eventId];
        queryClient.invalidateQueries(cache2);

        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  return {
    eventCancel,
    eventDeactivate,
    eventReactivate,
    sendAttendAction,
    eventCancelAttendRequest,
  };
};

export {useEventOperations};
