import React from 'react';
import ImageView from 'react-native-image-viewing';
import {ImageSource} from 'react-native-image-viewing/dist/@types';

interface IGroupProfileProps {
  images: ImageSource[];
  isVisible: boolean;
  imageIndex?: number;
  onRequestClose: () => void;
}

function ImageZoomView(props: IGroupProfileProps) {
  const {images, isVisible, imageIndex, onRequestClose} = props;

  return (
    <ImageView
      imageIndex={imageIndex || 0}
      images={images}
      presentationStyle="fullScreen"
      swipeToCloseEnabled={false}
      visible={isVisible}
      onRequestClose={() => onRequestClose()}
    />
  );
}

ImageZoomView.defaultProps = {
  imageIndex: 0,
};

export default ImageZoomView;
