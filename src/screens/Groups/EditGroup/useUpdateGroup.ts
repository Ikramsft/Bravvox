/**
 * @format
 */
import {useMutation, useQueryClient} from 'react-query';
import {useNavigation} from '@react-navigation/native';

import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {RootNavigationType} from '../../Home';
import {showSnackbar} from '../../../utils/SnackBar';
import {GroupType} from '../Queries/useGroupsList';
import {IResponseData} from '../../../constants/types';

export const useUpdateGroup = (groupId: string) => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<RootNavigationType>();

  const addGroup = async (data: FormData) => {
    try {
      const url = `${config.GROUP_API_URL}group/${groupId}`;
      const headers = {'Content-Type': 'multipart/form-data'};
      const response: IResponseData = await client.patch(url, data, {headers});
      showSnackbar({message: response.message, type: 'success'});
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const updateGroupMutation = useMutation(addGroup, {
    onSuccess: () => {
      const type: GroupType = 'myGroups';
      queryClient.invalidateQueries([QueryKeys.groupsList, type]);

      const detailCacheKey = [QueryKeys.groupProfileDetails, groupId];
      queryClient.invalidateQueries(detailCacheKey);

      const memberCacheKey = [QueryKeys.groupMembers, groupId];
      queryClient.invalidateQueries(memberCacheKey);

      navigation.goBack();
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'danger'});
    },
  });

  const tryUpdateGroup = (data: any) => updateGroupMutation.mutate(data);

  return {...updateGroupMutation, tryUpdateGroup};
};
