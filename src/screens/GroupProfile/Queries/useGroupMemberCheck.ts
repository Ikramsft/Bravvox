/**
 * @format
 */
import {useQuery} from 'react-query';

import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IGroupMemberStatusState} from '../../../screens/Groups/types/GroupInterfaces';

export interface IResponseData {
  data?: IGroupMemberStatusState;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

async function checkUserIsMember(groupId: string): Promise<IResponseData> {
  try {
    const url = `${config.GROUP_API_URL}group/${groupId}/member`;
    const res: IResponseData = await client.get(url);
    return res;
  } catch (error: any) {
    return error as IResponseData;
  }
}

const useGroupMemberCheck = (groupId = '', enabled: boolean) => {
  const cacheKey = [QueryKeys.groupMemberCheck, groupId];
  return useQuery(cacheKey, () => checkUserIsMember(groupId), {enabled});
};

export {useGroupMemberCheck};
