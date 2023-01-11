/**
 * @format
 */
import {useMutation} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import {Platform} from 'react-native';

import {RootNavigationType} from '../Home';
import {config} from '../../config';
import client from '../../utils/ApiClient';
import {showSnackbar} from '../../utils/SnackBar';
import {IPasswordType} from './useUpdatePasswordForm';
import {IResponseData} from '../../constants/types';

export const useUpdatePassword = () => {
  const navigation = useNavigation<RootNavigationType>();

  const updatePassword = async (data: IPasswordType) => {
    try {
      const deviceInfo = `${Platform.OS} Mobile device, version ${Platform.Version}`;
      const url = `${config.USER_PROFILE_API_URL}resetpassword`;
      const headers = {'X-Device-Info': deviceInfo};
      const response: IResponseData = await client.put(url, data, {headers});
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const updatePasswordMutation = useMutation(updatePassword, {
    onSuccess: data => {
      navigation.goBack();
      const message = data.message ?? 'User password updated successfully';
      showSnackbar({message, type: 'success'});
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'danger'});
    },
  });

  const tryUpdatePassword = (data: IPasswordType) => updatePasswordMutation.mutate(data);

  return {...updatePasswordMutation, tryUpdatePassword};
};
