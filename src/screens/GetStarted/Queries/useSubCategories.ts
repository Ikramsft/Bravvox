/* eslint-disable @typescript-eslint/no-explicit-any */
import {useQuery} from 'react-query';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {ICategory} from '../StepThree';


export interface ISubCategory {
  category: ICategory;
  subcategories: ICategory[];
}
interface IResponseData {
  data: ISubCategory[];
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}
interface IRequestPayload {
  categories: string;
}

const fetchSubCategories = async (data: IRequestPayload) => {
  try {
    const url = `${config.PRIVACY_API_URL}interests/subcategories?id=${data.categories}`;
    const response: IResponseData = await client.get(url);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
};

const useSubCategories = (data: IRequestPayload) => {
  const cacheKey = QueryKeys.subCategories;
  return useQuery(cacheKey, () => fetchSubCategories(data));
};

export {useSubCategories};
