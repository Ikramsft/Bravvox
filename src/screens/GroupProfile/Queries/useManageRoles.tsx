/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @format
 */
import {useQueryClient} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {showSnackbar} from '../../../utils/SnackBar';
import {QueryKeys} from '../../../utils/QueryKeys';
import {ACTIONFROM} from './useGroupMember';
import {RootNavigationType} from '../../Home';

export interface IResponseData {
  data?: null;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

export interface IAdminRequest {
  assignMembersIds: string[];
  assignFollowersIds: string[];
  assignedAttendeeIds: string[];
}

async function fetchMakeAdmin(
  id: string,
  memberId: string | undefined,
  from: ACTIONFROM,
): Promise<IResponseData> {
  try {
    let url = '';
    switch (from) {
      case 'group':
        url = `${config.GROUP_API_URL}group/${id}/member/${memberId}/transfer`;
        break;
      case 'business':
        url = `${config.BUSINESS_PAGE_API_URL}businessPage/${id}/follower/${memberId}/transfer`;
        break;
      case 'event':
        url = `${config.EVENTS_API_URL}event/${id}/admin/${memberId}/transfer`;
        break;
      default:
        url = '';
        break;
    }

    const response: IResponseData = await client.post(url);
    return response;
  } catch (error: any) {
    return error as IResponseData;
  }
}

async function fetchRemoveAdmin(
  id: string,
  memberId: string | undefined,
  from: ACTIONFROM,
): Promise<IResponseData> {
  try {
    let url = '';
    switch (from) {
      case 'group':
        url = `${config.GROUP_API_URL}group/${id}/admin/${memberId}`;
        break;
      case 'business':
        url = `${config.BUSINESS_PAGE_API_URL}businessPage/${id}/admin/${memberId}`;
        break;
      case 'event':
        url = `${config.EVENTS_API_URL}event/${id}/admin/${memberId}`;
        break;
      default:
        url = '';
        break;
    }

    const response: IResponseData = await client.delete(url);
    return response;
  } catch (error: any) {
    return error as IResponseData;
  }
}

async function fetchUpdateAdmin(
  id: string,
  ids: string[],
  from: ACTIONFROM,
): Promise<IResponseData> {
  try {
    let url = '';
    const reqdata: IAdminRequest = {
      assignMembersIds: [],
      assignFollowersIds: [],
      assignedAttendeeIds: [],
    };
    switch (from) {
      case 'group':
        url = `${config.GROUP_API_URL}group/${id}/admins`;
        reqdata.assignMembersIds = ids;
        break;
      case 'business':
        url = `${config.BUSINESS_PAGE_API_URL}businessPage/${id}/admins`;
        reqdata.assignFollowersIds = ids;
        break;
      case 'event':
        url = `${config.EVENTS_API_URL}event/${id}/admins`;
        reqdata.assignedAttendeeIds = ids;
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

async function fetchSearchResults(
  id: string,
  query: string,
  from: ACTIONFROM,
): Promise<IResponseData> {
  try {
    let url = '';
    switch (from) {
      case 'group':
        url = `${config.GROUP_API_URL}group/${id}/members/${query}`;
        break;
      case 'business':
        url = `${config.BUSINESS_PAGE_API_URL}businessPage/${id}/followers/${query}`;
        break;
      case 'event':
        url = `${config.EVENTS_API_URL}event/${id}/attendees?searchCriteria=${query}`;
        break;
      default:
        break;
    }
    const response: IResponseData = await client.get(url, {
      params: {
        limit: 50,
        offset: 0,
        roles: 'default',
      },
    });
    return response;
  } catch (error: any) {
    return error as IResponseData;
  }
}

const useManageRoles = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<RootNavigationType>();

  const searchMembers = async (id = '', query = '', from: ACTIONFROM) => {
    try {
      const response: IResponseData = await fetchSearchResults(id, query, from);
      if (response.status === 200) {
        return response.data || [];
      }
      return [];
    } catch (error: any) {
      return [];
    }
  };

  const handleUpdateAdmin = async (id = '', ids: string[] = [], from: ACTIONFROM) => {
    try {
      const response: IResponseData = await fetchUpdateAdmin(id, ids, from);
      if (response.status === 200) {
        let cacheKey: string[] = [];
        let cacheKey1: string[] = [];
        switch (from) {
          case 'group':
            cacheKey = [QueryKeys.groupMemberCheck, id];
            cacheKey1 = [QueryKeys.groupMembers, id];
            break;
          case 'business':
            cacheKey = [QueryKeys.businessMemberCheck, id];
            cacheKey1 = [QueryKeys.businessPageMembers, id];
            break;
          case 'event':
            cacheKey = [QueryKeys.eventMemberCheck, id];
            cacheKey1 = [QueryKeys.useEventAttendees, id];
            break;
          default:
            break;
        }
        queryClient.invalidateQueries(cacheKey);
        queryClient.invalidateQueries(cacheKey1);
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  const handleMakeAdminActivity = async (id = '', memberId = '', from: ACTIONFROM) => {
    try {
      const response: IResponseData = await fetchMakeAdmin(id, memberId, from);
      if (response.status === 200) {
        let cacheKey: any = [];
        switch (from) {
          case 'group':
            cacheKey = [QueryKeys.groupMemberCheck, id];
            break;
          case 'business':
            cacheKey = [QueryKeys.businessMemberCheck, id];
            break;
          case 'event':
            cacheKey = [QueryKeys.eventMemberCheck, id];
            break;
          default:
            cacheKey = [];
            break;
        }

        queryClient.invalidateQueries(cacheKey);
        showSnackbar({message: response.message, type: 'success'});
        navigation.goBack();
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  const handleRemoveAdminActivity = async (id = '', memberId = '', from: ACTIONFROM) => {
    try {
      const response: IResponseData = await fetchRemoveAdmin(id, memberId, from);
      if (response.status === 200) {
        let cacheKey: any = [];
        let cacheKey1: any = [];
        switch (from) {
          case 'group':
            cacheKey = [QueryKeys.groupMemberCheck, id];
            cacheKey1 = [QueryKeys.groupMembers, id];
            break;
          case 'business':
            cacheKey = [QueryKeys.businessMemberCheck, id];
            cacheKey1 = [QueryKeys.businessPageMembers, id];
            break;
          case 'event':
            cacheKey = [QueryKeys.eventMemberCheck, id];
            cacheKey1 = [QueryKeys.useEventAttendees, id];
            break;
          default:
            cacheKey = [];
            cacheKey1 = [];
            break;
        }
        queryClient.invalidateQueries(cacheKey);
        queryClient.invalidateQueries(cacheKey1);
        showSnackbar({message: response.message, type: 'success'});
        // navigation.goBack();
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
    handleUpdateAdmin,
    handleMakeAdminActivity,
    handleRemoveAdminActivity,
  };
};

export {useManageRoles};
