/**
 * @format
 */
import {useMutation, useQueryClient, useQuery} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import client from '../../utils/ApiClient';
import {config} from '../../config';
import {QueryKeys} from '../../utils/QueryKeys';
import {RootNavigationType} from '../Home';
import {showSnackbar} from '../../utils/SnackBar';
import {IBusinessFormType} from './useBusinessForm';
import {businessResponse} from '../BusinessProfile/types/BusinessInterfaces';

export const useAddBusiness = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<RootNavigationType>();

  const addBusiness = async (data: FormData) => {
    try {
      const url = `${config.BUSINESS_PAGE_API_URL}businessPage`;
      const headers = {'Content-Type': 'multipart/form-data'};
      await client.post(url, data, {headers});
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const addBusinessMutation = useMutation(addBusiness, {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.businessList]);
      navigation.goBack();
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'danger'});
    },
  });

  const tryAddBusiness = (data: FormData) => addBusinessMutation.mutate(data);
  return {...addBusinessMutation, tryAddBusiness};
};

export const useUpdateBusiness = (businessPageId?: string) => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<RootNavigationType>();

  const updateBusiness = async (data: IBusinessFormType) => {
    try {
      const url = `${config.BUSINESS_PAGE_API_URL}businessPage/${businessPageId}`;
      const headers = {'Content-Type': 'multipart/form-data'};
      await client.patch(url, data, {headers});
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const updateBusinessMutation = useMutation(updateBusiness, {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.businessDetails]);
      queryClient.invalidateQueries([QueryKeys.businessList]);
      navigation.goBack();
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'danger'});
    },
  });

  const tryUpdateBusiness = (data: IBusinessFormType) => updateBusinessMutation.mutate(data);

  return {...updateBusinessMutation, tryUpdateBusiness};
};

async function getBusiness(id: string): Promise<businessResponse> {
  try {
    const url = `${config.BUSINESS_PAGE_API_URL}businessPage/${id}`;
    const response: businessResponse = await client.get(url);
    return response;
  } catch (error: any) {
    return error as businessResponse;
  }
}

export const updateBusinessImage = async (data: FormData, businessPageId?: string) => {
  try {
    const url = `${config.BUSINESS_PAGE_API_URL}businessPage/${businessPageId}/image`;
    const headers = {'Content-Type': 'multipart/form-data'};
    const response: businessResponse = await client.post(url, data, {headers});
    return Promise.resolve(response);
  } catch (error: any) {
    const message = error.message ?? 'Something went wrong';
    showSnackbar({message, type: 'danger'});
    return Promise.reject();
  }
};

export const useBusinessProfile = (profileId = '') => {
  const cacheKey = [QueryKeys.businessProfile, profileId];
  return useQuery(cacheKey, () => getBusiness(profileId));
};
