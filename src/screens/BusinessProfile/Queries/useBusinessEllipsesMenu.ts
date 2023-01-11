/**
 * @format
 */
import {useQueryClient} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {INewBusinessData} from '../types/BusinessInterfaces';
import {showSnackbar} from '../../../utils/SnackBar';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IResponseData} from './useBusinessNewsFeed';
import {RootNavigationType} from '../../Home';

export interface IBusinessMemberStatusStates {
  data?: INewBusinessData;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

async function activeDeActiveBusinessActivity(
  businessId: string,
  action: string,
): Promise<IBusinessMemberStatusStates> {
  try {
    const url = `${config.BUSINESS_PAGE_API_URL}businessPage/${businessId}/${action}`;
    const res: IBusinessMemberStatusStates = await client.post(url);
    return res;
  } catch (error: any) {
    return error as IBusinessMemberStatusStates;
  }
}

const useBusinessEllipsesMenu = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<RootNavigationType>();
  const handleDeactiveBusinessActivity = async (businessId = '') => {
    try {
      const response: IBusinessMemberStatusStates = await activeDeActiveBusinessActivity(
        businessId,
        'deactivate',
      );
      if (response.status === 200) {
        const detailCacheKey = [QueryKeys.businessDetails, businessId];
        queryClient.removeQueries(detailCacheKey);

        const cache = [QueryKeys.businessMemberCheck, businessId];
        queryClient.removeQueries(cache);

        const grpCacheKey = [QueryKeys.businessFeed, businessId];
        queryClient.removeQueries(grpCacheKey);

        const memberCacheKey = [QueryKeys.businessMembers, businessId];
        queryClient.removeQueries(memberCacheKey);
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

  const handleReactiveBusinessActivity = async (businessId = '') => {
    try {
      const response: IBusinessMemberStatusStates = await activeDeActiveBusinessActivity(
        businessId,
        'reactivate',
      );
      if (response.status === 200) {
        const cacheKey = [QueryKeys.businessDetails, businessId];
        reloadBusinessProfileData(cacheKey, 'active');

        const cache = [QueryKeys.businessMemberCheck, businessId];
        queryClient.invalidateQueries(cache);

        const grpCacheKey = [QueryKeys.businessFeed, businessId];
        queryClient.invalidateQueries(grpCacheKey);
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  const reloadBusinessProfileData = async (key: string[], status = '') => {
    const response = await queryClient.getQueryData<IResponseData>(key);
    if (response) {
      const {data} = response;
      const updateFeed = {...response, data: {...data, status}};
      queryClient.setQueryData<IResponseData>(key, updateFeed);
    }
  };

  return {
    handleDeactiveBusinessActivity,
    handleReactiveBusinessActivity,
  };
};

export {useBusinessEllipsesMenu};
