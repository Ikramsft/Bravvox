/**
 * @format
 */
import {useMutation} from 'react-query';

import {config} from '../../../config';
import client from '../../../utils/ApiClient';
import {IResponseData} from '../../../constants/types';

export const useUpdateViewed = () => {
  const updateViewed = async () => {
    try {
      const url = `${config.MESSENGER_API_URL}api/viewed`;
      const response: IResponseData = await client.put(url);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const updateViewedMutation = useMutation(updateViewed);

  const tryUpdateViewed = () => updateViewedMutation.mutate();

  return {...updateViewedMutation, tryUpdateViewed};
};
