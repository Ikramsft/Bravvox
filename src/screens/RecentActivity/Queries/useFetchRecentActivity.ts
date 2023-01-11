/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @format
 */
import {useQuery} from 'react-query';
import client from '../../../utils/ApiClient';
import {QueryKeys} from '../../../utils/QueryKeys';

export interface IResponseData {
  data?: any;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

export interface IPrivacySetting {
  requireMyApprovalToFollowMe: boolean;
  taggedContentInMyNewsFeedApproval: boolean;
}

async function fetchRecentActivity(): Promise<IResponseData> {
  try {
    const url = ``;
    const res: IResponseData = await client.get(url);
    return res;
  } catch (error: any) {
    return error as IResponseData;
  }
}

const useFetchRecentActivity = () => {
  const cacheKey = [QueryKeys.privacySetting];
  return useQuery(cacheKey, () => fetchRecentActivity());
};

export {useFetchRecentActivity};
