/**
 * @format
 */
import {useQuery} from 'react-query';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IResponseData} from '../Types/NoticiationInterface';

export type NotificationType = 'all' | 'follows' | 'requests' | 'invitesAll';
async function fetchNotifications(notificationType: NotificationType) {
  const params: any = {
    offset: 1,
    limit: 25,
    reactions: false,
    follows: false,
    requests: false,
    comments: false,
    invitesAll: false,
    groupInvites: false,
    businessPageInvites: false,
    eventInvites: false,
    milestones: false,
  };
  switch (notificationType) {
    case 'follows':
      params.follows = true;
      break;
    case 'requests':
      params.requests = true;
      break;
    case 'invitesAll':
      params.invitesAll = true;
      break;
    default:
      break;
  }
  const response: IResponseData = await client.get(
    `${config.NOTIFICATION_PAGE_API_URL}notifications`,
    {params},
  );
  if (!response.data?.length) {
    return [];
  }
  return response.data;
}

async function viewNotifications() {
  const response = await client.post(`${config.NOTIFICATION_PAGE_API_URL}notifications/viewed`);
  return response.data;
}

const useNotificationsList = (type: NotificationType) => {
  const cacheKey = [QueryKeys.notifications, type];
  return useQuery(cacheKey, () => fetchNotifications(type));
};

const notificationViewed = () => {
  return viewNotifications();
};

export {useNotificationsList, notificationViewed};
