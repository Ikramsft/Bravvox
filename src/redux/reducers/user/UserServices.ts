import {Dispatch} from 'redux';

import {UserTypes} from './UserTypes';
import {
  ILoginRequestData,
  IUserActions,
  IForgetData,
  ISignUpRequestData,
  IUpdateAccountRequestData,
  PicCroppedDetails,
} from './UserInterface';
import {IResponseData} from '../../../constants/types';
import {saveBase64OnCache, removeFileFromCache} from '../../../constants/common';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {showSnackbar} from '../../../utils/SnackBar';
import {ISelectFile} from '../../../components/AvatarCoverImage';
import {RootState} from '../../store';

export const checkUsernameIsValid = async (username: string) => {
  try {
    const {data: res}: IResponseData = await client.get(
      `${config.AUTH_API_URL}check-username?username=${username}`,
    );
    return !res.error;
  } catch (err: any) {
    return !err.error;
  }
};

export const resendCheckEmail = async (email: string) => {
  try {
    const res: IResponseData = await client.get(
      `${config.AUTH_API_URL}resend-verification-email?email=${email}`,
    );
    return res;
  } catch (err: any) {
    return err;
  }
};

export const refreshAccessToken = () => {
  return async (dispatch: Dispatch<IUserActions>, getState: () => RootState) => {
    const {refreshToken} = getState().user;
    return dispatch({
      type: UserTypes.REFRESH_TOKEN,
      payload: async () => {
        try {
          const response: IResponseData = await client.post(`${config.AUTH_API_URL}access-token`, {
            refreshToken,
          });
          console.log('refreshAccessToken => SUCCESSFUL', response);
          return Promise.resolve(response);
        } catch (error: any) {
          console.log('refreshAccessToken => FAILED', error);
          return Promise.reject(error);
        }
      },
    });
  };
};

export const userLogout = () => {
  return async (dispatch: Dispatch<IUserActions>) => {
    dispatch({type: UserTypes.LOGOUT});
  };
};

export const updateProfilePic = (data: {
  profilePic: string;
  profileCroppedPic: string;
  profilePicCroppedDetails: PicCroppedDetails;
}) => {
  return async (dispatch: Dispatch<IUserActions>) => {
    dispatch({type: UserTypes.UPDATE_PROFILE_PIC, payload: data});
  };
};

export const updateCoverPic = (data: {
  coverPic: string;
  coverCroppedPic: string;
  coverPicCroppedDetails: PicCroppedDetails;
}) => {
  return async (dispatch: Dispatch<IUserActions>) => {
    dispatch({type: UserTypes.UPDATE_COVER_PIC, payload: data});
  };
};

export const updateUsername = (data: {userName: string | undefined; name: string | undefined}) => {
  return async (dispatch: Dispatch<IUserActions>) => {
    dispatch({type: UserTypes.UPDATE_USER_NAME, payload: data});
  };
};

export const updateUsernameFirstScreen = (data: {
  username: string | undefined;
  name: string | undefined;
}) => {
  return async (dispatch: Dispatch<IUserActions>) => {
    return dispatch({
      type: UserTypes.UPDATE_USER_NAME_FIRST_SCREEN,
      payload: async () => {
        try {
          const res: IResponseData = await client.put(`${config.USER_NAME_UPDATE}`, data);
          showSnackbar({message: res?.message});
          return Promise.resolve(res);
        } catch (error: any) {
          showSnackbar({message: error?.message || 'Something went wrong!', type: 'danger'});
          return Promise.reject(error);
        }
      },
    });
  };
};

export const updateIsLoginFirstTime = () => {
  return async (dispatch: Dispatch<IUserActions>) => {
    dispatch({type: UserTypes.UPDATE_USER_FIRST_LOGIN});
  };
};

export const forgotPassword = (data: IForgetData) => {
  return async (dispatch: Dispatch<IUserActions>) => {
    return dispatch({
      type: UserTypes.FORGET_PASSWORD,
      payload: async () => {
        try {
          const response: IResponseData = await client.post(
            `${config.AUTH_API_URL}forgot-password`,
            data,
          );
          if (response) {
            const message =
              'Thank you. Please check your email for instructions on how to reset your account.';
            showSnackbar({message, type: response.error ? 'danger' : 'success'});
          }
          return Promise.resolve(response);
        } catch (error: any) {
          showSnackbar({message: error?.message || 'Something went wrong!', type: 'danger'});
          return Promise.reject(error);
        }
      },
    });
  };
};

