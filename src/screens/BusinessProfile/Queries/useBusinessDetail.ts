/**
 * @format
 */
import {useQuery} from 'react-query';

import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {INewBusinessData} from '../types/BusinessInterfaces';

export interface IResponseData {
  data?: INewBusinessData;
  error: boolean;
  message: string;
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Key: string]: any;
}

async function fetchBusinessProfile(businessId: string): Promise<IResponseData> {
  try {
    const url = `${config.BUSINESS_PAGE_API_URL}businessPage/${businessId}`;
    const response: IResponseData = await client.get(url);
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return error as IResponseData;
  }
}

const useBusinessProfile = (businessId = '', enabled = true) => {
  const cacheKey = [QueryKeys.businessDetails, businessId];
  return useQuery(cacheKey, () => fetchBusinessProfile(businessId), {enabled});
};

export {useBusinessProfile};
