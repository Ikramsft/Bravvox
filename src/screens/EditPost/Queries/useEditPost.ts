/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {EditPostParams} from '../../../navigation';
import {IFeedPages} from '../../Home/useNewsFeed';

export interface IResponseData {
  data: IContentCreationRequestData;
  error: boolean;
  message: string;
  status: number;
}

export const useEditPost = (userId: string, params: EditPostParams) => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<RootNavigationType>();

  const updateNewsFeedCache = async (data: any, cacheKey: string[]) => {
    try {
      const feed = await queryClient.getQueryData<IFeedPages>(cacheKey);
      if (feed) {
        const {pages} = feed;
        const updatedPages = pages.map(c => {
          const {data: posts, ...rest} = c;
          const updatedPosts = posts.map(post => {
            if (post.documentId === data.documentId) {
              post.textContent = data.textContent;
              return {
                ...post,
              };
            }
            return post;
          });
          return {...rest, data: updatedPosts};
        });
        const updateFeed = {...feed, pages: updatedPages};
        queryClient.setQueryData<IFeedPages>(cacheKey, {...updateFeed});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const contentDataEdit = async (data: IContentCreationRequestData) => {
    try {
      let url = '';
      switch (params.from) {
        case 'home':
        case 'profile':
          url = `${config.CONTENT_API_URL}update-content/${params.id}`;
          break;
        case 'group':
          url = `${config.CONTENT_API_URL}update-content/${params.id}`;
          break;
        case 'business':
          url = `${config.CONTENT_API_URL}update-content/${params.id}`;
          break;
        default:
          break;
      }
      const response: IResponseData = await client.put(url, data);
      const profile = response.data;
      return Promise.resolve(profile);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const editPostMutation = useMutation(contentDataEdit, {
    onSuccess: (data: any) => {
      switch (params.from) {
        case 'home':
        case 'profile':
          updateNewsFeedCache(data, [QueryKeys.homeFeed]);
          updateNewsFeedCache(data, [QueryKeys.userFeed, userId]);
          break;
        case 'groups':
          updateNewsFeedCache(data, [QueryKeys.groupProfileDetails, params.id || '']);
          updateNewsFeedCache(data, [QueryKeys.groupFeed, params.id || '']);
          break;
        case 'business':
          updateNewsFeedCache(data, [QueryKeys.businessProfileDetails, params.id || '']);
          updateNewsFeedCache(data, [QueryKeys.businessFeed, params.id || '']);
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

  const editData = (data: IContentCreationRequestData) => editPostMutation.mutate(data);

  return {...editPostMutation, editData};
};
