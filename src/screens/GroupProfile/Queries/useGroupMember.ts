/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @format
 */
import {useQueryClient} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {
  IGroupCardInfo as ICardInfo, // this should be use for Groups , business and events
  IGroupMemberStatusState,
  IMembersData,
} from '../../../screens/Groups/types/GroupInterfaces';
import {showSnackbar} from '../../../utils/SnackBar';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IGroupMemberPages} from '../../Home/useNewsFeed';
import {IResponseData as IProfileData} from './useGroupNewsFeed';
import {IResponseData as IDetailData} from './useGroupDetail';
import {
  IGroupsPages as IResponsePages, //  this should be use for Groups , business and events
  GroupTypes,
} from '../../Groups/Queries/useGroupsList';
import {RootNavigationType} from '../../Home';
import {ActionBlockUnblock, ActionRequest, MemberShipStatus} from '../../../utils/types';
import {businessType} from '../../BusinessPage/Queries/useBusinessList';

export interface IGroupMemberStatusStates {
  data?: IGroupMemberStatusState;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

export type ACTIONFROM = 'group' | 'business' | 'event';

async function blockUnBlockMember(
  id: string,
  memberId: string,
  action: ActionBlockUnblock,
  from: ACTIONFROM,
): Promise<IGroupMemberStatusStates> {
  try {
    let url = '';
    switch (from) {
      case 'group':
        url = `${config.GROUP_API_URL}group/${id}/member/${memberId}/${action}`;
        break;
      case 'business':
        url = `${config.BUSINESS_PAGE_API_URL}businessPage/${id}/follower/${memberId}/${action}`;
        break;
      default:
        url = '';
        break;
    }

    const res: IGroupMemberStatusStates = await client.post(url);
    return res;
  } catch (error: any) {
    return error as IGroupMemberStatusStates;
  }
}

async function leaveGroupActivity(
  groupId: string,
  memberId: string,
): Promise<IGroupMemberStatusStates> {
  try {
    const url = `${config.GROUP_API_URL}group/${groupId}/member/${memberId}`;
    const res: IGroupMemberStatusStates = await client.delete(url);
    return res;
  } catch (error: any) {
    return error as IGroupMemberStatusStates;
  }
}

async function activeDeActiveGroupActivity(
  groupId: string,
  action: string,
): Promise<IGroupMemberStatusStates> {
  try {
    const url = `${config.GROUP_API_URL}group/${groupId}/${action}`;
    const res: IGroupMemberStatusStates = await client.post(url);
    return res;
  } catch (error: any) {
    return error as IGroupMemberStatusStates;
  }
}

async function processMemberRequest(
  id: string,
  memberId: string,
  action: ActionRequest,
  from: ACTIONFROM,
) {
  try {
    let url = '';
    switch (from) {
      case 'group':
        url = `${config.GROUP_API_URL}group/${id}/user/${memberId}/${action}`;
        break;
      case 'business':
        url = `${config.BUSINESS_PAGE_API_URL}businessPage/${id}/user/${memberId}/${action}`;
        break;
      default:
        url = '';
        break;
    }
    const res: IGroupMemberStatusStates = await client.post(url);
    return res;
  } catch (error: any) {
    return error as IGroupMemberStatusStates;
  }
}

async function joinGroupActivity(groupId: string): Promise<IGroupMemberStatusStates> {
  try {
    const url = `${config.GROUP_API_URL}group/${groupId}/join`;
    const res: IGroupMemberStatusStates = await client.post(url);
    return res;
  } catch (error: any) {
    return error as IGroupMemberStatusStates;
  }
}

async function cancelRequestActivity(
  groupId: string,
  memberId: string,
): Promise<IGroupMemberStatusStates> {
  try {
    const url = `${config.GROUP_API_URL}group/${groupId}/member/${memberId}/cancel`;
    const res: IGroupMemberStatusStates = await client.post(url);
    return res;
  } catch (error: any) {
    return error as IGroupMemberStatusStates;
  }
}
async function acceptrejectRequestActivity(
  groupId: string,
  memberId: string,
  type: string,
): Promise<IGroupMemberStatusStates> {
  try {
    const url = `${config.GROUP_API_URL}group/${groupId}/member/${memberId}/${type}`;
    const res: IGroupMemberStatusStates = await client.post(url);

    return res;
  } catch (error: any) {
    return error as IGroupMemberStatusStates;
  }
}

const useGroupMember = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<RootNavigationType>();
  const [isLoadingShow, setLoaderShow] = useState(false);
  const addGroupMemberToCache = async (
    key: string[],
    memberId: string,
    status: ActionBlockUnblock,
    navId: MemberShipStatus,
  ) => {
    const response = await queryClient.getQueryData<IGroupMemberPages>(key);
    if (response) {
      const {pages} = response;
      const updatedPages = pages.map(c => {
        const {data: members, ...rest} = c;
        let updatedPosts: IMembersData[] = [];
        if (
          status === 'reject' ||
          navId === 'blocked' ||
          navId === 'accepted' ||
          navId === 'pending'
        ) {
          updatedPosts = members.filter(x => x.id !== memberId);
        } else {
          updatedPosts = members.map(member => {
            if (member.id === memberId) {
              return {...member, status};
            }
            return member;
          });
        }

        return {...rest, data: updatedPosts};
      });
      const updateFeed = {...response, pages: updatedPages};
      queryClient.setQueryData<IGroupMemberPages>(key, updateFeed);
    }
  };
  const handleJoinGroupActivity = async (groupId = '') => {
    try {
      setLoaderShow(true);
      const response: IGroupMemberStatusStates = await joinGroupActivity(groupId);
      if (response.status === 200) {
        const cacheKey = [QueryKeys.groupMemberCheck, groupId];
        queryClient.invalidateQueries(cacheKey);

        const cacheKeyFollow = [QueryKeys.groupProfileDetails, groupId];
        changeFollowerCount(cacheKeyFollow, true, 'group');
        GroupTypes.map((elem: string) => {
          const cacheKey2 = [QueryKeys.groupsList, elem];
          return updateFollowersCountInList(cacheKey2, groupId, true, 'group');
        });

        setLoaderShow(false);
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        setLoaderShow(false);
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      setLoaderShow(false);
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  const changeFollowerCount = async (key: string[], increment: boolean, from: ACTIONFROM) => {
    const response = await queryClient.getQueryData<IDetailData>(key);
    let newResponse;
    if (response) {
      const {data} = response;
      let newCount = 0;
      switch (from) {
        case 'group':
          newResponse = {...response};
          if (data) {
            newCount = data.totalMembersCount;
            if (increment) {
              newCount += 1;
            } else {
              newCount -= 1;
            }
            newResponse.data = {...data, totalMembersCount: newCount};
            queryClient.setQueryData<IDetailData>(key, newResponse);
          }
          break;
        case 'business':
          newResponse = {...response};
          if (data) {
            newCount = data.totalFollowersCount;
            if (increment) {
              newCount += 1;
            } else {
              newCount -= 1;
            }
            newResponse.data = {...data, totalFollowersCount: newCount};
            queryClient.setQueryData<IDetailData>(key, newResponse);
          }
          break;
        default:
          break;
      }
    }
  };

  const updateFollowersCountInList = async (
    key: string[],
    id: string,
    increment: boolean,
    from: ACTIONFROM,
  ) => {
    const response = await queryClient.getQueryData<IResponsePages>(key);
    if (response) {
      const {pages} = response;

      const updatedPages = pages.map(c => {
        const {data, ...rest} = c;
        let updatedInfo: ICardInfo[] = [];

        switch (from) {
          case 'group':
            if (data?.length) {
              updatedInfo = data.map((elem: ICardInfo) => {
                if (elem.id === id) {
                  let newCount = elem.totalMembers || 0;
                  if (increment) {
                    newCount += 1;
                  } else {
                    newCount -= 1;
                  }
                  return {...elem, totalMembers: newCount};
                }
                return elem;
              });
            }
            return {...rest, data: updatedInfo};
          case 'business':
            if (data?.length) {
              updatedInfo = data.map((elem: ICardInfo) => {
                if (elem.id === id) {
                  let newCount = elem.totalFollowers || 0;
                  if (increment) {
                    newCount += 1;
                  } else {
                    newCount -= 1;
                  }
                  return {...elem, totalFollowers: newCount};
                }
                return elem;
              });
            }
            return {...rest, data: updatedInfo};
          default:
            break;
        }
        return c;
      });
      const updateFeed = {...response, pages: updatedPages};
      queryClient.setQueryData<IResponsePages>(key, updateFeed);
    }
  };

  const reloadGroupProfileData = async (key: string[], status = '') => {
    const response = await queryClient.getQueryData<IProfileData>(key);
    if (response) {
      const {data} = response;
      const updateFeed = {...response, data: {...data, status}};
      queryClient.setQueryData<IProfileData>(key, updateFeed);
    }
  };

  const handleBlockUnBlockMember = async (
    id = '',
    memberId = '',
    action: ActionBlockUnblock,
    navId: MemberShipStatus,
    from: ACTIONFROM,
  ) => {
    try {
      const response: IGroupMemberStatusStates = await blockUnBlockMember(
        id,
        memberId,
        action,
        from,
      );
      if (response.status === 200) {
        let cacheKey: string[] = [];
        let cacheKey1: string[] = [];

        switch (from) {
          case 'group':
            cacheKey = [QueryKeys.groupMembers, id, navId];
            cacheKey1 = [QueryKeys.groupProfileDetails, id];
            break;
          case 'business':
            cacheKey = [QueryKeys.businessPageMembers, id, navId];
            cacheKey1 = [QueryKeys.businessDetails, id];
            break;
          default:
            cacheKey = [];
            break;
        }

        if (action === 'block' || action === 'unblock') {
          const increment = action === 'unblock';
          action = action === 'unblock' ? 'accepted' : 'blocked';
          changeFollowerCount(cacheKey1, increment, from);
          switch (from) {
            case 'group':
              GroupTypes.map((elem: string) => {
                const cacheKey2 = [QueryKeys.groupsList, elem];
                return updateFollowersCountInList(cacheKey2, id, increment, from);
              });
              break;
            case 'business':
              businessType.map((elem: string) => {
                const cacheKey2 = [QueryKeys.businessList, elem];
                return updateFollowersCountInList(cacheKey2, id, increment, from);
              });
              break;
            default:
              cacheKey = [];
              break;
          }
        }
        addGroupMemberToCache(cacheKey, memberId, action, navId);
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  const handleLeaveGroupActivity = async (groupId = '', memberId = '') => {
    try {
      const response: IGroupMemberStatusStates = await leaveGroupActivity(groupId, memberId);
      if (response.status === 200) {
        const cacheKey = [QueryKeys.groupMemberCheck, groupId];
        queryClient.invalidateQueries(cacheKey);
        const newCacheKey = [QueryKeys.groupProfileDetails, groupId];
        queryClient.invalidateQueries(newCacheKey);
        const cacheKeyFollow = [QueryKeys.groupProfileDetails, groupId];
        changeFollowerCount(cacheKeyFollow, false, 'group');
        GroupTypes.map((elem: string) => {
          const cacheKey2 = [QueryKeys.groupsList, elem];
          return updateFollowersCountInList(cacheKey2, groupId, false, 'group');
        });
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  const handleDeactiveGroupActivity = async (groupId = '') => {
    try {
      const response: IGroupMemberStatusStates = await activeDeActiveGroupActivity(
        groupId,
        'deactivate',
      );
      if (response.status === 200) {
        const detailCacheKey = [QueryKeys.groupProfileDetails, groupId];
        queryClient.removeQueries(detailCacheKey);

        const cache = [QueryKeys.groupMemberCheck, groupId];
        queryClient.removeQueries(cache);

        const grpCacheKey = [QueryKeys.groupFeed, groupId];
        queryClient.removeQueries(grpCacheKey);

        const memberCacheKey = [QueryKeys.groupMembers, groupId];
        queryClient.removeQueries(memberCacheKey);
        navigation.goBack();
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  const handleReactiveGroupActivity = async (groupId = '') => {
    try {
      const response: IGroupMemberStatusStates = await activeDeActiveGroupActivity(
        groupId,
        'reactivate',
      );
      if (response.status === 200) {
        const cacheKey = [QueryKeys.groupProfileDetails, groupId];
        reloadGroupProfileData(cacheKey, 'active');

        const cache = [QueryKeys.groupMemberCheck, groupId];
        queryClient.invalidateQueries(cache);

        const grpCacheKey = [QueryKeys.groupFeed, groupId];
        queryClient.invalidateQueries(grpCacheKey);
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  const handleMemberRequest = async (
    id = '',
    memberId = '',
    userId = '',
    action: ActionRequest,
    navId: MemberShipStatus,
    from: ACTIONFROM,
  ) => {
    try {
      const response: IGroupMemberStatusStates = await processMemberRequest(
        id,
        userId,
        action,
        from,
      );
      if (response.status === 200) {
        let cacheKey1: string[] = [];
        let cacheKey: string[] = [];
        switch (from) {
          case 'group':
            cacheKey = [QueryKeys.groupMembers, id, navId];
            cacheKey1 = [QueryKeys.groupProfileDetails, id];
            break;
          case 'business':
            cacheKey = [QueryKeys.businessPageMembers, id, navId];
            cacheKey1 = [QueryKeys.businessDetails, id];
            break;
          default:
            cacheKey = [];
            break;
        }
        if (action === 'approve') {
          action = 'accepted';
          changeFollowerCount(cacheKey1, true, from);
          GroupTypes.map((elem: string) => {
            const cacheKey2 = [QueryKeys.groupsList, elem];
            return updateFollowersCountInList(cacheKey2, id, true, from);
          });
        }
        addGroupMemberToCache(cacheKey, memberId, action, navId);
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  const handleCancelRequestActivity = async (groupId = '', memberId = '') => {
    try {
      setLoaderShow(true);
      const response: IGroupMemberStatusStates = await cancelRequestActivity(groupId, memberId);
      if (response.status === 200) {
        const cacheKey = [QueryKeys.groupMemberCheck, groupId];
        queryClient.invalidateQueries(cacheKey);
        const cacheKeyFollow = [QueryKeys.groupProfileDetails, groupId];
        changeFollowerCount(cacheKeyFollow, false, 'group');
        GroupTypes.map((elem: string) => {
          const cacheKey2 = [QueryKeys.groupsList, elem];
          return updateFollowersCountInList(cacheKey2, groupId, false, 'group');
        });
        setLoaderShow(false);
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        setLoaderShow(false);
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      setLoaderShow(false);
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };
  const handleAcceptRejectRequest = async (groupId = '', memberId = '', type = '') => {
    try {
      setLoaderShow(true);
      const response: IGroupMemberStatusStates = await acceptrejectRequestActivity(
        groupId,
        memberId,
        type,
      );
      if (response.status === 200) {
        const cacheKey = [QueryKeys.groupMemberCheck, groupId];
        queryClient.invalidateQueries(cacheKey);
        const newCacheKey = [QueryKeys.groupProfileDetails, groupId];
        queryClient.invalidateQueries(newCacheKey);
        const cacheKeyFollow = [QueryKeys.groupProfileDetails, groupId];
        changeFollowerCount(cacheKeyFollow, false, 'group');
        GroupTypes.map((elem: string) => {
          const cacheKey2 = [QueryKeys.groupsList, elem];
          return updateFollowersCountInList(cacheKey2, groupId, false, 'group');
        });
        setLoaderShow(false);
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        setLoaderShow(false);
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      setLoaderShow(false);
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  return {
    handleMemberRequest,
    handleBlockUnBlockMember,
    handleLeaveGroupActivity,
    handleDeactiveGroupActivity,
    handleReactiveGroupActivity,
    handleJoinGroupActivity,
    handleCancelRequestActivity,
    handleAcceptRejectRequest,
    isLoadingShow,
  };
};

export {useGroupMember};
