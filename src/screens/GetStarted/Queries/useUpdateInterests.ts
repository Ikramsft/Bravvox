/* eslint-disable @typescript-eslint/no-explicit-any */
import client from '../../../utils/ApiClient';
import {config} from '../../../config';

interface IResponseData {
  data: any;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

interface IInterests {
  category: string;
}

interface IRequestPayload {
  data: IInterests[];
}

export interface IRequestSubCatPayload {
  category: string;
  subcategories: string[] | null;
}

export interface IRequestFollow {
  follow: string;
}

const useUpdateInterests = () => {
  const updateInterests = async (data: IRequestPayload) => {
    try {
      const url = `${config.PRIVACY_API_URL}interests`;
      const response: IResponseData = await client.put(url, data);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const updateSubInterests = async (data: IRequestSubCatPayload[]) => {
    try {
      const url = `${config.PRIVACY_API_URL}interests`;
      const response: IResponseData = await client.put(url, {data});
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const followRecommendedUser = async (data: IRequestFollow) => {
    try {
      const url = `${config.RELATIONSHIP_API_URL}relationships`;
      const response: IResponseData = await client.post(url, data);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };
  return {updateInterests, updateSubInterests, followRecommendedUser};
};

export {useUpdateInterests};
