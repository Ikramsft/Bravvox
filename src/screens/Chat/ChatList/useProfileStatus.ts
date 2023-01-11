/**
 * @format
 */
import {useQuery} from 'react-query';
import {config} from '../../../config';
import client from '../../../utils/ApiClient';
import {QueryKeys} from '../../../utils/QueryKeys';

export interface IProfileStatus {
  isMuted: boolean;
  onlineIndicator: boolean;
  documentId: string;
}

interface IProfileResponse {
  data: IProfileStatus;
  error: boolean;
  message: string | null;
  status: number;
}

async function fetchProfileStatus(): Promise<IProfileStatus | undefined> {
  try {
    const url = `${config.MESSENGER_API_URL}api/profile`;
    const response: IProfileResponse = await client.get(url);
    return response.data;
  } catch (error) {
    return undefined;
  }
}

export const useProfileStatus = () => {
  const cacheKey = [QueryKeys.profileMessengerStatus];
  return useQuery(cacheKey, () => fetchProfileStatus());
};
