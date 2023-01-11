/* eslint-disable @typescript-eslint/no-explicit-any */
import {useQuery} from 'react-query';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import useUserInfo from '../../../hooks/useUserInfo';

export interface IResponseData {
  data: any;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

const fetchSettings = async (documentId: string) => {
  try {
    const url = `${config.PRIVACY_API_URL}${documentId}/settings`;
    const response: IResponseData = await client.get(url);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
};

const useSettings = () => {
  const cacheKey = QueryKeys.stepSetting;
  const {user} = useUserInfo();
  const {documentId} = user;
  return useQuery(cacheKey, () => fetchSettings(documentId));
};

export {useSettings};
