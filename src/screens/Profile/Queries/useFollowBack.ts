import {useQueryClient} from 'react-query';
import {config} from '../../../config';
import client from '../../../utils/ApiClient';
import {QueryKeysType} from '../../../utils/QueryKeys';
import {showSnackbar} from '../../../utils/SnackBar';
import {FollowerUserData, IFeedPages, IResponseData} from './useFollowers';

const useFollowBack = () => {
  const queryClient = useQueryClient();
  const updateFollowBackToCache = async (
    documentId: string | null,
    data: FollowerUserData,
    key: QueryKeysType,
  ) => {
    const feed = await queryClient.getQueryData<IFeedPages>(key);
    if (feed) {
      const {pages} = feed;
      const updatedPages = pages.map(c => {
        const {data: followers, ...rest} = c;
        const updatedFollowers = followers.map(post => {
          if (post.documentId === documentId) {
            return {
              ...post,
              relationship: 'requested',
            };
          }
          return post;
        });
        return {...rest, data: updatedFollowers};
      });
      const updateFeed = {...feed, pages: updatedPages};
      queryClient.setQueryData<IFeedPages>(key, {...updateFeed});
    }
  };

  const followBackUser = async (data: FollowerUserData) => {
    try {
      const url = `${config.RELATIONSHIP_API_URL}relationships`;
      const response: IResponseData = await client.post(url, {follow: data.userId});
      if (response.status === 200) {
        updateFollowBackToCache(data.documentId, data, 'useFollowers');
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
    return null;
  };

  return {
    followBackUser,
  };
};

export {useFollowBack};
