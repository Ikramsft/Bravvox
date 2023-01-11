import {useInfiniteQuery, useQueryClient} from 'react-query';
import {useCallback} from 'react';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {People} from '../types/ConnectionInterface';
import {showSnackbar} from '../../../utils/SnackBar';

export interface IConnectionPeopleResponseData {
  data: People[];
  error?: boolean;
  message?: string;
  status?: number;
  code?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}

export interface IConnectionPeoplePage {
  data: People[];
  hasNext: boolean;
}

export interface IConnectionPages {
  pages: IConnectionPeoplePage[];
  pageParams?: number[];
}
async function fetchConnectionPeople(sortId: string): Promise<IConnectionPeoplePage | undefined> {
  try {
    const url = `${config.CONNECTIONS_API_URL}people?sortCursor=${sortId}`;
    const response: IConnectionPeopleResponseData = await client.get(url);
    if (response.data.length > 0 && !response.error) {
      return {data: response.data, hasNext: true};
    }
    return {data: [], hasNext: false};
  } catch (error: any) {
    return {data: [], hasNext: false};
  }
}

const useConnectionPeople = (enabled = true) => {
  const queryClient = useQueryClient();
  const listQuery = useInfiniteQuery(
    QueryKeys.connectionPeople,
    ({pageParam = ''}) => fetchConnectionPeople(pageParam),
    {
      getNextPageParam: lastPage => {
        const lastData = lastPage?.data.slice(-1).pop();
        return lastPage?.hasNext ? lastData?.sortId : null;
      },
      enabled,
    },
  );

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = listQuery;

  const peopleList: People[] = [];

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data) {
    data.pages.forEach(page => {
      if (page?.data) {
        peopleList.push(...page.data);
      }
    });
  }

  const deletePeopleFromCache = async (userId: string) => {
    const queryKey = QueryKeys.connectionPeople;
    const peopleConnectionList = await queryClient.getQueryData<IConnectionPages>(queryKey);
    if (peopleConnectionList) {
      const {pages} = peopleConnectionList;
      const updatedPages = pages.map(c => {
        const {data: connectionPeople, ...rest} = c;
        const updatedConnectionPeople = connectionPeople.filter(
          singleConnection => singleConnection.userId !== userId,
        );
        return {...rest, data: updatedConnectionPeople};
      });
      const updateFeed = {...peopleConnectionList, pages: updatedPages};
      queryClient.setQueryData(queryKey, {...updateFeed});
    }
  };

  const refreshConnectionList = () => queryClient.invalidateQueries(QueryKeys.connectionPeople);

  const deleteConnection = async (sortId: string, processingId: string, userId: string) => {
    try {
      deletePeopleFromCache(userId);
      const url = `${config.CONNECTIONS_API_URL}removeConnection`;
      const reqData = {sortId, processingId};
      const response = await client.post(url, reqData);

      if (response.status === 200) {
        refreshConnectionList();
      } else if (response.error) {
        refreshConnectionList();
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      refreshConnectionList();
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
    return null;
  };

  return {
    ...listQuery,
    peopleList,
    onEndReached,
    deleteConnection,
    deletePeopleFromCache,
  };
};

export {useConnectionPeople};
