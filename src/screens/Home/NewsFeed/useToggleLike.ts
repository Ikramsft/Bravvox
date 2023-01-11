/**
 * @format
 */
import {useQueryClient} from 'react-query';
import {config} from '../../../config';
import client from '../../../utils/ApiClient';
import {
  ILikeDisLikeGroupRequestData,
  ILikeDisLikeRequestData,
  IReportAbuseRequestData,
  ILikeDisLikeComment,
  INewsFeedData,
  IComments,
} from '../types/NewsFeedInterface';
import {showSnackbar} from '../../../utils/SnackBar';
import {IResponseData} from '../../../constants/types';
import {QueryKeys, QueryKeysType} from '../../../utils/QueryKeys';
import {IFeedPages} from '../useNewsFeed';
import {IFeedGroupPages} from '../../GroupProfile/Queries/useGroupNewsFeed';
import {FromType} from './Interactions';
import {ISingleNewsFeedData} from '../../SinglePost/useSingleNewsFeedApi';
import {IAppealPost} from '../../Profile/photos';

const updateLike = (
  post: INewsFeedData,
  documentId: string,
  data: ILikeDisLikeComment | ILikeDisLikeRequestData,
): INewsFeedData => {
  if (post.documentId === documentId) {
    const {updLikeCount, updUnlikeCount} = updateLikeDisLike(post, data);
    return {
      ...post,
      isLiked: data.like,
      isDisLiked: data.dislike,
      likesCount: updLikeCount,
      unLikesCount: updUnlikeCount,
    };
  }
  return post;
};

const updateLikeDisLike = (
  post: INewsFeedData | IComments,
  data: ILikeDisLikeComment | ILikeDisLikeRequestData,
): {updLikeCount: number; updUnlikeCount: number} => {
  const {likesCount, unLikesCount, isLiked, isDisLiked} = post;
  let updLikeCount = likesCount;
  let updUnlikeCount = unLikesCount;
  if (isLiked && !data.like) {
    updLikeCount -= 1;
  } else if (!isLiked && data.like) {
    updLikeCount += 1;
  }
  if (isDisLiked && !data.dislike) {
    updUnlikeCount -= 1;
  } else if (!isDisLiked && data.dislike) {
    updUnlikeCount += 1;
  }
  return {
    updLikeCount,
    updUnlikeCount,
  };
};

