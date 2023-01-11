/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @format
 */
import {useQueryClient} from 'react-query';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {showSnackbar} from '../../../utils/SnackBar';

export interface IResponseData {
  data?: any;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

export interface IAdminRequest {
  assignedUsersIds: string[];
}

async function fetchInviteMember(id: string, ids: string[], from: string): Promise<IResponseData> {
  try {
    let url = '';
    const reqdata: IAdminRequest = {
      assignedUsersIds: [],
    };

    switch (from) {
      case 'group':
        url = `${config.GROUP_API_URL}group/${id}/invite`;
        reqdata.assignedUsersIds = ids;
        break;
      case 'event':
        url = `${config.EVENTS_API_URL}event/${id}/invite/bulk`;
        reqdata.assignedUsersIds = ids;
        break;
      default:
        break;
    }
    const response: IResponseData = await client.post(url, reqdata);
    return response;
  } catch (error: any) {
    return error as IResponseData;
  }
}

async function fetchSearchResults(query: string): Promise<IResponseData> {
  try {
    const url = `${config.SEARCH_API_URL}search?keyword=${query}`;

    const response: IResponseData = await client.get(url, {
      params: {
        limit: 50,
        offset: 0,
        type: 'invite',
      },
    });
    return response;
  } catch (error: any) {
    return error as IResponseData;
  }
}

const useInviteMember = () => {
  const searchMembers = async (query = '') => {
    try {
      const response: IResponseData = await fetchSearchResults(query);
      if (response.status === 200) {
        console.log('new data', response.data.inviteContainer.invite);
        return response.data.inviteContainer.invite || [];
      }
      return [];
    } catch (error: any) {
      return [];
    }
  };

  const inviteMember = async (id = '', ids: string[] = [], from: string) => {
    try {
      const response: IResponseData = await fetchInviteMember(id, ids, from);
      if (response.status === 200) {
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };
  return {
    searchMembers,
    inviteMember,
  };
};

export {useInviteMember};
