import {IGalleryState, IGalleryActions} from './GalleryInterface';
import {GalleryTypes} from './GalleryTypes';

const initialState: IGalleryState = {
  visible: false,
  imageData: [],
};

const galleryReducer = (state: IGalleryState = initialState, action: IGalleryActions) => {
  switch (action.type) {
    case GalleryTypes.OPENGALLERY:
      return {
        ...state,
        visible: action.payload.visible,
        imageData: action.payload.imageData,
      };
    case GalleryTypes.HIDEGALLERY:
      return {
        ...state,
        visible: false,
        imageData: [],
      };
    default:
      return state;
  }
};

export default galleryReducer;
