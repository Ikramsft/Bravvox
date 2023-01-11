import {IUserData} from '../user/UserInterface';
import {ProfileTypes} from './ProfileTypes';

interface IGetProfile {
  type: ProfileTypes.GET_PROFILE;
}

interface IGetProfileRequest {
  type: ProfileTypes.GET_PROFILE_PENDING;
}

interface IGetProfileSuccess {
  type: ProfileTypes.GET_PROFILE_FULFILLED;
  payload: IGetProfileResponse;
}

interface IGetProfileError {
  type: ProfileTypes.GET_PROFILE_REJECTED;
}

export interface IGetProfileData {
  userName: string;
}

export interface IGetProfileResponse {
  data: IUserData[];
}

export type IProfileActions =
  | IGetProfile
  | IGetProfileRequest
  | IGetProfileSuccess
  | IGetProfileError;

export interface IProfileState {
  loading: boolean;
  currentProfile: IUserData | null;
}