const useFeedActions = () => {
  const queryClient = useQueryClient();

  const updateHomeLikeToCache = async (
    contentId: string,
    data: ILikeDisLikeRequestData,
    key: QueryKeysType,
  ) => {
    const feed = await queryClient.getQueryData<IFeedPages>(key);
    if (feed) {
      const {pages} = feed;
      const updatedPages = pages.map(c => {
        const {data: posts, ...rest} = c;
        const updatedPosts = posts.map(post => {
          return updateLike(post, contentId, data);
        });
        return {...rest, data: updatedPosts};
      });
      const updateFeed = {...feed, pages: updatedPages};
      queryClient.setQueryData<IFeedPages>(key, {...updateFeed});
    }
  };

  const updateLikeCommentToCache = async (
    contentId: string,
    commentId: string,
    data: ILikeDisLikeComment,
    key: QueryKeysType | string[],
  ) => {
    const feed = await queryClient.getQueryData<IFeedPages>(key);
    if (feed) {
      const {pages} = feed;
      const updatedPages = pages.map(c => {
        const {data: posts, ...rest} = c;
        const updatedPosts = posts.map(post => {
          if (post.documentId === contentId) {
            // eslint-disable-next-line array-callback-return
            const updatedComment = post.comments.map(comment => {
              if (comment.documentId === commentId) {
                const {updLikeCount, updUnlikeCount} = updateLikeDisLike(comment, data);
                return {
                  ...comment,
                  isLiked: data.like,
                  isDisLiked: data.dislike,
                  likesCount: updLikeCount,
                  unLikesCount: updUnlikeCount,
                };
              }
              return comment;
            });
            return {
              ...post,
              comments: updatedComment,
            };
          }
          return post;
        });
        return {...rest, data: updatedPosts};
      });
      const updateFeed = {...feed, pages: updatedPages};
      queryClient.setQueryData<IFeedPages>(key, {...updateFeed});
    }
  };

  const updateSinglePostCache = async (contentId: string, data: ILikeDisLikeRequestData) => {
    const key = [QueryKeys.singlePostData, contentId];
    const feed = await queryClient.getQueryData<ISingleNewsFeedData>(key);
    if (feed) {
      const {updLikeCount, updUnlikeCount} = updateLikeDisLike(feed.data, data);
      const updFeed: ISingleNewsFeedData = {
        ...feed,
        data: {
          ...feed.data,
          isLiked: data.like,
          isDisLiked: data.dislike,
          likesCount: updLikeCount,
          unLikesCount: updUnlikeCount,
        },
      };
      queryClient.setQueryData<ISingleNewsFeedData>(key, updFeed);
    }
  };

  const updateSinglePostCommentCache = async (
    contentId: string,
    documentId: string,
    data: ILikeDisLikeComment,
  ) => {
    const key = [QueryKeys.postComments, contentId];
    const feed = await queryClient.getQueryData<IFeedPages>(key);
    if (feed) {
      const {pages} = feed;
      const updatedPages = pages.map(c => {
        const {data: posts, ...rest} = c;
        const updatedPosts = posts.map(post => {
          return updateLike(post, documentId, data);
        });
        return {...rest, data: updatedPosts};
      });

      const updateFeed = {...feed, pages: updatedPages};
      queryClient.setQueryData<IFeedPages>(key, {...updateFeed});
    }
  };

  /**
   * Update GroupLike  cache logic here.
   */
  const updateLikeToCache = async (
    id: string,
    contentId: string,
    data: ILikeDisLikeGroupRequestData,
    key: string[],
  ) => {
    const feed = await queryClient.getQueryData<IFeedGroupPages>(key);
    if (feed) {
      const {pages} = feed;
      const updatedPages = pages.map(c => {
        const {data: posts, ...rest} = c;
        const updatedPosts = posts.map(post => {
          return updateLike(post, contentId, data);
        });
        return {...rest, data: updatedPosts};
      });
      const updateFeed = {...feed, pages: updatedPages};
      queryClient.setQueryData<IFeedGroupPages>(key, {...updateFeed});
    }
  };

  const updateLikeCache = async (
    from: FromType,
    cacheKey: string[],
    updInfo: ILikeDisLikeGroupRequestData,
  ) => {
    switch (from) {
      case 'popular':
        updateHomeLikeToCache(updInfo.contentId, updInfo, 'postFeed');
        updateSinglePostCache(updInfo.contentId, updInfo);
        break;
      case 'home':
      case 'homeEvent':
      case 'homeGroup':
        updateHomeLikeToCache(updInfo.contentId, updInfo, 'homeFeed');
        updateSinglePostCache(updInfo.contentId, updInfo);
        break;
      case 'profile':
      case 'group':
      case 'business':
      case 'event':
        updateLikeToCache(updInfo.id, updInfo.contentId, updInfo, cacheKey);
        updateSinglePostCache(updInfo.contentId, updInfo);
        break;
      default:
        break;
    }
  };

  const revertLikeCache = async (
    from: FromType,
    cacheKey: string[],
    updInfo: ILikeDisLikeGroupRequestData,
  ) => {
    const revertInfo: ILikeDisLikeGroupRequestData = {
      ...updInfo,
      like: !updInfo.like,
      isLike: !updInfo.isLike,
      reaction:
        updInfo.reaction === 'nil' ? 'nil' : updInfo.reaction === 'dislike' ? 'like' : 'dislike',
    };
    updateLikeCache(from, cacheKey, revertInfo);
  };

  const updateCommentLikeCache = async (
    data: ILikeDisLikeComment,
    from: FromType,
    profileUserId = '',
  ) => {
    switch (from) {
      case 'home':
        updateLikeCommentToCache(data.contentId, data.commentId, data, 'homeFeed');
        updateSinglePostCommentCache(data.contentId, data.commentId, data);
        break;
      case 'profile':
        updateLikeCommentToCache(data.contentId, data.commentId, data, [
          QueryKeys.userFeed,
          profileUserId,
        ]);
        updateSinglePostCommentCache(data.contentId, data.commentId, data);
        break;

      default:
        break;
    }
  };

  const revertCommentLikeCache = async (
    data: ILikeDisLikeComment,
    from: FromType,
    profileUserId = ''
  ) => {
    const revertInfo: ILikeDisLikeComment = {
      ...data,
      like:  data.reaction === 'like'&& !data.like,
      dislike: data.reaction === 'dislike' &&  !data.dislike,
      reaction:
      data.reaction === 'nil' ? 'nil' : data.reaction === 'dislike' ? 'like' : 'dislike',
    };
    updateCommentLikeCache(revertInfo,from,profileUserId);
  };

  const toggleLikePost = async (data: ILikeDisLikeGroupRequestData, from: FromType) => {
    let url = '';
    let cacheKey: string[] = [];
    switch (from) {
      case 'popular':
        url = `${config.CONTENT_API_URL}likes`;
        break;
      case 'home':
      case 'profile':
        url = `${config.CONTENT_API_URL}likes`;
        cacheKey = [QueryKeys.userFeed, data.id];
        break;
      case 'group':
      case 'homeGroup':
        url = `${config.GROUP_LIKE_API_URL}${data.id}/post/${data.contentId}/like`;
        cacheKey = [QueryKeys.groupFeed, data.id];
        break;
      case 'business':
        url = `${config.BUSINESS_PAGE_API_URL}businessPage/${data.id}/post/${data.contentId}/like`;
        cacheKey = [QueryKeys.businessFeed, data.id];
        break;
      case 'event':
      case 'homeEvent':
        if (data.like || data.dislike) {
          url = `${config.EVENT_LIKE_API_URL}${data.id}/post/${data.contentId}/like`;
        } else {
          url = `${config.EVENT_LIKE_API_URL}${data.id}/post/${data.contentId}/deletelike`;
        }
        cacheKey = [QueryKeys.eventFeed, data.id];
        break;
      default:
        break;
    }

    try {
      await updateLikeCache(from, cacheKey, data);
      const response: IResponseData =
        from === 'home' || from === 'profile' || from === 'popular'
          ? await client.post(url, data)
          : data.like || data.dislike
          ? await client.post(url, data)
          : await client.delete(url);

      if (response.status === 200) {
        return response;
      }
      if (response.error) {
        revertLikeCache(from, cacheKey, data);
        showSnackbar({message: response.message, type: 'danger'});
      }
      return response;
    } catch (error: any) {
      revertLikeCache(from, cacheKey, data);
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
    return null;
  };

  const toggleLikeComment = async (
    data: ILikeDisLikeComment,
    from: FromType,
    profileUserId = '',
  ) => {
    try {
      await updateCommentLikeCache(data, from, profileUserId);
      const url = `${config.COMMENT_API_URL}content/${data.contentId}/comment/${data.commentId}/like`;
      const response: IResponseData = await client.post(url, data);
      if (response.status === 200) {
        return response;
      }
      if (response.error) {
        revertCommentLikeCache(data,from,profileUserId);
        showSnackbar({message: response.message, type: 'danger'});
      }
      return response;
    } catch (error: any) {
      revertCommentLikeCache(data,from,profileUserId);
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
    return null;
  };

  const postReportAbuse = async (data: IReportAbuseRequestData) => {
    try {
      const url = `${config.CONTENT_MODERATION_API_URL}contentmoderation/reportcontent`;
      const {message}: IResponseData = await client.post(url, data);
      showSnackbar({message, duration: 4000});
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
    return null;
  };

  // eslint-disable-next-line @typescript-eslint/ban-types
  const postAppeal = async (data: IAppealPost, callBack: Function) => {
    try {
      const url = `${config.NEW_CONTENT_MODERATION_API_URL}contentmoderation/appealcontent`;
      const {message}: IResponseData = await client.post(url, data);
      showSnackbar({message, duration: 4000});
      callBack(message);
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
      callBack(message);
    }
    return null;
  };

  return {
    toggleLikePost,
    toggleLikeComment,
    postReportAbuse,
    postAppeal,
  };
};

export {useFeedActions};
