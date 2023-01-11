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

type RequestType = 'mute' | 'unmute';

export interface IMuteStatus {
  reqType: RequestType;
}

export const useUpdateMuteStatus = () => {
  const queryClient = useQueryClient();

  const updateMuteStatus = async (data: IMuteStatus) => {
    try {
      const url = `${config.MESSENGER_API_URL}api/${data.reqType}`;
      const response: IResponseData = await client.get(url);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const updateMuteStatusMutation = useMutation(updateMuteStatus, {
    onSuccess: async (_data, variables) => {
      const {reqType} = variables;
      const key = [QueryKeys.profileMessengerStatus];
      const response = await queryClient.getQueryData<IProfileStatus>(key);
      if (response) {
        const updResponse: IProfileStatus = {...response, isMuted: reqType === 'mute'};
        queryClient.setQueryData<IProfileStatus>(key, updResponse);
      }
      const message = `Notification successfully ${reqType}.`;
      showSnackbar({message, type: 'success'});
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'danger'});
    },
  });

  const tryUpdateMuteStatus = (data: IMuteStatus) => updateMuteStatusMutation.mutate(data);

  return {...updateMuteStatusMutation, tryUpdateMuteStatus};
};
