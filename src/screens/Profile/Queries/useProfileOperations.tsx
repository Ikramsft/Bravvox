import {isArray} from 'lodash';
import {Text, useDisclose} from 'native-base';
import React from 'react';
import {useQueryClient} from 'react-query';
import {useConfirmModal} from '../../../components/CofirmationModel';
import {Title} from '../../../components/Typography';
import useUserInfo from '../../../hooks/useUserInfo';
import {IUserData, RelationShip} from '../../../redux/reducers/user/UserInterface';
import {truncateUsername} from '../../../utils';
import {QueryKeys} from '../../../utils/QueryKeys';
import {useConnectionOperations} from '../../ConnectWithPeople/Queries/useConnectionOptions';
import {IConnectionInvalidRequestData} from '../../ConnectWithPeople/types/ConnectionInterface';
import {FromApprove, useFollowActions} from '../../Home/NewsFeed/useFollowActions';
import {ISearchPages} from '../../Search/Queries/useSearch';
import {IResponseData as ISearchAllData} from '../../Search/Queries/useSearchAll';
import {IFeedPages} from './useFollowers';

const useProfileOperations = (searchParams = null) => {
  const sheetActions = useDisclose();
  const confirm = useConfirmModal();
  const {user} = useUserInfo();
  const {updateConnectionPeople, invalidateConnection, updateConnectionAll} =
    useConnectionOperations();
  const {
    followUser,
    cancelRequest,
    unfollow,
    blockUser,
    rejectRequest,
    approveRequest,
    followBackUser,
    unBlockUser,
  } = useFollowActions();
  const queryClient = useQueryClient();

  const handleProfileCache = async (
    status: RelationShip,
    userId: string,
    userName: string,
    isRemove = false,
    profileId = '',
  ) => {
    const cacheKey = [QueryKeys.userProfileDetails, userName];
    const response = await queryClient.getQueryData<IUserData>(cacheKey);
    let newResponse;
    if (response) {
      newResponse = {...response};
      newResponse.relationshipInfo.Relationship = status;
      queryClient.setQueryData<IUserData>(cacheKey, newResponse);
    }
    handleLoggedInProfileCache(status, userId, profileId, isRemove);
    if (searchParams) {
      handleSearchCache(status, userId, profileId, isRemove);
    }
  };

  const handleLoggedInProfileCache = async (
    status: RelationShip,
    userId: string,
    profileId: string,
    isRemove = false,
  ) => {
    let cacheKey;
    let cacheKeyProfile;

    if (user.documentId) {
      cacheKey = [QueryKeys.useFollowers, user.documentId];
      updateFollowerList(cacheKey, status, userId, isRemove);
    }

    if (profileId && profileId !== user.documentId) {
      cacheKeyProfile = [QueryKeys.useFollowers, profileId];
      updateFollowerList(cacheKeyProfile, status, userId, isRemove);
    }
  };

  const connectionAction = async (
    from: string,
    relationship: RelationShip,
    userId: string,
    sortId?: string,
    processingId?: number,
  ) => {
    const fromData: IConnectionInvalidRequestData = {
      sortId: sortId || '',
      processingId: processingId || 0,
    };

    if (from === 'connectionAll') {
      await invalidateConnection(fromData);
      const cacheKeyConnectionPeople = [QueryKeys.connectionAll];
      updateConnectionAll(cacheKeyConnectionPeople, relationship, userId);
    } else if (from === 'connectionPeople') {
      await invalidateConnection(fromData);
      const cacheKeyConnectionPeople = [QueryKeys.connectionPeople];
      updateConnectionPeople(cacheKeyConnectionPeople, relationship, userId);
    }
  };

  const handleSearchCache = async (
    status: RelationShip,
    userId: string,
    profileId: string,
    isRemove = false,
  ) => {
    const cacheKey = [QueryKeys.searchApi, searchParams];
    const feed = await queryClient.getQueryData<ISearchPages>(cacheKey);
    if (feed) {
      const {pages} = feed;
      const updatedPages = pages.map(c => {
        const {data: users, ...rest} = c;
        const updatedUsers = users.map(usr => {
          if (usr.documentID === userId) {
            return {
              ...usr,
              relationship: status,
            };
          }
          return usr;
        });
        return {...rest, data: updatedUsers};
      });
      const updateFeed = {...feed, pages: updatedPages};
      queryClient.setQueryData<ISearchPages>(cacheKey, {...updateFeed});
    }

    const allCacheKey = [QueryKeys.searchAll, searchParams];
    const allData = await queryClient.getQueryData<ISearchAllData>(allCacheKey);
    if (allData) {
      const {data} = allData;
      if (data) {
        const {accountContainer} = data;
        if (accountContainer) {
          const {accounts} = accountContainer;
          if (isArray(accounts)) {
            const updatedAccounts = accounts.map(usr => {
              if (usr.documentID === userId) {
                return {
                  ...usr,
                  relationship: status,
                };
              }
              return usr;
            });

            const updatedData = {
              ...allData,
              data: {
                ...data,
                accountContainer: {
                  ...accountContainer,
                  accounts: updatedAccounts,
                },
              },
            };
            queryClient.setQueryData<ISearchAllData>(allCacheKey, {...updatedData});
          }
        }
      }
    }
  };

  const updateFollowerList = async (
    cacheKey: string[],
    status: RelationShip,
    userId: string,
    isRemove = false,
  ) => {
    const response = await queryClient.getQueryData<IFeedPages>(cacheKey);

    if (response) {
      const {pages} = response;

      const updatedList = pages.map(c => {
        const {data: followers} = c;
        let newResponse;
        if (isRemove) {
          newResponse = followers.filter(x => x.userId !== userId && x.documentId !== userId);
        } else {
          newResponse = followers.map(follower => {
            if (follower.userId === userId || follower.documentId === userId) {
              follower.relationship = status;
            }
            const result = {...follower};
            return result;
          });
        }

        return {...c, data: newResponse};
      });
      const updateList = {...response, pages: updatedList};
      queryClient.setQueryData<IFeedPages>(cacheKey, updateList);
    }
  };

  const handleUnfollow = (
    userId: string,
    userName: string,
    profileId = '',
    from?: FromApprove,
    sortId?: string,
    processingId?: number,
  ) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Unfollow User</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to unfollow </Text>
          <Title>@{truncateUsername(userName)} </Title>?
        </Text>
      ),
      onConfirm: async () => {
        const response = await unfollow(userId);

        if (response.status === 200) {
          const cacheKeyProfile = [QueryKeys.useFollowers, profileId];
          updateFollowerList(cacheKeyProfile, response.data.relationship, userId, false);
          handleProfileCache(response.data.relationship, userId, userName, true);
          if (from)
            connectionAction(from, response.data.relationship, userId, sortId, processingId);
        }
      },
      submitLabel: 'Confirm',
      cancelLabel: 'Cancel',
    });
  };

  const handleReject = (
    userId: string,
    userName: string,
    from?: FromApprove,
    sortId?: string,
    processingId?: number,
  ) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Reject User</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to reject </Text>
          <Title>@{truncateUsername(userName)} </Title>?
        </Text>
      ),
      onConfirm: async () => {
        const response = await rejectRequest(userId);
        if (response.status === 200) {
          handleProfileCache(response.data.relationship, userId, userName, true);
          if (from)
            connectionAction(from, response.data.relationship, userId, sortId, processingId);
        }
      },
      submitLabel: 'Confirm',
      cancelLabel: 'Cancel',
    });
  };

  const handleBlock = (userId: string, userName: string, profileId = '', from?: FromApprove) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Block User</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to block </Text>
          <Title>@{truncateUsername(userName)} </Title>?
        </Text>
      ),
      onConfirm: async () => {
        const response = await blockUser(userId);
        if (response.status === 200) {
          const cacheKeyProfile = [QueryKeys.useFollowers, profileId];
          updateFollowerList(cacheKeyProfile, response.data.relationship, userId, false);
          handleProfileCache(response.data.relationship, userId, userName);
          if (from) connectionAction(from, response.data.relationship, userId);
        }
      },
      submitLabel: 'Confirm',
      cancelLabel: 'Cancel',
    });
  };

  const handleUnBlock = (userId: string, userName: string, profileId = '', from?: FromApprove) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Unblock User</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to unblock </Text>
          <Title>@{truncateUsername(userName)} </Title>?
        </Text>
      ),
      onConfirm: async () => {
        const response = await unBlockUser(userId);
        if (response.status === 200) {
          const cacheKeyProfile = [QueryKeys.useFollowers, profileId];
          updateFollowerList(cacheKeyProfile, response.data.relationship, userId, false);
          handleProfileCache(response.data.relationship, userId, userName);
          if (from) connectionAction(from, response.data.relationship, userId);
        }
      },
      submitLabel: 'Confirm',
      cancelLabel: 'Cancel',
    });
  };

  const handleApprove = (
    userId: string,
    userName: string,
    profileId?: string,
    from?: FromApprove,
    sortId?: string,
    processingId?: number,
  ) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Approve User</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to approve </Text>
          <Title>@{truncateUsername(userName)} </Title>?
        </Text>
      ),
      onConfirm: async () => {
        const response = await approveRequest(userId);
        if (response.status === 200) {
          const cacheKeyProfile = [QueryKeys.useFollowers, profileId || ''];
          updateFollowerList(cacheKeyProfile, response.data.relationship, userId, false);
          handleProfileCache(response.data.relationship, userId, userName, false, profileId || '');
          if (from)
            connectionAction(from, response.data.relationship, userId, sortId, processingId);
        }
      },
      onCancel: () => handleReject(userId, userName, from, sortId, processingId),
      submitLabel: 'Approve',
      cancelLabel: 'Reject',
    });
  };

  const handleFollow = async (
    userId: string,
    userName: string,
    profileId?: string,
    from?: FromApprove,
    sortId?: string,
    processingId?: number,
    deletePeopleFromCache?:(sortId:string)=>void,
  ) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Follow User</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to follow </Text>
          <Title>@{truncateUsername(userName)} </Title>?
        </Text>
      ),
      onConfirm: async () => {
        const response = await followUser(userId);
        if (response.status === 200) {
          handleProfileCache(response.data.relationship, userId, userName, false, profileId || '');
          if (from)
          deletePeopleFromCache(userId)
        }
      },
      submitLabel: 'Confirm',
      cancelLabel: 'Cancel',
    });
  };

  const handleFollowBackUser = async (
    userId: string,
    userName: string,
    from: FromApprove,
    sortId?: string,
    processingId?: number,
  ) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Follow User</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to follow </Text>
          <Title>@{truncateUsername(userName)} </Title>?
        </Text>
      ),
      onConfirm: async () => {
        const response = await followBackUser(userId);
        if (response.status === 200) {
          handleProfileCache(response.data.relationship, userId, userName);
          connectionAction(from, response.data.relationship, userId, sortId, processingId);
        }
      },
      submitLabel: 'Confirm',
      cancelLabel: 'Cancel',
    });
  };

  const handleCancel = async (userId: string, userName: string, profileId?: string) => {
    const response = await cancelRequest(userId);
    if (response.status === 200) {
      const cacheKeyProfile = [QueryKeys.useFollowers, profileId || ''];
      const isRemove =
        (response.data.relationship === 'Follow' && user.documentId === profileId) || false;
      updateFollowerList(cacheKeyProfile, response.data.relationship, userId, isRemove);
      handleProfileCache(response.data.relationship, userId, userName, isRemove);
    }
  };

  return {
    ...sheetActions,
    handleFollow,
    handleCancel,
    handleUnfollow,
    handleApprove,
    handleFollowBackUser,
    handleBlock,
    handleUnBlock,
  };
};

export {useProfileOperations};
