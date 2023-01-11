/* eslint-disable @typescript-eslint/no-explicit-any */
import {useQuery} from 'react-query';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';

interface IResponseData {
  data: any;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

const fetchCategories = async () => {
  try {
    const url = `${config.PRIVACY_API_URL}interests/categories`;
    const response: IResponseData = await client.get(url);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
};

const useCategories = () => {
  const cacheKey = QueryKeys.categories;
  return useQuery(cacheKey, () => fetchCategories());
};

export {useCategories};
