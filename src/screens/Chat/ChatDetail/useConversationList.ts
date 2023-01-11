/**
 * @format
 */
import {useQuery} from 'react-query';
import moment from 'moment';

import {config} from '../../../config';
import {IUserData} from '../../../redux/reducers/user/UserInterface';
import client from '../../../utils/ApiClient';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IChannelMessage, IChannelHistoryResponseData, IMemberData} from '../types/ChatInterfaces';

export interface IConversionInfo {
  member: IMemberData | undefined;
  loggedInUser: IUserData;
  channelId: string;
}

async function fetchHistory(info: IConversionInfo): Promise<IChannelMessage[] | undefined> {
  try {
    const {channelId, loggedInUser, member} = info;
    const url = `${config.MESSENGER_API_URL}api/conversation/history/${channelId}`;
    const response: IChannelHistoryResponseData = await client.get(url);
    const msgs = response.data.map(m => {
      if (m.self) {
        m.user = {
          _id: loggedInUser.documentId,
          name: loggedInUser.name,
          avatar: loggedInUser.profilePic,
        };
      }
      if (!m.self && member) {
        m.user = {
          _id: member.userId,
          name: member.name,
          avatar: member.profilePic,
        };
      }
      // eslint-disable-next-line no-underscore-dangle
      m._id = m.id;
      m.text = m.content;
      m.createdAt = moment(m.createAt).toDate();
      return m;
    });
    return msgs;
  } catch (error) {
    return [];
  }
}

export const useConversationList = (info: IConversionInfo) => {
  const cacheKey = [QueryKeys.oneToOneHistory, info.channelId];
  return useQuery(cacheKey, () => fetchHistory(info), {enabled: info.channelId !== ''});
};
