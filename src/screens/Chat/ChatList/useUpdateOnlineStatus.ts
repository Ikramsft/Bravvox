/**
 * @format
 */
import {useMutation, useQueryClient} from 'react-query';
import {config} from '../../../config';
import client from '../../../utils/ApiClient';
import {showSnackbar} from '../../../utils/SnackBar';
import {IResponseData} from '../../../constants/types';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IProfileStatus} from './useProfileStatus';

export interface IOnlineStatus {
  online: boolean;
}

export const useUpdateOnlineStatus = () => {
  const queryClient = useQueryClient();

  const updateOnlineStatus = async (data: IOnlineStatus) => {
    try {
      const reqData = new FormData();
      reqData.append('isOnlineDisable', !data.online ? 'true' : 'false');
      const url = `${config.MESSENGER_API_URL}api/online`;
      const response: IResponseData = await client.put(url, reqData);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const updateOnlineStatusMutation = useMutation(updateOnlineStatus, {
    onSuccess: async (_data, variables) => {
      const {online} = variables;
      const key = [QueryKeys.profileMessengerStatus];
      const response = await queryClient.getQueryData<IProfileStatus>(key);
      if (response) {
        const updResponse: IProfileStatus = {...response, onlineIndicator: online};
        queryClient.setQueryData<IProfileStatus>(key, updResponse);
      }
      const type = online ? 'on' : 'off';
      const message = `Online indicator turned ${type}.`;
      showSnackbar({message, type: 'success'});
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'danger'});
    },
  });

  const tryUpdateOnlineStatus = (data: IOnlineStatus) => updateOnlineStatusMutation.mutate(data);

  return {...updateOnlineStatusMutation, tryUpdateOnlineStatus};
};
