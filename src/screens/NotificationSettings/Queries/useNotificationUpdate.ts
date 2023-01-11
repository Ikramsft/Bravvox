/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @format
 */
import {useQuery, useQueryClient} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {showSnackbar} from '../../../utils/SnackBar';
import {QueryKeys} from '../../../utils/QueryKeys';

import {RootNavigationType} from '../../Home';
import {INotificationFormType} from '../useNotificationForm';

export interface IResponseData {
  data?: any;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

export interface INotifications {
  data?: any;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

interface IRelationShipRequest {
  notificationsOn: boolean;
  autoApproveFollowers: boolean;
}

export interface IPrivacySetting {
  requireMyApprovalToFollowMe: boolean;
  taggedContentInMyNewsFeedApproval: boolean;
}

async function updateRelationshipSetting(data: IRelationShipRequest): Promise<IResponseData> {
  try {
    const url = `${config.RELATIONSHIP_API_URL}settings`;
    const res: IResponseData = await client.post(url, data);
    return res;
  } catch (error: any) {
    return error as IResponseData;
  }
}

async function fetchNotificationSettings(): Promise<INotifications> {
  try {
    const url = `${config.RELATIONSHIP_API_URL}settings`;
    const res: INotifications = await client.get(url);
    return res;
  } catch (error: any) {
    return error as INotifications;
  }
}

const useNotificationUpdate = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<RootNavigationType>();

  const handleRelationshipSettingUpdate = async (data: IRelationShipRequest) => {
    try {
      const response: IResponseData = await updateRelationshipSetting(data);
      if (response.status === 200) {
        const cacheKey = [QueryKeys.notificationSettings];
        const newResponse = {...response};
        newResponse.data = data;
        queryClient.setQueryData<IResponseData>(cacheKey, newResponse);

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

  const handleNotificationUpdate = (data: INotificationFormType) => {
    const relationshipData = {
      notificationsOn: data.toggleRelationships,
      autoApproveFollowers: data.toggleFollowRequest,
    };
    handleRelationshipSettingUpdate(relationshipData);
  };

  return {handleNotificationUpdate};
};

const useNotificationsFetch = () => {
  const cacheKey = [QueryKeys.notificationSettings];
  return useQuery(cacheKey, () => fetchNotificationSettings());
};

export {useNotificationUpdate, useNotificationsFetch};
