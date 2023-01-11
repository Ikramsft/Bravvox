import {useQueryClient} from 'react-query';
import { QueryKeys } from '../../../utils/QueryKeys';
import {IResponseData} from './useSearchAll';

const useSearchOperations = () => {
  const queryClient = useQueryClient();
  const clearAll = async () => {
    const key = [QueryKeys.searchAll]
    const response = await queryClient.getQueryData<IResponseData>(key);
    if (response) {
      // const {data} = response;
      // const updateFeed = {...response, data: {...data, status}};
      queryClient.setQueryData<IResponseData>(key, response);
    }
  };

  const clearSearch = async (type = '') => {
    const key = [QueryKeys.searchApi, type]
    const response = await queryClient.getQueryData<IResponseData>(key);
    if (response) {
      // const {data} = response;
      // const updateFeed = {...response, data: {...data, status}};
      queryClient.setQueryData<IResponseData>(key, response);
    }
  };

  return {
    clearAll,
    clearSearch,
  };
};

export {useSearchOperations};
