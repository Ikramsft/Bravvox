import {useQueryClient} from 'react-query';
import {config} from '../../../config';
import {RelationShip} from '../../../redux/reducers/user/UserInterface';
import client from '../../../utils/ApiClient';
import {IConnectionActions, IConnectionInvalidRequestData} from '../types/ConnectionInterface';
import {IConnectionAllResponseData} from './useConnectionAll';
import {IConnectionPages} from './useConnectionPeople';

const useConnectionOperations = () => {
  const queryClient = useQueryClient();

  const updateConnectionPeople = async (
    cacheKey: string[],
    status: RelationShip,
    userId: string,
  ) => {
    const response = await queryClient.getQueryData<IConnectionPages>(cacheKey);

    if (response) {
      const {pages} = response;
      const updatedPages = pages.map(c => {
        const {data, ...rest} = c;
        const newResponse = data.filter(x => x.userId !== userId);
        return {...rest, data: newResponse};
      });
      const updateFeed = {...response, pages: updatedPages};
      queryClient.setQueryData<IConnectionPages>(cacheKey, {...updateFeed});
    }
  };

  const updateConnectionAll = async (cacheKey: string[], status: RelationShip, userId: string) => {
    const response = await queryClient.getQueryData<IConnectionAllResponseData>(cacheKey);
    if (response) {
      const {data} = response;
      const newResponse = data?.People.filter(x => x.userId !== userId);
      const updatePeople = {...response, People: newResponse};
      const updateConnection = {...response, data: updatePeople};
      queryClient.setQueryData<IConnectionAllResponseData>(cacheKey, updateConnection);
    }
  };

  const invalidateConnection = async (data: IConnectionInvalidRequestData) => {
    try {
      const url = `${config.CONNECTIONS_API_URL}invalidateConnection`;
      const response: IConnectionActions = await client.post(url, data);
      return Promise.resolve(response);
    } catch (error: any) {
      return Promise.reject(error);
    }
  };

  return {
    updateConnectionPeople,
    updateConnectionAll,
    invalidateConnection,
  };
};

export {useConnectionOperations};
