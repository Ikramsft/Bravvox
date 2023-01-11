/**
 * @format
 */
import {useDispatch} from 'react-redux';
import {closeGallery, openGallery} from '../../redux/reducers/gallery/GalleryActions';
import {IGalleyData} from '../../redux/reducers/gallery/GalleryInterface';

export const useImageGallery = () => {
  const dispatch = useDispatch();

  const showGallery = (data: IGalleyData) => {
    dispatch(openGallery(data));
  };

  const hideGallery = () => {
    dispatch(closeGallery());
  };

  return {showGallery, hideGallery};
};
