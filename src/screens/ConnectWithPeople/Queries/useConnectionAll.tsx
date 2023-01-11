/**
 * @format
 */
import {useQuery} from 'react-query';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {People} from '../types/ConnectionInterface';

export interface IConnectionAllResponseData {
  data: Data;
  error?: boolean;
  message?: string;
  status?: number;
  code?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}

export interface Data {
  People: People[];
}

async function fetchConnectionAll(): Promise<IConnectionAllResponseData | undefined> {
  try {
    const url = `${config.CONNECTIONS_API_URL}seeAll`;
    const response: IConnectionAllResponseData = await client.get(url);
    return response;
  } catch (error: any) {
    return error as IConnectionAllResponseData;
  }
}
const useConnectionAll = () => {
  const cacheKey = [QueryKeys.connectionAll];
  return useQuery(cacheKey, () => fetchConnectionAll());
};

export {useConnectionAll};
