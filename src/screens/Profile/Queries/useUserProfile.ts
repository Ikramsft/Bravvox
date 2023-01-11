/**
 * @format
 */
import {useQuery} from 'react-query';

import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {IUserData} from '../../../redux/reducers/user/UserInterface';
import {QueryKeys} from '../../../utils/QueryKeys';

export interface IResponseData {
  data: IUserData[];
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

async function fetchUserProfile(userName: string): Promise<IUserData | null> {
  try {
    const url = `${config.USER_PROFILE_API_URL}userdetails/${userName}`;
    const response: IResponseData = await client.get(url);
    const profile = response.data[0];
    return profile;
  } catch (error) {
    return Promise.reject(error);
  }
}

const useUserProfile = (userName = '', enabled = true) => {
  const cacheKey = [QueryKeys.userProfileDetails, userName];
  return useQuery(cacheKey, () => fetchUserProfile(userName), {
    enabled: userName !== '' && enabled,
  });
};

export {useUserProfile};
