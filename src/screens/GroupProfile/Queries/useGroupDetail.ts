/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @format
 */
import {useQuery} from 'react-query';

import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IGroupCardInfo} from '../../../screens/Groups/types/GroupInterfaces';

export interface IResponseData {
  data: IGroupCardInfo;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

async function fetchGroupProfile(groupId: string): Promise<IResponseData> {
  try {
    const url = `${config.GROUP_PROFILE_DETAIL_API_URL}group/${groupId}`;
    const response: IResponseData = await client.get(url);
    return response;
  } catch (error: any) {
    return error as IResponseData;
  }
}

const useGroupProfile = (groupId = '', enabled = true) => {
  const cacheKey = [QueryKeys.groupProfileDetails, groupId];
  return useQuery(cacheKey, () => fetchGroupProfile(groupId), {enabled});
};

export {useGroupProfile};
