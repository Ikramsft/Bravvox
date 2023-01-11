/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @format
 */
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {showSnackbar} from '../../../utils/SnackBar';
import {updateUsername} from '../../../redux/reducers/user/UserServices';
import {RootNavigationType} from '../../Home';

interface IResponseData {
  data: {documentId: string};
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

export interface IAccountReq {
  username?: string;
  name?: string;
  email?: string;
}

async function updateEmail(email: string | undefined): Promise<IResponseData> {
  try {
    const url = `${config.USER_PROFILE_API_URL}emailupdate`;
    const res: IResponseData = await client.put(url, {email});
    return res;
  } catch (error: any) {
    return error as IResponseData;
  }
}

async function updateAccount(data: IAccountReq): Promise<IResponseData> {
  try {
    const url = `${config.USER_PROFILE_API_URL}update`;
    const res: IResponseData = await client.put(url, data);
    return res;
  } catch (error: any) {
    return error as IResponseData;
  }
}
async function updateAccountDetails(data: IAccountReq): Promise<IResponseData> {
  try {
    const url = `${config.USER_PROFILE_API_URL}updateaccount`;
    const res: IResponseData = await client.put(url, data);
    return res;
  } catch (error: any) {
    return error as IResponseData;
  }
}

const useSettingQueries = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<RootNavigationType>();
  const handleEditEmail = async (data: IAccountReq) => {
    try {
      const response: IResponseData = await updateEmail(data.email);
      return response;
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      throw message;
    }
  };

  const handleEditAccount = async (data: IAccountReq) => {
    try {
      const response: IResponseData = await updateAccountDetails(data);
      if (response.status === 200) {
        const {username: userName, name} = data;
        dispatch(updateUsername({userName, name}));
        showSnackbar({message: response.message, type: 'success'});
        navigation.goBack();
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  return {
    handleEditEmail,
    handleEditAccount,
  };
};

export {useSettingQueries};
