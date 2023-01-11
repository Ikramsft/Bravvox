import client from '../../../utils/ApiClient';
import {config} from '../../../config';

interface IResponseData {
  data: any;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}
interface IRequestPayload {
  isFirstLogin: boolean;
}

const useUpdateFirstTime = () => {
  const updateIsFirstTime = async (data: IRequestPayload) => {
    try {
      const url = `${config.PRIVACY_API_URL}complete-registration`;
      const response: IResponseData = await client.post(url, data);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {updateIsFirstTime};
};

export {useUpdateFirstTime};
