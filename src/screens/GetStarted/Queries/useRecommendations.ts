/* eslint-disable @typescript-eslint/no-explicit-any */
import {useQuery} from 'react-query';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';

export interface IResponseData {
  data: any;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

const fetchRecommendations = async () => {
  try {
    const url = `${config.PRIVACY_API_URL}recommendations`;
    const response: IResponseData = await client.get(url);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
};

const useRecommendations = () => {
  const cacheKey = QueryKeys.recommendations;
  return useQuery(cacheKey, () => fetchRecommendations());
};

export {useRecommendations};
