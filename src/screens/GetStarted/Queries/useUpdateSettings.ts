/* eslint-disable @typescript-eslint/no-explicit-any */
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import useUserInfo from '../../../hooks/useUserInfo';

interface IResponseData {
  data: any;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}
interface IRequestPayload {
  auto_approve_follower: boolean;
  cmc: number;
  notification_preference: string;
  privacy: string;
  relationship_notification_on: boolean;
  set_follower: boolean;
  set_subscriber: boolean;
}

const useUpdateSettings = () => {
  const {user} = useUserInfo();
  const {documentId} = user;
  const updateSettings = async (data: IRequestPayload) => {
    try {
      const url = `${config.PRIVACY_API_URL}/${documentId}/settings`;
      const response: IResponseData = await client.put(url, data);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {updateSettings};
};

export {useUpdateSettings};
