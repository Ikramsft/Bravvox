import {Dispatch} from 'redux';
import {IUpdateAccountRequestData, IUserActions} from './UserInterface';
import {UserTypes} from './UserTypes';

export const userLogout = () => {
  return (dispatch: Dispatch<IUserActions>) => {
    dispatch({type: UserTypes.LOGOUT});
  };
};

export const userUpdate = (data: IUpdateAccountRequestData) => {
  return (dispatch: Dispatch<IUserActions>) => {
    dispatch({
      type: UserTypes.UPDATE_PROFILE_ACCOUNT,
      payload: data,
    });
  };
};

export const updateOnlineIndicator = (indicator: boolean) => {
  return (dispatch: Dispatch<IUserActions>) => {
    dispatch({
      type: UserTypes.UPDATE_MESSENGER_INDICATOR,
      payload: {haveNewMessages: indicator},
    });
  };
};
