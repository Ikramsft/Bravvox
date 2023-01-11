/**
 * @format
 */
import {useMutation, useQueryClient} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import ReactNativeBlobUtil from 'react-native-blob-util';

import client from '../../../utils/ApiClient';
import {config} from '../../../config';
import {QueryKeys} from '../../../utils/QueryKeys';
import {RootNavigationType} from '../../Home';
import {showSnackbar} from '../../../utils/SnackBar';
import {GroupType} from '../Queries/useGroupsList';
import {INewGroupData} from '../types/GroupInterfaces';
import {ISelectFile} from '../../../components/AvatarCoverImage';
import {saveImageOnCache} from '../../../constants/common';
import {randomName} from '../../../utils';

export interface IResponseData {
  data: INewGroupData;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

export const useAddGroup = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<RootNavigationType>();

  const addGroup = async (data: FormData) => {
    try {
      const url = `${config.GROUP_API_URL}group`;
      const headers = {'Content-Type': 'multipart/form-data'};
      await client.post(url, data, {headers});
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const addGroupMutation = useMutation(addGroup, {
    onSuccess: () => {
      const type: GroupType = 'myGroups';
      queryClient.invalidateQueries([QueryKeys.groupsList, type]);
      navigation.goBack();
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'danger'});
    },
  });

  const tryAddGroup = (data: FormData) => addGroupMutation.mutate(data);

  return {...addGroupMutation, tryAddGroup};
};

export const updateGroupImage = async (data: ISelectFile, groupId: string, imageType?: string) => {
  try {
    const url = `${config.GROUP_API_URL}group/${groupId}/image`;
    const imageAttribute = {
      data: data.data,
      canvasData: data.canvasData,
      cropBoxData: data.cropBoxData,
      minZoom: data.minZoom,
      zoom: data.zoom,
    };

    const formData = new FormData();
    const originalFileType = data.originalFile.uri.split('.').pop();
    const originalFileName = data.originalFile.name;
    const originalFile = {
      name: originalFileName,
      type: `image/${originalFileType}`,
      uri: data.originalFile.uri,
    };

    const croppedFileType = data.croppedFile.split(';')[0].split('/')[1];
    const croppedFileName = `${randomName(8)}.${croppedFileType}`;

    let croppedFile = {
      name: croppedFileName,
      type: `image/${croppedFileType}`,
      uri: data.croppedFile,
    };

    // save image to local cache for upload
    croppedFile = await saveImageOnCache(croppedFile);
    formData.append('image', originalFile);
    formData.append('croppedImage', croppedFile);
    formData.append('imageViewAttribute', JSON.stringify(imageAttribute));
    formData.append('groupImageType', imageType);
    const headers = {'Content-Type': 'multipart/form-data'};
    const response: IResponseData = await client.post(url, formData, {headers});
    await ReactNativeBlobUtil.fs.unlink(croppedFile.uri.split('file://')[1]);
    return Promise.resolve(response);
  } catch (error: any) {
    const message = error.message ?? 'Something went wrong';
    showSnackbar({message, type: 'danger'});
    return Promise.reject();
  }
};

export interface IHandleCheckResponseData {
  data: any;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

export const checkGroupHandleValid = async (handle: string) => {
  try {
    const {data: res}: IHandleCheckResponseData = await client.get(
      `${config.GROUP_API_URL}group/handleAvailability/${handle}`,
    );
    return res.isAvailable;
  } catch (err: any) {
    return !err.error;
  }
};
