/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @format
 */
import {useQueryClient} from 'react-query';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {showSnackbar} from '../../../utils/SnackBar';
import {QueryKeys} from '../../../utils/QueryKeys';
import useUserInfo from '../../../hooks/useUserInfo';

export interface IResponseData {
  data?: any;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

export interface IPrivacySetting {
  auto_approve_follower: boolean;
  cmc: number;
  notification_preference: string;
  privacy: string;
  relationship_notification_on: boolean;
  set_follower: boolean;
  set_subscriber: boolean;
}

async function updatePrivacySetting(data: IPrivacySetting, id: string): Promise<IResponseData> {
  try {
    const url = `${config.PRIVACY_API_URL}${id}/settings`;
    const res: IResponseData = await client.put(url, data);
    return res;
  } catch (error: any) {
    return error as IResponseData;
  }
}

const useSubmitPrivacySetting = () => {
  const queryClient = useQueryClient();
  const user = useUserInfo();
  const {documentId} = user;

  const handlePrivacySettingUpdate = async (data: IPrivacySetting) => {
    try {
      const response: IResponseData = await updatePrivacySetting(data, documentId || '');
      if (response.status === 200) {
        const cacheKey = [QueryKeys.privacySetting];
        const newResponse = {...response};
        newResponse.data = data;
        queryClient.setQueryData<IResponseData>(cacheKey, newResponse);

        showSnackbar({message: response.message, type: 'success'});
        // navigation.goBack();
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  return {handlePrivacySettingUpdate};
};

export {useSubmitPrivacySetting};
