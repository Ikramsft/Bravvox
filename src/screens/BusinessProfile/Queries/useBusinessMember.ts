/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @format
 */
import {useQueryClient} from 'react-query';
import { useState } from 'react';
import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {IBusinessMemberStatusState} from '../types/BusinessInterfaces';
import {showSnackbar} from '../../../utils/SnackBar';
import {QueryKeys} from '../../../utils/QueryKeys';
import {IResponseData as IDetailData} from '../../GroupProfile/Queries/useGroupDetail';
import {
  IGroupsPages as IResponsePages, //  this should be use for Groups , business and events
} from '../../Groups/Queries/useGroupsList';
import {IGroupCardInfo as ICardInfo} from '../../../screens/Groups/types/GroupInterfaces';
import {businessType} from '../../BusinessPage/Queries/useBusinessList';

export interface IBusinessMemberStatusStates {
  data?: IBusinessMemberStatusState;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

async function leaveBusinessActivity(
  businessId: string,
  memberId: string,
): Promise<IBusinessMemberStatusStates> {
  try {
    const url = `${config.BUSINESS_PAGE_API_URL}businessPage/${businessId}/follower/${memberId}`;
    const res: IBusinessMemberStatusStates = await client.delete(url);
    return res;
  } catch (error: any) {
    return error as IBusinessMemberStatusStates;
  }
}

async function joinBusinessActivity(businessId: string): Promise<IBusinessMemberStatusStates> {
  try {
    const url = `${config.BUSINESS_PAGE_API_URL}businessPage/${businessId}/follow`;
    const res: IBusinessMemberStatusStates = await client.post(url);
    return res;
  } catch (error: any) {
    return error as IBusinessMemberStatusStates;
  }
}

async function cancelRequestActivity(
  businessId: string,
  memberId: string,
): Promise<IBusinessMemberStatusStates> {
  try {
    const url = `${config.BUSINESS_PAGE_API_URL}businessPage/${businessId}/follower/${memberId}/cancel`;
    const res: IBusinessMemberStatusStates = await client.post(url);
    return res;
  } catch (error: any) {
    return error as IBusinessMemberStatusStates;
  }
}

const useBusinessMember = () => {
  const queryClient = useQueryClient();
  const [isLoadingShow, setLoadingShow] = useState(false);

  const changeFollowerCount = async (key: string[], increment: boolean) => {
    const response = await queryClient.getQueryData<IDetailData>(key);
    let newResponse;
    if (response) {
      const {data} = response;
      let newCount = 0;

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
    }
  };

  const updateFollowersCountInList = async (key: string[], id: string, increment: boolean) => {
    const response = await queryClient.getQueryData<IResponsePages>(key);
    if (response) {
      const {pages} = response;

      const updatedPages = pages.map(c => {
        const {data, ...rest} = c;
        let updatedInfo: ICardInfo[] = [];

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

      });
      const updateFeed = {...response, pages: updatedPages};
      queryClient.setQueryData<IResponsePages>(key, updateFeed);
    }
  };

  const handleLeaveBusinessActivity = async (businessId = '', memberId = '') => {
    try {
      const response: IBusinessMemberStatusStates = await leaveBusinessActivity(
        businessId,
        memberId,
      );
      if (response.status === 200) {
        const cacheKey = [QueryKeys.businessMemberCheck, businessId];
        queryClient.invalidateQueries(cacheKey);
        const cacheKey1 = [QueryKeys.businessDetails, businessId];
        changeFollowerCount(cacheKey1, false);
        businessType.map((elem: string) => {
          const cacheKey2 = [QueryKeys.businessList, elem];
          return updateFollowersCountInList(cacheKey2, businessId, false);
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
  const handleJoinBusinessActivity = async (businessId = '') => {
    try {
      setLoadingShow(true);
      const response: IBusinessMemberStatusStates = await joinBusinessActivity(businessId);
      if (response.status === 200) {
        setLoadingShow(false);
        const cacheKey = [QueryKeys.businessMemberCheck, businessId];
        queryClient.invalidateQueries(cacheKey);
        const cacheKey1 = [QueryKeys.businessDetails, businessId];
        changeFollowerCount(cacheKey1, true);
        businessType.map((elem: string) => {
          const cacheKey2 = [QueryKeys.businessList, elem];
          return updateFollowersCountInList(cacheKey2, businessId, true);
        });
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        setLoadingShow(false);
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      setLoadingShow(false);
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  const handleCancelRequestActivity = async (businessId = '', memberId = '') => {
    try {
      setLoadingShow(true);
      const response: IBusinessMemberStatusStates = await cancelRequestActivity(
        businessId,
        memberId,
      );
      if (response.status === 200) {
        setLoadingShow(false);
        const cacheKey = [QueryKeys.businessMemberCheck, businessId];
        queryClient.invalidateQueries(cacheKey);
        showSnackbar({message: response.message, type: 'success'});
      } else if (response.error) {
        setLoadingShow(false);
        showSnackbar({message: response.message, type: 'danger'});
      }
    } catch (error: any) {
      setLoadingShow(false);
      const message = error?.message || 'Something went wrong!';
      showSnackbar({message, type: 'danger'});
    }
  };

  return {
    handleLeaveBusinessActivity,
    handleJoinBusinessActivity,
    handleCancelRequestActivity,
    isLoadingShow
  };
};

export {useBusinessMember};
