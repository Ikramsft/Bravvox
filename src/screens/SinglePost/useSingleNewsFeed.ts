import {FromType} from '../../screens/Home/NewsFeed/Interactions';
import {INewsFeedData} from '../../screens/Home/types/NewsFeedInterface';
import {usePostComments} from './usePostComments';
import {useSingleApiNewsFeed} from './useSingleNewsFeedApi';

const useSingleAllApi = (documentId: string, from: string, id: string) => {
  const info = useSingleApiNewsFeed(documentId, from, id);
  return {...info};
};

const useSingleNewsFeedPost = (
  documentId: string,
  from: FromType,
  userName: string,
  id: string,
) => {
  const {isLoading: isLoadingPostDetail, data: newsFeed} = useSingleAllApi(documentId, from, id);
  const {commentsList, onEndReached, isFetchingNextPage, isFetched, isFetching, isRefetching} =
    usePostComments(documentId,from,id);
  const feedData: INewsFeedData|undefined = newsFeed?.data;
  return {
    isLoadingPostDetail,
    feedData,
    commentsList,
    isFetchingNextPage,
    onEndReached,
    isFetched,
    isFetching,
    isRefetching,
  };
};

export {useSingleNewsFeedPost};
