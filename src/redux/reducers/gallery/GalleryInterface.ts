import {GalleryTypes} from './GalleryTypes';

interface IGalleryOpen {
  type: GalleryTypes.OPENGALLERY;
  payload: IGalleyData;
}
interface IGalleryHide {
  type: GalleryTypes.HIDEGALLERY;
 
}
export interface IGalleryImage {
  uri: string | undefined;
}
export interface IGalleyData {
  visible: boolean;
  imageData: IGalleryImage[]  ;
}
export interface IGalleryState {
    visible: boolean;
    imageData: IGalleryImage[] ;
  }
export type IGalleryActions = |IGalleryOpen|IGalleryHide;
