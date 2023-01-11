/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @format
 */
import {useQuery} from 'react-query';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import useUserInfo from '../../../hooks/useUserInfo';

export interface IResponseData {
  data?: any;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

export interface IPrivacySetting {
  auto_approve_follower: boolean;
  cmc: number;
  notification_preference: string;
  privacy: string;
  relationship_notification_on: boolean;
  set_follower: boolean;
  set_subscriber: boolean;
}

async function fetchPrivacySettings(id: string): Promise<IResponseData> {
  try {
    const url = `${config.PRIVACY_API_URL}${id}/settings`;
    const res: IResponseData = await client.get(url);
    return res;
  } catch (error: any) {
    return error as IResponseData;
  }
}

const useFetchPrivacy = () => {
  const user = useUserInfo();
  const {documentId} = user;
  const cacheKey = [QueryKeys.privacySetting];
  return useQuery(cacheKey, () => fetchPrivacySettings(documentId || ''));
};

export {useFetchPrivacy};
