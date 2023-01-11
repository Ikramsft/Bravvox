/**
 * @format
 */
import {useQuery} from 'react-query';

import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IEventMemberStatusState} from '../../Events/types/EventInterfaces';

export interface IResponseData {
  data?: IEventMemberStatusState;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

async function checkUserIsEventMember(eventId: string): Promise<IResponseData> {
  try {
    const url = `${config.EVENTS_API_URL}event/${eventId}/attendee`;
    const res: IResponseData = await client.get(url);
    return res;
  } catch (error: any) {
    return error as IResponseData;
  }
}

const useEventMemberCheck = (eventId = '', enabled: boolean) => {
  const cacheKey = [QueryKeys.eventMemberCheck, eventId];
  return useQuery(cacheKey, () => checkUserIsEventMember(eventId), {enabled});
};

export {useEventMemberCheck};
