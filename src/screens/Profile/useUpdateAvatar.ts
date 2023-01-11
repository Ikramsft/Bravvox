/**
 * @format
 */
import {useMutation, useQueryClient} from 'react-query';
import {useDispatch} from 'react-redux';

import {IAssetType} from '../../components/MediaPicker';
import {config} from '../../config';
import {IUserData} from '../../redux/reducers/user/UserInterface';
import {updateProfilePic} from '../../redux/reducers/user/UserServices';
import {randomName} from '../../utils';
import client from '../../utils/ApiClient';
import {QueryKeys} from '../../utils/QueryKeys';
import {IFeedPages} from '../Home/useNewsFeed';
import {IUserInfo} from '../Home/types/NewsFeedInterface';

export type ImageUpdateType = 'cover' | 'avatar';

interface IProfileUpdate {
  documentId: string;
  profilePic: string;
  coverPic: string;
}

export interface IResponseData {
  data: IProfileUpdate;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

const updateAvatarImage = async (
  file: IAssetType,
  type: ImageUpdateType,
): Promise<Partial<IProfileUpdate>> => {
  try {
    const formData = new FormData();
    const fileName = file.fileName ?? `${randomName(8)}.jpg`;
    const photo = {uri: file.uri, type: 'image/*', name: fileName};
    formData.append('file', photo);
    const endpoint = type === 'avatar' ? 'uploadphoto' : 'uploadcoverphoto';
    const url = `${config.USER_PROFILE_API_URL}${endpoint}`;
    const headers = {'Content-Type': 'multipart/form-data'};
    const response: IResponseData = await client.put(url, formData, {headers});
    return response.data;
  } catch (error: any) {
    return error;
  }
};

export const useUpdateAvatar = (
  userName: string,
  userId: string,
  type: ImageUpdateType = 'avatar',
) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const cacheKey = [QueryKeys.userProfileDetails, userName];

  const updateAvatar = async (image?: string) => {
    if (image) {
      await queryClient.cancelQueries(cacheKey);
      const userInfo = queryClient.getQueryData<IUserData>(cacheKey);
      if (userInfo) {
        const keyToUpdate = type === 'avatar' ? 'profilePic' : 'coverPic';
        const updValue = {...userInfo, [keyToUpdate]: image};
        queryClient.setQueryData<IUserData>(cacheKey, updValue);
      }
      dispatch(updateProfilePic(image));
      updatePosts(image);
    }
  };

  const newsFeedCacheKey = [QueryKeys.userFeed, userId];

  const updatePosts = async (image: string) => {
    const feed = queryClient.getQueryData<IFeedPages>(newsFeedCacheKey);
    if (feed) {
      const {pages} = feed;
      const updatedPages = pages.map(c => {
        const {data: posts, ...rest} = c;
        const updatedPosts = posts.map(post => {
          const {userInfo} = post;
          const updUserInfo: IUserInfo = {...userInfo, profilePic: image};
          return {...post, userInfo: updUserInfo};
        });
        return {...rest, data: updatedPosts};
      });
      const updateFeed = {...feed, pages: updatedPages};
      queryClient.setQueryData<IFeedPages>(newsFeedCacheKey, {...updateFeed});
    }
  };

  const avtarMutation = useMutation((file: IAssetType) => updateAvatarImage(file, type), {
    // onMutate: async (file) => updateAvatar(file.uri!), // Uncomment if Optimistic update required
    onSuccess: async data => updateAvatar(type === 'avatar' ? data.profilePic : data.coverPic), // On success update
    onSettled: () => queryClient.invalidateQueries(cacheKey),
  });

  const tryUpdatePicture = (file: IAssetType) => avtarMutation.mutate(file);

  const avtarLoading = avtarMutation.isLoading && type === 'avatar';
  const coverLoading = avtarMutation.isLoading && type === 'cover';

  return {...avtarMutation, avatarLoading: avtarLoading, coverLoading, tryUpdatePicture};
};
