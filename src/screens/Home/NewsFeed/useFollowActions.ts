import {config} from '../../../config';
import useUserInfo from '../../../hooks/useUserInfo';
import client from '../../../utils/ApiClient';
import {showSnackbar} from '../../../utils/SnackBar';

export type FromApprove = 'profile' | 'list' | 'connectionAll' | 'connectionPeople';

export interface IFollowActions {
  data: any;
  status: number;
  error: boolean;
  message: string;
}

const useFollowActions = () => {
  const userInfo = useUserInfo();
  const followUser = async (userId: string) => {
    try {
      const url = `${config.RELATIONSHIP_API_URL}relationships`;
      const response: IFollowActions = await client.post(url, {follow: userId});
      if (response.status === 200) {
        showSnackbar({message: response.message, type: 'success'});
      }
      if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
      return Promise.resolve(response);
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
      return Promise.reject(error);
    }
  };

  const cancelRequest = async (userId: string) => {
    try {
      const url = `${config.RELATIONSHIP_API_URL}relationships/${userInfo.documentId}/cancel/${userId}`;
      const response: IFollowActions = await client.delete(url);
      if (response.status === 200) {
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
      return Promise.resolve(response);
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
      return Promise.reject(error);
    }
  };

  const unfollow = async (userId: string) => {
    try {
      const url = `${config.RELATIONSHIP_API_URL}relationships/${userInfo.documentId}/unfollow/${userId}`;
      const response: IFollowActions = await client.delete(url);
      if (response.status === 200) {
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
      return Promise.resolve(response);
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
      return Promise.reject(error);
    }
  };

  const rejectRequest = async (userId: string, from?: string) => {
    try {
      let url;

      switch (from) {
        case 'profile':
          url = `${config.RELATIONSHIP_API_URL}relationships/${userId}`;
          break;
        default:
          url = `${config.RELATIONSHIP_API_URL}relationships/${userInfo.documentId}/reject/${userId}`;
          break;
      }

      const response: IFollowActions = await client.delete(url);
      if (response.status === 200) {
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
      return Promise.resolve(response);
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
      return Promise.reject(error);
    }
  };

  const approveRequest = async (userId: string) => {
    try {
      const url = `${config.RELATIONSHIP_API_URL}relationships/${userId}/approve/${userInfo.documentId}`;
      // switch (from) {
      //   case 'profile':
      //     url = `${config.RELATIONSHIP_API_URL}relationships/${userId}/approve/${userInfo.documentId}`;
      //     break;
      //   case 'list':
      //     url = `${config.RELATIONSHIP_API_URL}relationships/${userId}`;
      //     break;
      //   default:
      //     break;
      // }
      const response: IFollowActions = await client.post(url);
      if (response.status === 200) {
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
      return Promise.resolve(response);
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
      return Promise.reject(error);
    }
  };

  const followBackUser = async (userId: string) => {
    try {
      const url = `${config.RELATIONSHIP_API_URL}relationships`;
      const response: IFollowActions = await client.post(url, {follow: userId});
      if (response.status === 200) {
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
      return Promise.resolve(response);
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
      return Promise.reject(error);
    }
  };

  const blockUser = async (userId: string) => {
    try {
      const url = `${config.RELATIONSHIP_API_URL}relationships/block/${userId}`;
      const response: IFollowActions = await client.post(url);
      if (response.status === 200) {
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
      return Promise.resolve(response);
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
      return Promise.reject(error);
    }
  };
  const unBlockUser = async (userId: string) => {
    try {
      const url = `${config.RELATIONSHIP_API_URL}relationships/unblock/${userId}`;
      const response: IFollowActions = await client.post(url);
      if (response.status === 200) {
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
      return Promise.resolve(response);
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
      return Promise.reject(error);
    }
  };

  return {
    followUser,
    cancelRequest,
    unfollow,
    rejectRequest,
    approveRequest,
    followBackUser,
    blockUser,
    unBlockUser,
  };
};

export {useFollowActions};
