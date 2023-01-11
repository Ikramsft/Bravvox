import {Dispatch} from 'redux';
import {config} from '../../../config';
import {IResponseData} from '../../../constants/types';
import client from '../../../utils/ApiClient';
import {IGetProfileData, IProfileActions} from './ProfileInterface';
import {ProfileTypes} from './ProfileTypes';

export const getProfile = (data: IGetProfileData) => {
  return async (dispatch: Dispatch<IProfileActions>) => {
    return dispatch({
      type: ProfileTypes.GET_PROFILE,
      payload: async () => {
        try {
          const url = `${config.USER_PROFILE_API_URL}userdetails/${data.userName}`;
          const response: IResponseData = await client.get(url);
          return Promise.resolve(response);
        } catch (error: any) {
          return Promise.reject(error);
        }
      },
    });
  };
};