export const userSignUp = (data: ISignUpRequestData) => {
  return async (dispatch: Dispatch<IUserActions>) => {
    return dispatch({
      type: UserTypes.SIGNUP,
      payload: async () => {
        try {
          const res: IResponseData = await client.post(`${config.AUTH_API_URL}register`, data);
          showSnackbar({message: res?.message});
          return Promise.resolve(res);
        } catch (error: any) {
          showSnackbar({message: error?.message || 'Something went wrong!', type: 'danger'});
          return Promise.reject(error);
        }
      },
    });
  };
};

export const userLogin = (data: ILoginRequestData) => {
  return async (dispatch: Dispatch<IUserActions>) => {
    return dispatch({
      type: UserTypes.LOGIN,
      payload: async () => {
        try {
          const response: IResponseData = await client.post(`${config.AUTH_API_URL}login`, data);
          return Promise.resolve(response);
        } catch (error: any) {
          const msg = error?.message ?? 'Something went wrong, please try again!';
          showSnackbar({message: msg, type: 'danger'});
          return Promise.reject(error);
        }
      },
    });
  };
};

export const getUserProfile = (userId: string) => {
  return async (dispatch: Dispatch<IUserActions>) => {
    return dispatch({
      type: UserTypes.GET_PROFILE,
      payload: async () => {
        try {
          const url = `${config.USER_PROFILE_API_URL}userdetails/${userId}`;
          const response: IResponseData = await client.get(url);
          return Promise.resolve(response);
        } catch (error: any) {
          const msg = error?.message ?? 'Something went wrong, please try again!';
          showSnackbar({message: msg, type: 'danger'});
          return Promise.reject(error);
        }
      },
    });
  };
};

export const getMessengerProfile = () => {
  return async (dispatch: Dispatch<IUserActions>) => {
    return dispatch({
      type: UserTypes.GET_MESSENGER_PROFILE,
      payload: async () => {
        try {
          const url = `${config.MESSENGER_API_URL}api/profile`;
          const response: IResponseData = await client.get(url);
          return Promise.resolve(response);
        } catch (error: any) {
          const msg = error?.message ?? 'Something went wrong, please try again!';
          showSnackbar({message: msg, type: 'danger'});
          return Promise.reject(error);
        }
      },
    });
  };
};

export const updateAccount = async (data: IUpdateAccountRequestData) => {
  try {
    const url = config.UPDATE_ACCOUNT_API_URL;
    const response: IResponseData = await client.put(url, data);
    return Promise.resolve(response);
  } catch (error: any) {
    showSnackbar({message: error.message, type: 'danger'});
    return Promise.reject(error);
  }
};
export const updateUserDetail = async (data: IUpdateAccountRequestData) => {
  try {
    const url = config.UPDATE_ACCOUNT_API_URL;
    const response: IResponseData = await client.put(url, data);
    return Promise.resolve(response);
  } catch (error: any) {
    showSnackbar({message: error.message, type: 'danger'});
    return Promise.reject(error);
  }
};

export const uploadProfile = async (
  data: ISelectFile,
  url: string = config.UPLOAD_PROFILE_PHOTO,
) => {
  try {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data.data));
    formData.append('canvasData', JSON.stringify(data.canvasData));
    formData.append('cropBoxData', JSON.stringify(data.cropBoxData));
    formData.append('minZoom', data.minZoom);
    formData.append('zoom', data.zoom);

    const originalFileType = data.originalFile.uri.split('.').pop();
    const originalFileName = data.originalFile.name;
    const originalFile = {
      name: originalFileName,
      type: `image/${originalFileType}`,
      uri: data.originalFile.uri,
    };
    formData.append('originalFile', originalFile);

    // save image to local cache for upload
    const croppedFile = await saveBase64OnCache(data.croppedFile);

    formData.append('croppedFile', croppedFile);

    const headers = {'Content-Type': 'multipart/form-data'};
    const response: IResponseData = await client.put(url, formData, {headers});

    // remove the saved image from local cache
    await removeFileFromCache(croppedFile.uri);

    return Promise.resolve(response);
  } catch (error: any) {
    showSnackbar({message: error.message, type: 'danger'});
    return Promise.reject(error);
  }
};

export const uploadCoverPhoto = async (data: ISelectFile) => {
  const url = config.UPLOAD_COVER_PHOTO;
  return uploadProfile(data, url);
};
