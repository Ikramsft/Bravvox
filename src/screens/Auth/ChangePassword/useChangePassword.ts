/**
 * @format
 */
import {useMutation} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationType} from '../../Home';
import {config} from '../../../config';
import client from '../../../utils/ApiClient';
import {showSnackbar} from '../../../utils/SnackBar';
import {IResponseData} from '../../../constants/types';

export interface IChangePasswordType {
  password: string;
  email: string;
  token: string;
}

export const useChangePassword = () => {
  const navigation = useNavigation<RootNavigationType>();

  const changePassword = async (data: IChangePasswordType) => {
    try {
      const url = `${config.AUTH_API_URL}update-password`;
      const response: IResponseData = await client.post(url, data);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const changePasswordMutation = useMutation(changePassword, {
    onSuccess: () => {
      navigation.navigate('Login')
      const message = 'Password successfully updated.';
      showSnackbar({message, type: 'success'});
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'danger'});
    },
  });

  const tryChangePassword = (data: IChangePasswordType) => changePasswordMutation.mutate(data);
  return {...changePasswordMutation, tryChangePassword};
};
