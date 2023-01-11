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
import {EventTypes} from '../Queries/useEventList';
import {INewEventData} from '../types/EventInterfaces';
import {IEventFormType} from './useEventForm';
import {randomName} from '../../../utils';
import {ISelectFile} from '../../../components/AvatarCoverImage';
import {saveImageOnCache} from '../../../constants/common';

export interface IResponseData {
  data: INewEventData;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

export const useAddEvent = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<RootNavigationType>();

  const addEvent = async (data: FormData) => {
    try {
      const url = `${config.EVENTS_API_URL}event`;
      const headers = {'Content-Type': 'multipart/form-data'};
      await client.post(url, data, {headers});
      return Promise.resolve();
    } catch (error: any) {
      throw new Error(error?.description ?? 'Something went wrong');
    }
  };

  const addEventMutation = useMutation(addEvent, {
    onSuccess: () => {
      const myEventType: EventTypes = 'myEvents';
      const popularEventType: EventTypes = 'popular';
      queryClient.invalidateQueries([QueryKeys.eventList, myEventType]);
      queryClient.invalidateQueries([QueryKeys.eventList, popularEventType]);
      navigation.goBack();
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'danger'});
    },
  });
  const tryAddEvent = (data: FormData) => addEventMutation.mutate(data);

  return {...addEventMutation, tryAddEvent};
};

export const useUpdateEvent = (eventPageId?: string) => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<RootNavigationType>();

  const updateEvent = async (data: IEventFormType) => {
    try {
      const url = `${config.EVENTS_API_URL}event/${eventPageId}`;

      const headers = {'Content-Type': 'multipart/form-data'};
      await client.patch(url, data, {headers});
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const updateEventMutation = useMutation(updateEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.eventProfileDetails]);
      queryClient.invalidateQueries([QueryKeys.eventList]);
      navigation.goBack();
    },
    onError: (error: any) => {
      const message = error.message ?? 'Something went wrong';
      showSnackbar({message, type: 'danger'});
    },
  });

  const tryUpdateEvent = (data: IEventFormType) => updateEventMutation.mutate(data);

  return {...updateEventMutation, tryUpdateEvent};
};

export const updateEventImage = async (data: ISelectFile, eventId?: string, imageType?: string) => {
  try {
    const url = `${config.EVENTS_API_URL}event/${eventId}/image`;
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
    formData.append('eventImageType', imageType);
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
