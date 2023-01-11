import {Dispatch} from 'redux';
import {IGalleryActions, IGalleyData} from './GalleryInterface';
import {GalleryTypes} from './GalleryTypes';

export const openGallery = (data: IGalleyData) => {
  return (dispatch: Dispatch<IGalleryActions>) => {
    dispatch({
      type: GalleryTypes.OPENGALLERY,
      payload: data,
    });
  };
};

export const closeGallery = () => {
  return (dispatch: Dispatch<IGalleryActions>) => {
    dispatch({
      type: GalleryTypes.HIDEGALLERY,
    });
  };
};
