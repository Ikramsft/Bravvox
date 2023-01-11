/**
 * @format
 */
import {useQuery} from 'react-query';

import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IBusinessMemberStatusState} from '../types/BusinessInterfaces';

export interface IResponseData {
  data?: IBusinessMemberStatusState;
  error: boolean;
  message: string;
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Key: string]: any;
}

async function checkUserIsMember(businessId: string): Promise<IResponseData> {
  try {
    const url = `${config.BUSINESS_PAGE_API_URL}businessPage/${businessId}/follower`;
    const res: IResponseData = await client.get(url);
    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return error as IResponseData;
  }
}

const useBusinessCheckMember = (businessId = '', enabled: boolean) => {
  const cacheKey = [QueryKeys.businessMemberCheck, businessId];
  return useQuery(cacheKey, () => checkUserIsMember(businessId), {enabled});
};

export {useBusinessCheckMember};
