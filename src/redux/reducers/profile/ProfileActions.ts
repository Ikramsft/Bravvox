import {Dispatch} from 'redux';
import { IGetProfileData, IProfileActions } from './ProfileInterface';
import {ProfileTypes} from './ProfileTypes';

export const getProfieRequest = (data: IGetProfileData) => {
  return (dispatch: Dispatch<IProfileActions>) => {
    dispatch({
      type: ProfileTypes.GET_PROFILE,
      payload: data,
    });
  };
};