/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @format
 */
import {useQuery} from 'react-query';

import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';

import {INewEventData} from '../../Events/types/EventInterfaces';

export interface IEventDetails {
  avatarURL: string;
  avatarViewAttribute: any;
  details: string;
  id: string;
  isModerated: boolean;
  isPostingOpen: boolean;
  isPublic: boolean;
  location: string;
  owner: {
    attendeeResponseStatus: string;
    coverPic: string;
    id: string;
    name: string;
    profilePic: string;
    profilePicThumb: string;
    role: string;
    status: string;
    userName: string;
    user_id: string;
  };

  eventEndTime: string;
  eventStartTime: string;
  pictureURL: string;
  pictureViewAttribute: any;
  requireAttendeeApproval: boolean;
  status: string;
  subtitle: string;
  title: string;
  totalAttendees: string;
  [Key: string]: any;
}

export interface IResponseData {
  data: INewEventData;

  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

async function fetchEventProfile(eventId: string): Promise<IResponseData> {
  try {
    const url = `${config.EVENTS_API_URL}event/${eventId}`;
    const response: IResponseData = await client.get(url);
    return response;
  } catch (error: any) {
    return error as IResponseData;
  }
}

const useEventProfile = (eventId = '', enabled = true) => {
  const cacheKey = [QueryKeys.eventProfileDetails, eventId];
  return useQuery(cacheKey, () => fetchEventProfile(eventId), {enabled});
};

export {useEventProfile};
