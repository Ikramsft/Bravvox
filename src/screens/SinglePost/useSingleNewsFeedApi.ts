import {useQuery} from 'react-query';
import {config} from '../../config';
import client from '../../utils/ApiClient';
import {QueryKeys} from '../../utils/QueryKeys';
import {INewsFeedData} from '../Home/types/NewsFeedInterface';

export interface ISingleNewsFeedData {
  data: INewsFeedData;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

async function fetchSingleNewsFeed(
  documentId: string,
  from: string,
  id: string,
): Promise<ISingleNewsFeedData | null> {
  try {
    let url = '';
    switch (from) {
      case 'home':
      case 'profile':
      case 'popular':
        url = `${config.CONTENT_API_URL}/${documentId}`;
        break;
      case 'group':
        url = `${config.GROUP_API_URL}group/${id}/post/${documentId}`;
        break;
      case 'event':
        url = `${config.EVENTS_API_URL}event/${id}/post/${documentId}`;
        break;
      default:
        break;
    }
    console.log("Single Post API --->", url);
    
    const response: ISingleNewsFeedData = await client.get(url);
    if(from==='group' || from === 'event'){
        // eslint-disable-next-line prefer-destructuring
        response.data=response.data[0];
    }
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

const useSingleApiNewsFeed = (documentId = '', from = '', id = '') => {
  const cacheKey = [QueryKeys.singlePostData, documentId];
  const queryResponse = useQuery(cacheKey, () => fetchSingleNewsFeed(documentId, from, id));
  return {...queryResponse};
};

export {useSingleApiNewsFeed};
