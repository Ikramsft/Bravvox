/**
 * @format
 */
import {useMutation, useQueryClient} from 'react-query';
import {useNavigation} from '@react-navigation/native';

import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {IContentCreationRequestData} from '../../../redux/reducers/post/PostInterface';
import {QueryKeys} from '../../../utils/QueryKeys';
import {RootNavigationType} from '../../Home';
import {showSnackbar} from '../../../utils/SnackBar';
import {NewPostParams} from '../../../navigation';

export interface IResponseData {
  data: IContentCreationRequestData;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

export const useCreatePost = (userId: string, params: NewPostParams) => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<RootNavigationType>();

  const contentDataCreation = async (data: IContentCreationRequestData) => {
    try {
      let url = '';
      switch (params.from) {
        case 'home':
        case 'profile':
          url = `${config.CONTENT_API_URL}create-content`;
          break;
        case 'groups':
          url = `${config.GROUP_API_URL}group/${params.id}/post`;
          break;
        case 'business':
          url = `${config.BUSINESS_PAGE_API_URL}businessPage/${params.id}/post`;
          break;
        case 'events':
          url = `${config.EVENTS_API_URL}event/${params.id}/post`;
          break;
        default:
          break;
      }
      const response: IResponseData = await client.post(url, data);
      const profile = response.data;
      return Promise.resolve(profile);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const postMutation = useMutation(contentDataCreation, {
    onSuccess: () => {
      switch (params.from) {
        case 'home':
        case 'profile':
          queryClient.invalidateQueries(QueryKeys.homeFeed);
          queryClient.invalidateQueries([QueryKeys.userFeed, userId]);
          break;
        case 'groups':
          queryClient.invalidateQueries([QueryKeys.groupProfileDetails, params.id]);
          queryClient.invalidateQueries([QueryKeys.groupFeed, params.id]);
          break;
        case 'business':
          queryClient.invalidateQueries([QueryKeys.businessProfileDetails, params.id]);
          queryClient.invalidateQueries([QueryKeys.businessFeed, params.id]);
          break;
        case 'events':
          queryClient.invalidateQueries([QueryKeys.eventFeed, params.id]);
          queryClient.invalidateQueries([QueryKeys.eventProfileDetails, params.id]);
          break;
        default:
          break;
      }
      navigation.goBack();
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'danger'});
    },
  });

  const uploadData = (data: IContentCreationRequestData) => postMutation.mutate(data);

  return {...postMutation, uploadData};
};
